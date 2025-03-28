import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from '../dtos/sign-up.dto';
import { UsersRepository } from '../repositories/users.repository';
import { SignInDto } from '../dtos/sign-in.dto';
import { ConfirmSignUpDto } from '../dtos/confirm-sign-up.dto';
import { OtpRepository } from '../repositories/otp.repository';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from '../dtos/sing-in.response.dto';
import { ResetPasswordDto } from '../dtos/password-reset';
import { ConfirmPasswordResetDto } from '../dtos/confirm-password-reset';
import { MailingRepository } from '../repositories/mailing.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly otpRepo: OtpRepository,
    private readonly jwtService: JwtService,
    private readonly mailingRepo: MailingRepository,
  ) {}

  public async signUp(body: SignUpDto) {
    if (this.usersRepo.findByEmail(body.email)) {
      console.log('User already exists');
      throw new ConflictException('A user with this email already exists');
    }
    if (body.password !== body.passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const otp = this.otpRepo.createUserDataOtp(
      body.email,
      body.password,
      'SIGNUP',
    );

    console.log('OTP created successfully: ' + otp);

    await this.mailingRepo.sendSignupEmail(body.email, otp);
  }

  public confirmSignUp(body: ConfirmSignUpDto) {
    const { email, password } = this.otpRepo.getUserDataByOtp(
      body.otp,
      'SIGNUP',
    );

    const user = this.usersRepo.create(email, password);

    this.otpRepo.deleteOtp(body.otp, 'SIGNUP');
    console.log('User created successfully: ' + JSON.stringify(user));
  }

  public signIn(body: SignInDto): SignInResponseDto {
    const user = this.usersRepo.findByEmail(body.email);
    if (!user) {
      console.log('User not found');
      throw new UnauthorizedException();
    } else if (user.email !== body.email || user.password !== body.password) {
      console.log('Invalid credentials');
      throw new UnauthorizedException();
    }

    return {
      accessToken: this.jwtService.sign({ sub: user.email }),
    };
  }

  public async passwordReset(body: ResetPasswordDto) {
    if (body.password !== body.passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const otp = this.otpRepo.createUserDataOtp(
      body.email,
      body.password,
      'PASSWORD_RESET',
    );
    console.log('OTP created successfully: ' + otp);

    await this.mailingRepo.sendPasswordResetEmail(body.email, otp);
  }

  public confirmPassword(body: ConfirmPasswordResetDto) {
    const { email, password } = this.otpRepo.getUserDataByOtp(
      body.otp,
      'PASSWORD_RESET',
    );
    this.usersRepo.updatePassword(email, password);
    this.otpRepo.deleteOtp(body.otp, 'PASSWORD_RESET');
    console.log('Password updated successfully');
  }
}
