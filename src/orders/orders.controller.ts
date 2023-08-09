import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { IOrder } from './types';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    description: 'get all orders by document id'
  })
  @Get('/:documentId')
  async getAll(
    @Param('documentId') documentId: string
  ): Promise<IOrder[]> {
    return await this.ordersService.getAll(documentId);
  }
}
