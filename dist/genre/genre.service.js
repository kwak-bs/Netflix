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
exports.GenreService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const genre_entity_1 = require("./entity/genre.entity");
const typeorm_2 = require("typeorm");
let GenreService = class GenreService {
    genreRepository;
    constructor(genreRepository) {
        this.genreRepository = genreRepository;
    }
    findAll() {
        return this.genreRepository.find();
    }
    findOne(id) {
        return this.genreRepository.findOne({
            where: {
                id
            }
        });
    }
    async create(createGenreDto) {
        await this.genreRepository.save(createGenreDto);
    }
    async update(id, updateGenreDto) {
        const genre = await this.genreRepository.findOne({
            where: {
                id
            }
        });
        if (!genre) {
            throw new common_1.NotFoundException('존재하지 않는 ID의 장르입니다.');
        }
        await this.genreRepository.update({
            id,
        }, {
            ...updateGenreDto
        });
        const newGenre = await this.genreRepository.findOne({
            where: {
                id
            }
        });
        return newGenre;
    }
    async remove(id) {
        const genre = await this.genreRepository.findOne({
            where: {
                id
            }
        });
        if (!genre) {
            throw new common_1.NotFoundException('존재하지 않는 ID의 장르입니다.');
        }
        await this.genreRepository.delete(id);
        return id;
    }
};
exports.GenreService = GenreService;
exports.GenreService = GenreService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(genre_entity_1.Genre)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GenreService);
//# sourceMappingURL=genre.service.js.map