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
exports.Director = void 0;
const baseTable_entity_1 = require("../../common/entity/baseTable.entity");
const movie_entity_1 = require("../../movie/entity/movie.entity");
const typeorm_1 = require("typeorm");
let Director = class Director extends baseTable_entity_1.BaseTable {
    id;
    name;
    dob;
    nationality;
    movies;
};
exports.Director = Director;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Director.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Director.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Director.prototype, "dob", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Director.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => movie_entity_1.Movie, movie => movie.director),
    __metadata("design:type", Array)
], Director.prototype, "movies", void 0);
exports.Director = Director = __decorate([
    (0, typeorm_1.Entity)()
], Director);
//# sourceMappingURL=director.entity.js.map