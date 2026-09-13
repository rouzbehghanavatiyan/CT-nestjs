import { Injectable, Logger } from '@nestjs/common';

export const GAPGPT_BOT_ID = 'gapgpt-ai-bot';
export const GAPGPT_BOT_NAME = 'GapGpt'; // نام نمایشی ربات در پروفایل

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class GapGptService {
  private readonly logger = new Logger(GapGptService.name);
  private readonly apiKey = process.env.GAPGPT_API_KEY;
  private readonly apiUrl = 'https://api.gapgpt.app/v1/chat/completions';

  async generateReply(
    userMessage: string,
    history: ChatHistoryItem[] = [],
  ): Promise<string> {
    if (!this.apiKey) {
      this.logger.error('GAPGPT_API_KEY تنظیم نشده است');
      return 'الان نمی‌تونم جواب بدم، بعداً امتحان کن.';
    }

    const systemPrompt =
      'تو یک دستیار گفتگوی دوستانه به فارسی هستی. کوتاه، طبیعی و محاوره‌ای جواب بده، ' +
      'مثل یک آدم عادی که داره پیام‌رسانی می‌کنه، نه مثل یک سند رسمی یا لیست. ' +
      'از توضیح‌های تکنیکی درباره‌ی خودت (مدل، شرکت سازنده و غیره) خودداری کن مگر اینکه مستقیم ازت بپرسند.';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // فقط چند پیام آخر برای حفظ context
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages,
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`GapGPT API error ${response.status}: ${errText}`);
        return 'یه لحظه صبر کن، الان مشکل داره سیستم.';
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      return reply || 'متوجه نشدم، می‌شه دوباره بگی؟';
    } catch (error: any) {
      this.logger.error(`GapGPT request failed: ${error.message}`);
      return 'یه لحظه صبر کن، الان مشکل داره سیستم.';
    }
  }
}
