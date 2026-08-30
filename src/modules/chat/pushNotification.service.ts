import { Injectable, Logger } from '@nestjs/common';

/**
 * این سرویس با سرویس/میکروسرویس نوتیفیکیشن (همان endpointـی که در فرانت
 * با EXPO_PUBLIC_NOTIF صدا زده می‌شود، مثل /subscribe و /send) از سمت
 * سرور (server-to-server) صحبت می‌کند. علتش این است که فقط خودِ بک‌اند
 * می‌داند در لحظه‌ی ارسال پیام، سوکت کاربر گیرنده وصل هست یا نه (یعنی
 * کاربر واقعا «توی اپ» هست یا نه)؛ فرستنده هیچ‌وقت این اطلاعات را ندارد.
 *
 * نکته: مقدار NOTIF_SERVICE_URL باید در .env بک‌اند ست شود و به همان
 * سرویس نوتیفیکیشنی اشاره کند که موبایل با EXPO_PUBLIC_NOTIF به آن وصل
 * می‌شود (چون توکن‌های Push آنجا با subscribe ذخیره شده‌اند).
 */
@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);
  private readonly notifBaseUrl = process.env.NOTIF_SERVICE_URL;

  async sendToUser(userId: string | number, message: string): Promise<void> {
    if (!this.notifBaseUrl) {
      this.logger.warn(
        'NOTIF_SERVICE_URL در env تنظیم نشده؛ ارسال نوتیفیکیشن نادیده گرفته شد.',
      );
      return;
    }

    try {
      const response = await fetch(`${this.notifBaseUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, message }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        this.logger.error(
          `ارسال نوتیفیکیشن به کاربر ${userId} ناموفق بود: ${response.status} ${text}`,
        );
      }
    } catch (error: any) {
      // شکست در ارسال نوتیفیکیشن نباید مانع ذخیره/ارسال خودِ پیام چت شود؛
      // فقط لاگ می‌کنیم و کار عادی چت ادامه پیدا می‌کند.
      this.logger.error(
        `خطا در ارسال نوتیفیکیشن به کاربر ${userId}: ${error?.message || error}`,
      );
    }
  }
}