import { BadRequestException, Get, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { envVariablesKeys } from 'src/common/const/env.const';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    parseBasicToken(rawToken: string) {
        // 1) 토큰을 " " 기준으로 split 한 후 토큰 값만 추출하기 
        // ['Basic', $token]
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }

        const [basic, token] = basicSplit;

        if (basic.toLowerCase() !== 'basic') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }
        // 2) 추출한 토큰을 base62 디코딩해서 이메일과 비밀번호로 나눈다. 
        const decoded = Buffer.from(token, 'base64').toString('utf-8');

        // "email:password"
        // [eamil, password]
        const tokenSplit = decoded.split(':');

        if (tokenSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다!');
        }

        const [email, password] = tokenSplit;

        return {
            email,
            password
        }
    }

    async parseBearerToken(rawToken: string, isRefreshToken: boolean) {
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }

        try {
            // verifyAsync = payload도 가져오는데 검증도 추가로함 
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(
                    isRefreshToken ? envVariablesKeys.refreshTokenSecret : envVariablesKeys.accessTokenSecret
                ),
            });

            if (isRefreshToken) {
                if (payload.type !== 'refresh') {
                    throw new BadRequestException('Refresh 토큰을 입력해주세요 !');
                }
            } else {
                if (payload.type !== 'access') {
                    throw new BadRequestException('Access 토큰을 입력해주세요 !');
                }
            }

            return payload;

        } catch (e) {
            throw new UnauthorizedException('토큰이 만료됐습니다.');
        }
    }

    // rawTokens -> "Basic $token" (base 64) 
    async register(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);

        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (user) {
            throw new BadRequestException('이미 가입한 이메일 입니다! ');
        }

        // 해싱
        // 라운드는 숫자가 높을수록 bcrypt 해싱하는데 더 오래걸림 보통 10이 국룰.
        // 숫자가 낮으면 dictionary atk 있을 수 있음.
        const hash = await bcrypt.hash(password, this.configService.get<number>(envVariablesKeys.hashRounds) ?? 10)


        await this.userRepository.save({
            email,
            password: hash
        });

        return this.userRepository.findOne({
            where: {
                email
            }
        })
    }

    async authenticate(email: string, password: string) {
        const user: User | null = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException('잘못된 로그인 정보입니다!');
        }

        // password : 해싱된 값 
        // user.password : 해싱되지 않은 값
        const passOk = await bcrypt.compare(password, user.password);

        if (!passOk) {
            throw new BadRequestException('잘못된 로그인 정보입니다!');
        }

        return user;
    }

    async issueToken(user: { id: number, role: Role }, isRefreshToken: boolean) {
        const refreshTokenSecret = this.configService.get<string>(envVariablesKeys.refreshTokenSecret);
        const accessTokenSecret = this.configService.get<string>(envVariablesKeys.accessTokenSecret);

        return await this.jwtService.signAsync({
            sub: user.id,
            role: user.role,
            type: isRefreshToken ? 'refresh' : 'access',
        }, {
            secret: isRefreshToken ? refreshTokenSecret : accessTokenSecret,
            expiresIn: isRefreshToken ? '24h' : 300,
        })
    }

    async login(rawToken: string) {
        const { email, password } = this.parseBasicToken(rawToken);
        const user = await this.authenticate(email, password);

        return {
            refreshToken: await this.issueToken(user, true),
            accessToken: await this.issueToken(user, false),
        }
    }

    @Get('private')
    async private() {

    }
}
