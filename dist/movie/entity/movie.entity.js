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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const typeorm_1 = require("typeorm");
const baseTable_entity_1 = require("../../common/entity/baseTable.entity");
const movie_detail_entity_1 = require("./movie-detail.entity");
const director_entity_1 = require("../../director/entity/director.entity");
const genre_entity_1 = require("../../genre/entity/genre.entity");
let Movie = class Movie extends baseTable_entity_1.BaseTable {
    id;
    title;
    genres;
    detail;
    director;
};
exports.Movie = Movie;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true
    }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => genre_entity_1.Genre, genre => genre.movies),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => movie_detail_entity_1.MovieDetail, movieDetail => movieDetail.id, {
        cascade: true,
        nullable: false,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", movie_detail_entity_1.MovieDetail)
], Movie.prototype, "detail", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => director_entity_1.Director, director => director.id, {
        cascade: true,
        nullable: false
    }),
    __metadata("design:type", director_entity_1.Director)
], Movie.prototype, "director", void 0);
exports.Movie = Movie = __decorate([
    (0, typeorm_1.Entity)()
], Movie);
//# sourceMappingURL=movie.entity.js.map