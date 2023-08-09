import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { IOrder } from './types';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async getAll(): Promise<IOrder[]> {
    return await this.ordersService.getAll();
  }
}
