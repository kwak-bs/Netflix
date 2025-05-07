import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly configService;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, configService: ConfigService, jwtService: JwtService);
    parseBasicToken(rawToken: string): {
        email: string;
        password: string;
    };
    register(rawToken: string): Promise<User | null>;
    login(rawToken: string): Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
}
