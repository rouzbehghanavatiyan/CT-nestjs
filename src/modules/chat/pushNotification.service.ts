import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { GoogleAuth } from 'google-auth-library';
import * as path from 'path';

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name);
  private auth: GoogleAuth;

  onModuleInit() {
    const keyFilePath = path.join(
      process.cwd(),
      'src',
      'firebase-adminsdk.json',
    );

    this.auth = new GoogleAuth({
      keyFile: keyFilePath,
      scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
    });
  }

  /**
   * دریافت Access Token معتبر از گوگل (با مدیریت داخلی انقضا و کش توسط GoogleAuth)
   */
  private async getAccessToken(): Promise<string | null> {
    try {
      const client = await this.auth.getClient();
      const accessToken = await client.getAccessToken();
      return accessToken.token || null;
    } catch (error: any) {
      this.logger.error(
        `خطا در دریافت Access Token از گوگل: ${error?.message || error}`,
      );
      return null;
    }
  }

  /**
   * ارسال نوتیفیکیشن به کاربر از طریق Gateway / Cloudflare Worker
   */
  async sendToUser(
    userId: string | number,
    message: string,
    fcmToken?: string, // در صورت نیاز به ارسال مستقیم FCM Token
  ): Promise<void> {
    try {
      // ۱. دریافت توکن معتبر گوگل
      const googleToken = await this.getAccessToken();

      if (!googleToken) {
        this.logger.error(
          `عدم امکان ارسال نوتیفیکیشن به کاربر ${userId}: توکن گوگل دریافت نشد.`,
        );
        return;
      }

      // ۲. ارسال درخواست به Gateway
      const response = await fetch('https://gateway.clashtalent.com/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${googleToken}`, // ارسال توکن گوگل در هدر
        },
        body: JSON.stringify({
          userId: String(userId),
          message,
          ...(fcmToken && { fcmToken }),
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        this.logger.error(
          `ارسال نوتیفیکیشن به کاربر ${userId} ناموفق بود (${response.status}): ${text}`,
        );
      } else {
        this.logger.log(`نوتیفیکیشن با موفقیت به کاربر ${userId} ارسال شد.`);
      }
    } catch (error: any) {
      this.logger.error(
        `خطا در ارتباط با سرویس نوتیفیکیشن برای کاربر ${userId}: ${error?.message || error}`,
      );
    }
  }
}
