import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async check() {
    this.logger.debug('API is works');

    return 'API is works';
  }
}
