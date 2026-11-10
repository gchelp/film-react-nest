import { Injectable } from '@nestjs/common';
import { FilmsListDto, FilmScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  findAll(): FilmsListDto {
    return { total: 0, items: [] };
  }

  findSchedule(id: string): FilmScheduleDto {
    return { total: 0, items: [] };
  }
}
