import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule } from "@nestjs/config";
import { configuration } from './config/configuration';

@Module({
  imports: [
    // conf
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [configuration]
    }),
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
