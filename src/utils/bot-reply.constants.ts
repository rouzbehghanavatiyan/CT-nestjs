export const BOT_REPLY_DELAY_MS = () =>
  Number(process.env.BOT_REPLY_DELAY_MS ?? 6 * 60 * 60 * 1000);

export const BOT_REPLY_POLL_MS = () =>
  Number(process.env.BOT_REPLY_POLL_MS ?? 2 * 60 * 60 * 1000);

export const BOT_REPLY_MAX_ATTEMPTS = 3;
