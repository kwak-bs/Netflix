import { Controller, Post, Headers, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './strategy/local.strategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  /// authorization: Basic $token
  registerUser(@Headers('authorization') token: string) {
    this.authService.register(token);
  }

  @Post('login')
  loginUser(@Headers('authorization') token: string) {
    return this.authService.login(token);
  }

  @UseGuards(LocalAuthGuard) // AuthGuard는 localStrategy class를 의미함
  @Post('login/passport')
  loginUserPassport(@Request() req) {
    return req.user;
  }
}
