import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, Session } from '../films/schemas/film.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

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

const toScheduleDto = (s: Session): ScheduleDto => ({
  id: s.id,
  daytime: s.daytime,
  hall: String(s.hall),
  rows: s.rows,
  seats: s.seats,
  price: s.price,
  taken: s.taken,
});

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().lean();
    return films.map(toFilmDto);
  }

  async findSchedule(id: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel.findOne({ id }).lean();
    if (!film) throw new NotFoundException('Film not found');
    return film.schedule.map(toScheduleDto);
  }
}