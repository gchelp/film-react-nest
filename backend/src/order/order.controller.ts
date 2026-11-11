import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, TicketDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: CreateOrderDto | TicketDto[]) {
    const dto: CreateOrderDto = Array.isArray(body)
      ? { email: '', phone: '', tickets: body }
      : body;
    return this.orderService.create(dto);
  }
}
