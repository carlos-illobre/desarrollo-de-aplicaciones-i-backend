import { IsString, IsNotEmpty, Length } from 'class-validator';

export class ConfirmSignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
