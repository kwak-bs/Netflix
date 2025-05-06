import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entity/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, Repository } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';


@Injectable()
export class MovieService {

  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly dataSource: DataSource, // 걍 TypeORM에서 불러오는 요소임 
  ) { }

  async findAll(title?: string) {
    const qb = await this.movieRepository.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director') // movie 테이블의 director 값과 director 테이블의 값 join해서 가져옴
      .leftJoinAndSelect('movie.genres', 'genres');


    if (title) {
      qb.where('movie.title LIKE :title', { title: `%${title}%` })
    }

    return await qb.getManyAndCount();

    // 전체 조회
    // if (!title) {
    //   return [await this.movieRepository.find({
    //     relations: ['director', 'genres']
    //   }), await this.movieRepository.count()];
    // }

    // // 특정 타이틀 포함 조회
    // return this.movieRepository.findAndCount({
    //   where: {
    //     title: Like(`%${title}%`),
    //   },
    //   relations: ['director', 'genres']
    // });
  }

  async findOne(id: number) {

    const movie = await this.movieRepository.createQueryBuilder('movie')
      .leftJoinAndSelect('movie.director', 'director')
      .leftJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.detail', 'detail')
      .where('movie.id = :id', { id })
      .getOne();


    // const movie = await this.movieRepository.findOne({
    //   where: {
    //     id
    //   },
    //   relations: ['detail', 'director', 'genres']
    // })

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const qr = this.dataSource.createQueryRunner(); // 트랜잭션 만들때는 QeuryRunner를 써야함

    await qr.connect();
    await qr.startTransaction();

    // 트랜잭션은 try / catch 무조건 써줘야함 그리고 try/catch 쓸때에는 finally도 써야함 
    try {
      const director = await qr.manager.findOne(Director, {
        where: {
          id: createMovieDto.directorId,
        },
      });

      if (!director) {
        throw new NotFoundException("존재하지 않는 감독입니다!");
      }

      const genres = await qr.manager.find(Genre, {
        where: {
          id: In(createMovieDto.genreIds)
        }
      })

      if (genres.length !== createMovieDto.genreIds.length) {
        throw new NotFoundException(`존재하지 않는 장르가 있습니다! -> ${genres.map(genre => genre.id).join(',')}`);
      }

      const { detail, title } = createMovieDto;


      // const movie = await this.movieRepository.save({
      //   title,
      //   detail: {
      //     detail
      //   },
      //   director,
      //   genres,
      // });

      // 걍 Repository 패턴이 좋은듯 위가 Repository 패턴이고 아래가 QueryBuilder 쓴거임. 
      // ManyToMany는 아예 QueryBuilder에서 생성 지원도 안됨.

      const movieDetail = await qr.manager.createQueryBuilder()
        .insert()
        .into(MovieDetail)
        .values({
          detail
        })
        .execute();


      const movieDetailId = movieDetail.identifiers[0].id; // 생성한 값의 id를 가져올 수 있음.

      const movie = await qr.manager.createQueryBuilder()
        .insert()
        .into(Movie)
        .values({
          title,
          detail: {
            id: +movieDetailId
          },
          director
        })
        .execute();

      const movieId = movie.identifiers[0].id;

      await qr.manager.createQueryBuilder()
        .relation(Movie, 'genres')
        .of(movieId)
        .add(genres.map(genre => genre.id));

      await qr.commitTransaction();

      return await this.movieRepository.findOne({
        where: {
          id: movieId,
        },
        relations: ['detail', 'director', 'genres']
      });


    } catch (e) {

      await qr.rollbackTransaction();
      throw e;
    } finally {

      await qr.release();
    }
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const qr = this.dataSource.createQueryRunner();

    await qr.connect();
    await qr.startTransaction();

    try {
      const movie = await qr.manager.findOne(Movie, {
        where: {
          id,
        },
        relations: ['detail', 'genres']
      })

      if (!movie) {
        throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
      }

      const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;

      let newGenres;
      if (genreIds) {
        const genres = await qr.manager.find(Genre, {
          where: {
            id: In(genreIds)
          }
        });

        if (genres.length !== updateMovieDto.genreIds?.length) {
          throw new NotFoundException(`존재하지 않는 장르가 있습니다! -> ${genres.map(genre => genre.id).join(',')}`);
        }

        newGenres = genres;
      }

      let newDirector;

      if (directorId) {
        const director = await qr.manager.findOne(Director, {
          where: {
            id: directorId,
          }
        });

        if (!director) {
          throw new NotFoundException('존재하지 않는 ID의 감독입니다!');
        }

        newDirector = director;
      }

      const movieUpdateFields = {
        ...movieRest,
        ...(newDirector && { director: newDirector })
      }

      await qr.manager.createQueryBuilder()
        .update(Movie)
        .set(movieUpdateFields)
        .where('id = :id', { id })
        .execute()
      // await this.movieRepository.update(
      //   { id },
      //   movieUpdateFields
      // );

      if (detail) {
        await qr.manager.createQueryBuilder()
          .update(MovieDetail)
          .set({ detail })
          .where('id = :id', { id: movie.detail.id })
          .execute()

        // await this.movieDetailRepository.update(
        //   {
        //     id: movie.detail.id
        //   },
        //   {
        //     detail,
        //   }
        // )
      }

      if (newGenres) {
        await qr.manager.createQueryBuilder()
          .relation(Movie, 'genres')
          .of(id)
          // 왼쪽은 새로 추가, 오른쪽은 삭제 , 아래 Repository 패턴 대신 쓸수 있다 이 말임 ㅇㅇ 
          .addAndRemove(newGenres.map(genre => genre.id), movie.genres.map(genre => genre.id));
      }

      // const newMovie = await this.movieRepository.findOne({
      //   where: {
      //     id,
      //   },
      //   relations: ['detail', 'director', 'genres']
      // })

      // if (newMovie) {
      //   newMovie.genres = newGenres;
      //   await this.movieRepository.save(newMovie);
      // }

      await qr.commitTransaction();

      return this.movieRepository.findOne({
        where: {
          id,
        },
        relations: ['detail', 'director', 'genres']
      });
    } catch (e) {

      await qr.rollbackTransaction();
      throw e;
    } finally {

      await qr.release();
    }
  }

  async remove(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail']
    })


    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다!');
    }

    // await this.movieRepository.delete(id);
    await this.movieRepository.createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    await this.movieDetailRepository.delete(movie.detail.id);

    return id;
  }
}
function IN(genreIds: number[]): number | import("typeorm").FindOperator<number> | undefined {
  throw new Error('Function not implemented.');
}

