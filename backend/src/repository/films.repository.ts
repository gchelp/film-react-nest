import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmDto[]>;
  abstract findSchedule(id: string): Promise<ScheduleDto[]>;
  abstract getSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null>;
  abstract takeSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void>;
}

const toFilmDto = (f: Film): FilmDto => ({
  id: f.id,
  rating: f.rating,
  director: f.director,
  tags: f.tags,
  title: f.title,
  about: f.about,
  description: f.description,
  image: f.image,
  cover: f.cover,
});

const toScheduleDto = (s: Schedule): ScheduleDto => ({
  id: s.id,
  daytime: s.daytime,
  hall: s.hall,
  rows: s.rows,
  seats: s.seats,
  price: s.price,
  taken: s.taken,
});

@Injectable()
export class FilmsTypeormRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film) private readonly films: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.films.find();
    return films.map(toFilmDto);
  }

  async findSchedule(id: string): Promise<ScheduleDto[]> {
    const film = await this.films.findOne({ where: { id } });
    if (!film) throw new NotFoundException('Film not found');
    const items = await this.schedules.find({
      where: { filmId: id },
      order: { daytime: 'ASC' },
    });
    return items.map(toScheduleDto);
  }

  async getSession(
    filmId: string,
    sessionId: string,
  ): Promise<Schedule | null> {
    return this.schedules.findOne({ where: { id: sessionId, filmId } });
  }

  async takeSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    const result = await this.schedules.query(
      `UPDATE schedules
       SET taken = CASE WHEN taken = '' THEN $3 ELSE taken || ',' || $3 END
       WHERE id = $1 AND "filmId" = $2
         AND NOT ($3 = ANY(string_to_array(taken, ',')))`,
      [sessionId, filmId, seatKey],
    );

    const affected: number = Array.isArray(result) ? result[1] : 0;
    if (!affected) {
      const session = await this.getSession(filmId, sessionId);
      if (!session) throw new NotFoundException('Film or session not found');
      throw new BadRequestException(`Seat ${seatKey} is already taken`);
    }
  }
}
