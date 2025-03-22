import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './service/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInResponseDto } from './dtos/sing-in.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  signIn(@Body() body: SignInDto): SignInResponseDto {
    const token = this.authService.signIn(body);
    return { token };
  }
}
