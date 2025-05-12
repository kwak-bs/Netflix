import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthGuard, PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";

/**
 * https://www.passportjs.org/packages/passport-local/
 */

export class LocalAuthGuard extends AuthGuard('codefactory') { };

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'codefactory') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            usernameField: 'email'  // username대신 key값을 email로 바꿈
        });
    }

    /**
     * LocalStrategy
     * 
     * validate : username, password 
     * 
     * return -> Request();
     */
    async validate(email: string, password: string) {
        const user = await this.authService.authenticate(email, password);
        return user;
    }
}