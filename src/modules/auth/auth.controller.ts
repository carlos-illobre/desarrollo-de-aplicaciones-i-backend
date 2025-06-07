import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignInResponseDto } from './dtos/sing-in.response.dto';
import { Public } from 'src/common/decorators';
import { ConfirmSignUpDto } from './dtos/confirm-sign-up.dto';
import { ConfirmPasswordResetDto } from './dtos/confirm-password-reset';
import { ResetPasswordDto } from './dtos/password-reset';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(204)
  @Post('signup')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Public()
  @Post('signup/confirm')
  signInConfirm(@Body() body: ConfirmSignUpDto) {
    return this.authService.confirmSignUp(body);
  }

  @Public()
  @HttpCode(200)
  @Post('signin')
  signIn(@Body() body: SignInDto): SignInResponseDto {
    return this.authService.signIn(body);
  }

  @Public()
  @HttpCode(204)
  @Post('password-reset')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return await this.authService.passwordReset(body);
  }

  @Public()
  @HttpCode(204)
  @Post('password-reset/confirm')
  confirmPassword(@Body() body: ConfirmPasswordResetDto) {
    return this.authService.confirmPassword(body);
  }
}
