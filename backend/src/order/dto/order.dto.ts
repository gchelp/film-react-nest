//TODO реализовать DTO для /orders
export class TicketDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class CreateOrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export class OrderTicketDto extends TicketDto {
  id: string;
}

export class OrderResultDto {
  total: number;
  items: OrderTicketDto[];
}
