import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  create(dto: CreateOrderDto): OrderResultDto {
    const items = dto.tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));
    return { total: items.length, items };
  }
}
