import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FilmsRepository } from '../repository/films.repository';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async create(dto: CreateOrderDto): Promise<OrderResultDto> {
    if (!dto.tickets?.length) {
      throw new BadRequestException('No tickets in order');
    }

    // 1. Проверяем все билеты до записи
    const keys = new Set<string>();
    for (const t of dto.tickets) {
      const session = await this.filmsRepository.getSession(t.film, t.session);
      if (!session) throw new NotFoundException('Film or session not found');

      if (
        t.row < 1 ||
        t.row > session.rows ||
        t.seat < 1 ||
        t.seat > session.seats
      ) {
        throw new BadRequestException(`Seat ${t.row}:${t.seat} does not exist`);
      }

      const key = `${t.session}|${t.row}:${t.seat}`;
      if (keys.has(key) || session.taken.includes(`${t.row}:${t.seat}`)) {
        throw new BadRequestException(
          `Seat ${t.row}:${t.seat} is already taken`,
        );
      }
      keys.add(key);
    }

    // 2. Записываем
    for (const t of dto.tickets) {
      await this.filmsRepository.takeSeat(
        t.film,
        t.session,
        `${t.row}:${t.seat}`,
      );
    }

    const items = dto.tickets.map((t) => ({ ...t, id: randomUUID() }));
    return { total: items.length, items };
  }
}
