import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  EmailClient,
  EmailMessage,
  KnownEmailSendStatus,
} from '@azure/communication-email';
import previewEmail from 'preview-email';

@Injectable()
export class MailingService {
  private readonly emailClient: EmailClient;

  constructor() {
    if (this.isMailingEnabled()) {
      const connectionString =
        process.env.COMMUNICATION_SERVICES_CONNECTION_STRING ?? '';
      const emailClient = new EmailClient(connectionString);

      this.emailClient = emailClient;
    }
  }

  private isMailingEnabled(): boolean {
    return (
      process.env.MAILING_ENABLED === 'true' &&
      !!process.env.FROM_EMAIL_ADDRESS &&
      !!process.env.COMMUNICATION_SERVICES_CONNECTION_STRING
    );
  }

  async sendMail(
    to: { address: string; displayName: string },
    subject: string,
    body: string,
  ): Promise<void> {
    const POLLER_WAIT_TIME = 10;

    const senderAddress = process.env.FROM_EMAIL_ADDRESS ?? '';

    if (this.emailClient) {
      try {
        const message: EmailMessage = {
          senderAddress,
          content: {
            subject,
            plainText: body,
          },
          recipients: {
            to: [to],
          },
        };

        console.log('Sending email: ', JSON.stringify(message));
        const poller = await this.emailClient.beginSend(message);

        if (!poller.getOperationState().isStarted) {
          throw 'Poller was not started.';
        }

        let timeElapsed = 0;
        while (!poller.isDone()) {
          poller.poll();
          console.log('Email send polling in progress');

          await new Promise((resolve) =>
            setTimeout(resolve, POLLER_WAIT_TIME * 1000),
          );
          timeElapsed += 10;

          if (timeElapsed > 18 * POLLER_WAIT_TIME) {
            throw 'Polling timed out.';
          }
        }

        if (poller.getResult()?.status == KnownEmailSendStatus.Succeeded) {
          console.log(
            `Successfully sent the email (operation id: ${poller.getResult()?.id})`,
          );
        } else {
          throw poller.getResult()?.error;
        }
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException(
          'Error sending email, please try again later.',
        );
      }
    } else {
      console.log(
        'Mailing service is not enabled. A preview email will be rendered.',
      );

      const message = {
        from: 'test@gmail.com',
        to: to.address,
        subject: subject,
        text: body,
      };

      previewEmail(message, { open: true })
        .then(console.log)
        .catch(console.error);
    }
  }
}
