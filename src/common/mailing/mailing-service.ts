import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Email from 'email-templates';
import * as path from 'path';

const FROM = '"DeRemate.com" <agus.drewes@outlook.com>';

@Injectable()
export class MailingService {
  private readonly transporter: nodemailer.Transporter;
  private readonly email: Email;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025, // MailHog's default SMTP port
      secure: false, // No SSL for local SMTP
    });

    // Configure email-templates
    this.email = new Email({
      message: {
        from: FROM,
      },
      transport: this.transporter,
      views: {
        root: path.join(__dirname, 'templates'), // Path to your email templates folder
        options: {
          extension: 'pug', // Use Pug templates
        },
      },
    });
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    variables: Record<string, any>,
  ): Promise<void> {
    try {
      await this.email.send({
        template, // Template name (e.g., 'welcome')
        message: {
          to,
          subject,
        },
        locals: variables, // Variables to pass to the template
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
