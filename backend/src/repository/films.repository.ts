import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
  hall: s.hall,
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

  async takeSeat(
    filmId: string,
    sessionId: string,
    seatKey: string,
  ): Promise<void> {
    const result = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: { $elemMatch: { id: sessionId, taken: { $ne: seatKey } } },
      },
      { $push: { 'schedule.$.taken': seatKey } },
    );

    if (result.matchedCount === 0) {
      const film = await this.filmModel.findOne({ id: filmId }).lean();
      const session = film?.schedule.find((s) => s.id === sessionId);
      if (!film || !session)
        throw new NotFoundException('Film or session not found');
      throw new BadRequestException(`Seat ${seatKey} is already taken`);
    }
  }

  async getSession(filmId: string, sessionId: string): Promise<Session | null> {
    const film = await this.filmModel.findOne({ id: filmId }).lean();
    return film?.schedule.find((s) => s.id === sessionId) ?? null;
  }
}
