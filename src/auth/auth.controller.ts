import { Controller, Post, Headers, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './strategy/local.strategy';
import { JwtAuthGuard } from './strategy/jwt.strategy';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  /// authorization: Basic $token
  registerUser(@Headers('authorization') token: string) {
    this.authService.register(token);
  }

  @Public()
  @Post('login')
  loginUser(@Headers('authorization') token: string) {
    return this.authService.login(token);
  }

  @Post('token/access')
  // async rotateAccessToken(@Headers('authorization') token: string) {
  async rotateAccessToken(@Request() req) {
    //const payload = await this.authService.parseBearerToken(token, true);

    return {
      accessToken: await this.authService.issueToken(req.user, false),
    }
  }

  // passport 공부용. 이 플젝에서는 잘 안쓰임.
  @UseGuards(LocalAuthGuard) // AuthGuard는 localStrategy class를 의미함
  @Post('login/passport')
  async loginUserPassport(@Request() req) {

    return {
      refreshToken: await this.authService.issueToken(req.user, true),
      accessToken: await this.authService.issueToken(req.user, false),
    };
  }

  // passport 공부용으로 만든거였음. 이 플젝에서는 잘 안쓰일거임 
  @UseGuards(JwtAuthGuard)
  @Get('private')
  async private(@Request() req) {
    console.log('run');
    return req.user;
  }
}
