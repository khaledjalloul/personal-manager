import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSigninDto, AuthSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signupAsUser(@Body() dto: AuthSignupDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthSigninDto) {
    return this.authService.signin(dto);
  }
}
