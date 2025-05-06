import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) { }

    parseBasicToken(rawToken: string) {
        // 1) 토큰을 " " 기준으로 split 한 후 토큰 값만 추출하기 
        // ['Basic', $token]
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }

        const [_, token] = basicSplit;

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
        const hash = await bcrypt.hash(password, this.configService.get<number>('HASH_ROUNDS') ?? 10)


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
}
