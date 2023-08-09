import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [],
    controllers: [OrdersController],
    providers: [OrdersService, ConfigService],
})
export class OrdersModule {}
