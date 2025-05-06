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
exports.DirectorService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const director_entity_1 = require("./entity/director.entity");
const typeorm_2 = require("typeorm");
let DirectorService = class DirectorService {
    directorRepository;
    constructor(directorRepository) {
        this.directorRepository = directorRepository;
    }
    create(createDirectorDto) {
        return this.directorRepository.save(createDirectorDto);
    }
    findAll() {
        return this.directorRepository.find();
    }
    findOne(id) {
        return this.directorRepository.findOne({
            where: {
                id
            }
        });
    }
    async update(id, updateDirectorDto) {
        const director = await this.directorRepository.findOne({
            where: {
                id
            }
        });
        if (!director) {
            throw new common_1.NotFoundException('존재하지 않는 ID의 감독입니다.');
        }
        await this.directorRepository.update({
            id,
        }, {
            ...updateDirectorDto
        });
        const newDirector = await this.directorRepository.findOne({
            where: {
                id,
            },
        });
        return newDirector;
    }
    async remove(id) {
        const director = await this.directorRepository.findOne({
            where: {
                id
            }
        });
        if (!director) {
            throw new common_1.NotFoundException('존재하지 않는 ID의 감독입니다.');
        }
        await this.directorRepository.delete(id);
        return id;
    }
};
exports.DirectorService = DirectorService;
exports.DirectorService = DirectorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(director_entity_1.Director)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DirectorService);
//# sourceMappingURL=director.service.js.map