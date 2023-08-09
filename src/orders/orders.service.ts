import { Injectable, Logger } from '@nestjs/common';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { OAuth2Client } from 'google-auth-library'
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { IOrder } from "./types";

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly configService: ConfigService
  ) {}

  async getAll(googleDocId: string): Promise<IOrder[]> {
    // Initialize the OAuth2Client with your app's oauth credentials
    // https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication?id=oauth
    const oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    });

    // Pre-configure the client with credentials you have stored in e.g. your database
    // NOTE - `refresh_token` is required, `access_token` and `expiry_date` are optional
    // (the refresh token is used to generate a missing/expired access token)
    // const { accessToken, refreshToken, expiryDate } = await fetchUserGoogleCredsFromDatabase();

    const accessToken = this.configService.get<string>('ACCESS_TOKEN');
    const refreshToken = this.configService.get<string>('REFRESH_TOKEN');
    const expiryDate = Number(this.configService.get<string>('EXPIRES_IN'));

    oauthClient.credentials.access_token = accessToken;
    oauthClient.credentials.refresh_token = refreshToken;
    oauthClient.credentials.expiry_date = expiryDate; // Unix epoch milliseconds

    // Listen in whenever a new access token is obtained, as you might want to store the new token in your database
    // Note that the refresh_token never changes (unless it's revoked, in which case your end-user will
    // need to go through the full authentication flow again), so storing the new access_token is optional
    oauthClient.on('tokens', (credentials) => {
      this.logger.log(credentials.access_token);
      this.logger.log(credentials.scope);
      this.logger.log(credentials.expiry_date);
      this.logger.log(credentials.token_type); // will always be 'Bearer'
    });

    const doc = new GoogleSpreadsheet(googleDocId, oauthClient);

    await doc.loadInfo(); // loads document properties and worksheets
    await this.logger.debug(`doc title: ${doc.title}`);

    const sheet = doc.sheetsByIndex[0]; // or use `doc.sheetsById[id]` or `doc.sheetsByTitle[title]`
    await this.logger.debug(`sheet(tab) title: ${sheet.title}`);
    await this.logger.log({ sheet: sheet._spreadsheet.sheetsApi })
    // await this.logger.log(sheet.rowCount);
    // await this.logger.log(sheet.cellStats);
    const rows = await sheet.getRows(); // can pass in { limit, offset }

    await sheet.loadCells(); // loads range of cells into local cache - DOES NOT RETURN THE CELLS
    await this.logger.log('sheet.cellStats: ', sheet.cellStats); // total cells, loaded, how many non-empty

    const ordersArr: IOrder[] = [];
    const firstRow = 3;
    const lastRow = rows.length;
    rowLoop: for (let row=firstRow; row<lastRow; row++) {
      const newRow = {
        rowNum: null, // name of row
        date: null, // date of order
        orderId: null,
        card: null,
        sumPayment: null,
        status: null,
        postPayment: null,
        screenshot: null
      };
      const startCol = 2;
      const endCol = 20;
      for (let col=startCol; col<endCol; col++) {
        const colRes = await sheet.getCell(row, col);
        newRow.rowNum = row + 1;
        switch (col) {
          case 2:
            newRow.date = colRes.formattedValue;
            break;
          case 3:
            if (!colRes.value) {
              this.logger.debug(`EXIT, row=${newRow.rowNum}, colRes.value=${colRes.value}`)
              break rowLoop
            }
            newRow.orderId = colRes.value;
            break;
          case 4:
            newRow.card = colRes.value;
            break;
          case 5:
            newRow.sumPayment = colRes.numberValue;
            break;
          case 7:
            newRow.status = colRes.value;
            break;
          case 9:
            newRow.postPayment = colRes.numberValue;
            break;
          case 10:
            newRow.screenshot = colRes.value;
            break;
          default:
            // this.logger.log(`row${row} col${col}`, colRes.value)
        }
      }
      ordersArr.push(newRow);
    }

    return ordersArr;
  }
}
