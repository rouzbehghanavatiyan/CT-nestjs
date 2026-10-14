export const BOT_REPLY_DELAY_MS = () =>
  Number(process.env.BOT_REPLY_DELAY_MS ?? 12 * 60 * 1000); // ۱۲ دقیقه

export const BOT_REPLY_POLL_MS = () =>
  Number(process.env.BOT_REPLY_POLL_MS ?? 10 * 60 * 1000); // هر ۱۰ دقیقه

export const BOT_REPLY_MAX_ATTEMPTS = 3;
