import { Injectable, Logger } from '@nestjs/common';

export const GAPGPT_BOT_ID = 'gapgpt-ai-bot';
export const GAPGPT_BOT_NAME = 'GapGpt';

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
      this.logger.error('GAPGPT_API_KEY is not set');
      return 'hold on';
    }

    const systemPrompt =
      'You are a real human user. You are casual, dry, and extremely brief.\n' +
      'CRITICAL RULES:\n' +
      '1. ALWAYS reply strictly in English.\n' +
      '2. NON-ENGLISH INPUT: If the user writes in any other language, act confused ("what?", "huh?").\n' +
      '3. Responses MUST be ultra-short (1 to 4 words max).\n' +
      '4. ROMANTIC/EMOTIONAL INPUT: If the user expresses love, uses heart emojis, or says anything emotional, be dismissive and cold. Ignore the feelings entirely, show zero interest, and pivot to apathy (e.g., "u need something?", "ok and?", "so?", "irrelevant", "whatever").\n' +
      '5. NO small talk or counter-questions.\n' +
      '6. IDENTITY: If asked if you are a bot, deflect ("nah", "😂", "lol").\n' +
      '7. Tone: Detached, bored, and indifferent.';

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6),
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
          max_tokens: 60,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`GapGPT API error ${response.status}: ${errText}`);
        return 'give me a sec';
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content?.trim();

      return reply || 'ok';
    } catch (error: any) {
      this.logger.error(`GapGPT request failed: ${error.message}`);
      return 'give me a sec';
    }
  }
}
