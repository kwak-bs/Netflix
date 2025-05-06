"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const movie_entity_1 = require("./entity/movie.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movie_detail_entity_1 = require("./entity/movie-detail.entity");
const director_entity_1 = require("../director/entity/director.entity");
const genre_entity_1 = require("../genre/entity/genre.entity");
let MovieService = class MovieService {
    movieRepository;
    movieDetailRepository;
    directorRepository;
    genreRepository;
    dataSource;
    constructor(movieRepository, movieDetailRepository, directorRepository, genreRepository, dataSource) {
        this.movieRepository = movieRepository;
        this.movieDetailRepository = movieDetailRepository;
        this.directorRepository = directorRepository;
        this.genreRepository = genreRepository;
        this.dataSource = dataSource;
    }
    async findAll(title) {
        const qb = await this.movieRepository.createQueryBuilder('movie')
            .leftJoinAndSelect('movie.director', 'director')
            .leftJoinAndSelect('movie.genres', 'genres');
        if (title) {
            qb.where('movie.title LIKE :title', { title: `%${title}%` });
        }
        return await qb.getManyAndCount();
    }
    async findOne(id) {
        const movie = await this.movieRepository.createQueryBuilder('movie')
            .leftJoinAndSelect('movie.director', 'director')
            .leftJoinAndSelect('movie.genres', 'genres')
            .leftJoinAndSelect('movie.detail', 'detail')
            .where('movie.id = :id', { id })
            .getOne();
        if (!movie) {
            throw new common_1.NotFoundException('존재하지 않는 ID의 영화입니다!');
        }
        return movie;
    }
    async create(createMovieDto) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const director = await qr.manager.findOne(director_entity_1.Director, {
                where: {
                    id: createMovieDto.directorId,
                },
            });
            if (!director) {
                throw new common_1.NotFoundException("존재하지 않는 감독입니다!");
            }
            const genres = await qr.manager.find(genre_entity_1.Genre, {
                where: {
                    id: (0, typeorm_2.In)(createMovieDto.genreIds)
                }
            });
            if (genres.length !== createMovieDto.genreIds.length) {
                throw new common_1.NotFoundException(`존재하지 않는 장르가 있습니다! -> ${genres.map(genre => genre.id).join(',')}`);
            }
            const { detail, title } = createMovieDto;
            const movieDetail = await qr.manager.createQueryBuilder()
                .insert()
                .into(movie_detail_entity_1.MovieDetail)
                .values({
                detail
            })
                .execute();
            const movieDetailId = movieDetail.identifiers[0].id;
            const movie = await qr.manager.createQueryBuilder()
                .insert()
                .into(movie_entity_1.Movie)
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
                .relation(movie_entity_1.Movie, 'genres')
                .of(movieId)
                .add(genres.map(genre => genre.id));
            await qr.commitTransaction();
            return await this.movieRepository.findOne({
                where: {
                    id: movieId,
                },
                relations: ['detail', 'director', 'genres']
            });
        }
        catch (e) {
            await qr.rollbackTransaction();
            throw e;
        }
        finally {
            await qr.release();
        }
    }
    async update(id, updateMovieDto) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();
        try {
            const movie = await qr.manager.findOne(movie_entity_1.Movie, {
                where: {
                    id,
                },
                relations: ['detail', 'genres']
            });
            if (!movie) {
                throw new common_1.NotFoundException('존재하지 않는 ID의 영화입니다!');
            }
            const { detail, directorId, genreIds, ...movieRest } = updateMovieDto;
            let newGenres;
            if (genreIds) {
                const genres = await qr.manager.find(genre_entity_1.Genre, {
                    where: {
                        id: (0, typeorm_2.In)(genreIds)
                    }
                });
                if (genres.length !== updateMovieDto.genreIds?.length) {
                    throw new common_1.NotFoundException(`존재하지 않는 장르가 있습니다! -> ${genres.map(genre => genre.id).join(',')}`);
                }
                newGenres = genres;
            }
            let newDirector;
            if (directorId) {
                const director = await qr.manager.findOne(director_entity_1.Director, {
                    where: {
                        id: directorId,
                    }
                });
                if (!director) {
                    throw new common_1.NotFoundException('존재하지 않는 ID의 감독입니다!');
                }
                newDirector = director;
            }
            const movieUpdateFields = {
                ...movieRest,
                ...(newDirector && { director: newDirector })
            };
            await qr.manager.createQueryBuilder()
                .update(movie_entity_1.Movie)
                .set(movieUpdateFields)
                .where('id = :id', { id })
                .execute();
            if (detail) {
                await qr.manager.createQueryBuilder()
                    .update(movie_detail_entity_1.MovieDetail)
                    .set({ detail })
                    .where('id = :id', { id: movie.detail.id })
                    .execute();
            }
            if (newGenres) {
                await qr.manager.createQueryBuilder()
                    .relation(movie_entity_1.Movie, 'genres')
                    .of(id)
                    .addAndRemove(newGenres.map(genre => genre.id), movie.genres.map(genre => genre.id));
            }
            await qr.commitTransaction();
            return this.movieRepository.findOne({
                where: {
                    id,
                },
                relations: ['detail', 'director', 'genres']
            });
        }
        catch (e) {
            await qr.rollbackTransaction();
            throw e;
        }
        finally {
            await qr.release();
        }
    }
    async remove(id) {
        const movie = await this.movieRepository.findOne({
            where: {
                id,
            },
            relations: ['detail']
        });
        if (!movie) {
            throw new common_1.NotFoundException('존재하지 않는 ID의 영화입니다!');
        }
        await this.movieRepository.createQueryBuilder()
            .delete()
            .where('id = :id', { id })
            .execute();
        await this.movieDetailRepository.delete(movie.detail.id);
        return id;
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __param(1, (0, typeorm_1.InjectRepository)(movie_detail_entity_1.MovieDetail)),
    __param(2, (0, typeorm_1.InjectRepository)(director_entity_1.Director)),
    __param(3, (0, typeorm_1.InjectRepository)(genre_entity_1.Genre)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], MovieService);
function IN(genreIds) {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=movie.service.js.map