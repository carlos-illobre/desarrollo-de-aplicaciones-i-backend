import { Injectable } from '@nestjs/common';
import { MailingService } from 'src/common/mailing/mailing-service';

//TODO: Make subjects part of the template using the subject.pug file
const SIGNUP_SUBJECT = 'Bienvenido a DeRemate.com!';
const SIGNUP_TEMPLATE_NAME = 'signup-otp';
const PASSWORD_RESET_SUBJECT = 'Solicitaste un cambio de clave en DeRemate.com';
const PASSWORD_RESET_TEMPLATE_NAME = 'password-reset-otp';

@Injectable()
export class MailingRepository {
  constructor(private readonly mailingService: MailingService) {}

  async sendSignupEmail(recipient: string, otp: string): Promise<void> {
    this.mailingService.sendMail(
      [recipient],
      SIGNUP_SUBJECT,
      `Tu OTP de registro es ${otp}. \n Por favor ingresalo en la pantalla correspondiente`,
    );
  }

  async sendPasswordResetEmail(recipient: string, otp: string): Promise<void> {
    this.mailingService.sendMail(
      [recipient],
      `${PASSWORD_RESET_SUBJECT} - ${otp}`,
      `Tu OTP de reseteo de clave es: ${otp}. \n Por favor ingresalo en la pantalla correspondiente`,
    );
  }
}
