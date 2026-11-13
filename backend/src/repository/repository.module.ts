import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmsRepository, FilmsTypeormRepository } from './films.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const driver = config.getOrThrow<string>('DATABASE_DRIVER');
        if (driver !== 'postgres') {
          throw new Error(`Unsupported DATABASE_DRIVER: ${driver}`);
        }
        const url = new URL(config.getOrThrow<string>('DATABASE_URL'));
        return {
          type: 'postgres' as const,
          host: url.hostname,
          port: Number(url.port) || 5432,
          database: url.pathname.slice(1),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [{ provide: FilmsRepository, useClass: FilmsTypeormRepository }],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
