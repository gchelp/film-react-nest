import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  daytime: string;

  @Column({ type: 'int' })
  hall: number;

  @Column({ type: 'int' })
  rows: number;

  @Column({ type: 'int' })
  seats: number;

  @Column({ type: 'double precision' })
  price: number;

  @Column('simple-array')
  taken: string[];

  @Column({ type: 'uuid', nullable: true })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
