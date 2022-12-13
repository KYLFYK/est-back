import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  public async sendMessage(to: string, subject: string, text: string, html: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });

      return true;
    }
    catch {
      return false;
    }
  }

}
