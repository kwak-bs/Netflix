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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entity/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    userRepository;
    configService;
    constructor(userRepository, configService) {
        this.userRepository = userRepository;
        this.configService = configService;
    }
    parseBasicToken(rawToken) {
        const basicSplit = rawToken.split(' ');
        if (basicSplit.length !== 2) {
            throw new common_1.BadRequestException('토큰 포맷이 잘못됐습니다.');
        }
        const [_, token] = basicSplit;
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const tokenSplit = decoded.split(':');
        if (tokenSplit.length !== 2) {
            throw new common_1.BadRequestException('토큰 포맷이 잘못됐습니다!');
        }
        const [email, password] = tokenSplit;
        return {
            email,
            password
        };
    }
    async register(rawToken) {
        const { email, password } = this.parseBasicToken(rawToken);
        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });
        if (user) {
            throw new common_1.BadRequestException('이미 가입한 이메일 입니다! ');
        }
        const hash = await bcrypt.hash(password, this.configService.get('HASH_ROUNDS') ?? 10);
        await this.userRepository.save({
            email,
            password: hash
        });
        return this.userRepository.findOne({
            where: {
                email
            }
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map