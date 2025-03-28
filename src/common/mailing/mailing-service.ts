import { Injectable } from '@nestjs/common';
import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';

require('dotenv').config();

const FROM_SENDER_ADDRESS = `<${process.env.FROM_EMAIL_ADDRESS ?? ''}>`;

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
    return process.env.MAILING_ENABLED === 'true';
  }

  async sendMail(to: string[], subject: string, body: string): Promise<void> {
    const POLLER_WAIT_TIME = 10;

    if (this.emailClient) {
      try {
        const message = {
          senderAddress: FROM_SENDER_ADDRESS,
          content: {
            subject,
            plainText: body,
          },
          recipients: {
            to: to.map((recipient) => ({
              address: recipient,
              displayName: '',
            })),
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
      }
    } else {
      console.log('Mailing service is not enabled. Skipping email sending.');
      console.log(`Email details: \n to: ${to}, subject: ${subject}`);
    }
  }
}
