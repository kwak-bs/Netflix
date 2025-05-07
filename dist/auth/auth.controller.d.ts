import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(token: string): void;
    loginUser(token: string): Promise<{
        refreshToken: string;
        accessToken: string;
    }>;
}
