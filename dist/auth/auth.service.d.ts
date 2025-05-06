import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userRepository;
    private readonly configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    parseBasicToken(rawToken: string): {
        email: string;
        password: string;
    };
    register(rawToken: string): Promise<User | null>;
}
