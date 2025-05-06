import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entity/movie.entity';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ // 타입ORM에서 movie 레포지토리를 만들어서 IOC가 우리가 해달라고하는 곳에(@InjectRepository) 인젝트를 알아서 해줌 
      Movie,
      MovieDetail,
      Director,
      Genre
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule { }
