import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmScheduleDto, FilmsListDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let findAll: jest.Mock<Promise<FilmsListDto>, []>;
  let findSchedule: jest.Mock<Promise<FilmScheduleDto>, [string]>;

  const filmsList: FilmsListDto = {
    total: 1,
    items: [
      {
        id: 'film-1',
        rating: 8.5,
        director: 'Director',
        tags: ['drama'],
        title: 'Title',
        about: 'About',
        description: 'Description',
        image: '/image.png',
        cover: '/cover.png',
      },
    ],
  };

  const schedule: FilmScheduleDto = {
    total: 1,
    items: [
      {
        id: 'session-1',
        daytime: '2026-11-13T18:00:00.000Z',
        hall: 1,
        rows: 5,
        seats: 10,
        price: 350,
        taken: ['1:1'],
      },
    ],
  };

  beforeEach(async () => {
    findAll = jest.fn();
    findSchedule = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        { provide: FilmsService, useValue: { findAll, findSchedule } },
      ],
    }).compile();

    controller = module.get(FilmsController);
  });

  describe('findAll', () => {
    it('возвращает список фильмов, полученный от сервиса', async () => {
      findAll.mockResolvedValue(filmsList);

      await expect(controller.findAll()).resolves.toEqual(filmsList);
      expect(findAll).toHaveBeenCalledTimes(1);
    });

    it('пробрасывает ошибку сервиса', async () => {
      findAll.mockRejectedValue(new Error('db error'));

      await expect(controller.findAll()).rejects.toThrow('db error');
    });
  });

  describe('findSchedule', () => {
    it('передаёт id фильма в сервис и возвращает расписание', async () => {
      findSchedule.mockResolvedValue(schedule);

      await expect(controller.findSchedule('film-1')).resolves.toEqual(
        schedule,
      );
      expect(findSchedule).toHaveBeenCalledWith('film-1');
    });

    it('пробрасывает ошибку сервиса', async () => {
      findSchedule.mockRejectedValue(new Error('db error'));

      await expect(controller.findSchedule('film-1')).rejects.toThrow(
        'db error',
      );
    });
  });
});
