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
      recipient,
      //TODO: temporary until we fix the template issue
      `${SIGNUP_SUBJECT} - ${otp}`,
      SIGNUP_TEMPLATE_NAME,
      { otp },
    );
  }

  async sendPasswordResetEmail(recipient: string, otp: string): Promise<void> {
    this.mailingService.sendMail(
      recipient,
      //TODO: temporary until we fix the template issue
      `${PASSWORD_RESET_SUBJECT} - ${otp}`,
      PASSWORD_RESET_TEMPLATE_NAME,
      { otp },
    );
  }
}
