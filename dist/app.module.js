"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const movie_module_1 = require("./movie/movie.module");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const Joi = require("joi");
const movie_entity_1 = require("./movie/entity/movie.entity");
const movie_detail_entity_1 = require("./movie/entity/movie-detail.entity");
const director_module_1 = require("./director/director.module");
const director_entity_1 = require("./director/entity/director.entity");
const genre_module_1 = require("./genre/genre.module");
const genre_entity_1 = require("./genre/entity/genre.entity");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const user_entity_1 = require("./user/entity/user.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    ENV: Joi.string().valid('dev', 'prod').required(),
                    DB_TYPE: Joi.string().valid('postgres').required(),
                    DB_HOST: Joi.string().required(),
                    DB_PORT: Joi.string().required(),
                    DB_USERNAME: Joi.string().required(),
                    DB_PASSWORD: Joi.string().required(),
                    DB_DATABASE: Joi.string().required(),
                    HASH_ROUNDS: Joi.number().required(),
                    ACCESS_TOKEN_SECRET: Joi.string().required(),
                    REFRESH_TOKEN_SECRET: Joi.string().required(),
                })
            }),
            movie_module_1.MovieModule,
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: (configService) => ({
                    type: configService.get('DB_TYPE'),
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    entities: [
                        movie_entity_1.Movie,
                        movie_detail_entity_1.MovieDetail,
                        director_entity_1.Director,
                        genre_entity_1.Genre,
                        user_entity_1.User
                    ],
                    synchronize: true,
                }),
                inject: [config_1.ConfigService]
            }),
            director_module_1.DirectorModule,
            genre_module_1.GenreModule,
            auth_module_1.AuthModule,
            user_module_1.UserModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map