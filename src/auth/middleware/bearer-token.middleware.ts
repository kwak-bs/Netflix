import { BadRequestException, Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { envVariablesKeys } from "src/common/const/env.const";

@Injectable()
export class BearerTokenMiddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {

    }
    // 토큰을 반환받아서 사용자(user)에 넣어주는 역할을 하는 미들웨어임
    async use(req: Request, res: Response, next: NextFunction) {
        // Basic $token
        // Bearer $token
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            next();
            return;
        }

        try {
            const token = this.validateBearerToken(authHeader);

            // 디코드는 검증을 하지 않고서 내용을 볼 수 있는 방법임
            const decodedPayload = this.jwtService.decode(token);

            if (decodedPayload.type !== 'refresh' && decodedPayload.type !== 'access') {
                throw new UnauthorizedException('잘못된 토큰입니다!');
            }
            const secretKey = decodedPayload.type === 'refresh' ?
                envVariablesKeys.refreshTokenSecret :
                envVariablesKeys.accessTokenSecret;

            // verifyAsync = payload도 가져오는데 검증도 추가로함 
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>(secretKey),
            });

            req.user = payload;
            next();
        } catch (e) {
            // 에러를 내지 않고 바로 다음으로 보내버림
            next();
        }

    }

    validateBearerToken(rawToken: string) {
        const basicSplit = rawToken.split(' ');

        if (basicSplit.length !== 2) {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }

        const [bearer, token] = basicSplit;

        if (bearer.toLowerCase() !== 'bearer') {
            throw new BadRequestException('토큰 포맷이 잘못됐습니다.');
        }

        return token;
    }

}