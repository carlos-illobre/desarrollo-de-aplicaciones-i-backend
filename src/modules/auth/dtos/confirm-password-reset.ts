import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConfirmPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
