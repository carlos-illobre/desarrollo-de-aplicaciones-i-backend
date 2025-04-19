import { Injectable } from '@nestjs/common';
import { MailingService } from 'src/common/mailing/mailing-service';

const SIGNUP_SUBJECT = 'Bienvenido a DeRemate.com!';
const PASSWORD_RESET_SUBJECT = 'Solicitaste un cambio de clave en DeRemate.com';

@Injectable()
export class MailingRepository {
  constructor(private readonly mailingService: MailingService) {}

  async sendSignupEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await this.mailingService.sendMail(
      { address: email, displayName: fullName },
      SIGNUP_SUBJECT,
      `Hola ${fullName}! \n\nTu OTP de registro es ${otp}. \nPor favor ingresalo en la pantalla correspondiente`,
    );
  }

  async sendPasswordResetEmail(
    email: string,
    fullName: string,
    otp: string,
  ): Promise<void> {
    await this.mailingService.sendMail(
      { address: email, displayName: fullName },
      `${PASSWORD_RESET_SUBJECT} - ${otp}`,
      `Hola ${fullName}! \n\nTu OTP de reseteo de clave es: ${otp}. \nPor favor ingresalo en la pantalla correspondiente`,
    );
  }
}
