import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let create: jest.Mock<Promise<OrderResultDto>, [CreateOrderDto]>;

  const dto: CreateOrderDto = {
    email: 'user@example.com',
    phone: '+79990000000',
    tickets: [
      {
        film: '11111111-1111-4111-8111-111111111111',
        session: '22222222-2222-4222-8222-222222222222',
        daytime: '2026-11-13T18:00:00.000Z',
        row: 1,
        seat: 2,
        price: 350,
      },
    ],
  };

  const result: OrderResultDto = {
    total: 1,
    items: [{ ...dto.tickets[0], id: '33333333-3333-4333-8333-333333333333' }],
  };

  beforeEach(async () => {
    create = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: { create } }],
    }).compile();

    controller = module.get(OrderController);
  });

  describe('create', () => {
    it('передаёт тело запроса в сервис и возвращает созданный заказ', async () => {
      create.mockResolvedValue(result);

      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(create).toHaveBeenCalledTimes(1);
      expect(create).toHaveBeenCalledWith(dto);
    });

    it('пробрасывает BadRequestException, если место занято', async () => {
      create.mockRejectedValue(new BadRequestException('already taken'));

      await expect(controller.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('пробрасывает NotFoundException, если сеанс не найден', async () => {
      create.mockRejectedValue(new NotFoundException('not found'));

      await expect(controller.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
