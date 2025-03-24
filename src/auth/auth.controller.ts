import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthService } from './service/auth.service';
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
  @Post('signup')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
  }

  @Public()
  @Post('signup/confirm')
  signInConfirm(@Body() body: ConfirmSignUpDto) {
    return this.authService.confirmSignUp(body);
  }

  @Public()
  @Post('signin')
  signIn(@Body() body: SignInDto): SignInResponseDto {
    return this.authService.signIn(body);
  }

  @Public()
  @Post('password-reset')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.passwordReset(body);
  }

  @Public()
  @Post('password-reset/confirm')
  confirmPassword(@Body() body: ConfirmPasswordResetDto) {
    return this.authService.confirmPassword(body);
  }
}
