import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private readonly notifBaseUrl =
    process.env.NOTIF_SERVICE_URL || 'https://gateway.clashtalent.com';

  private signServiceToken(userId: string | number): string {
    const secret = process.env.SECRET_KEY;
    if (!secret) {
      throw new Error('SECRET_KEY در env تنظیم نشده است');
    }

    const payload = {
      userId: String(userId),
      sub: String(userId),
    };

    return jwt.sign(payload, secret, { expiresIn: '1d' });
  }

  async sendToUser(
    userId: string | number,
    message: string,
    data?: Record<string, any>,
  ): Promise<void> {
    if (!this.notifBaseUrl) {
      this.logger.warn(
        'NOTIF_SERVICE_URL در env تنظیم نشده؛ ارسال نوتیفیکیشن نادیده گرفته شد.',
      );
      return;
    }

    let token: string;
    try {
      token = this.signServiceToken(userId);
    } catch (error: any) {
      this.logger.error(`خطا در ساخت توکن سرویس: ${error?.message || error}`);
      return;
    }

    try {
      const response = await fetch(`${this.notifBaseUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          message,
          ...(data ? { data } : {}),
        }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => '');
        this.logger.error(
          `ارسال نوتیفیکیشن به کاربر ${userId} ناموفق بود: ${response.status} ${text}`,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `خطا در ارسال نوتیفیکیشن به کاربر ${userId}: ${error?.message || error}`,
      );
    }
  }
}
