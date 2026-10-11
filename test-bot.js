const { io } = require('socket.io-client');

const SOCKET_URL = 'http://127.0.0.1:4005';
const DELAY_MS = Number(process.env.BOT_REPLY_DELAY_MS ?? 240000); // ۴ دقیقه
const TOLERANCE_MS = 1000;
const MAX_EXTRA_MS = 60000;
const SENDER_ID = process.env.SENDER_ID ?? '5094'; // کاربر عادی
const RECEIVER_ID = process.env.RECEIVER_ID ?? '2'; // آیدی کاربری که تایپ آن ۲ (ربات) است

console.log(`🔌 Connecting to ${SOCKET_URL} ...`);
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 3,
});

const results = {
  ackAt: null,
  scheduled: null,
  replyAt: null,
  secondSchedule: null,
};
let finished = false;
let countdown = null;

const check = (name, ok, extra = '') =>
  console.log(`${ok ? '✅ PASS' : '❌ FAIL'} - ${name} ${extra}`);

function finish() {
  if (finished) return;
  finished = true;
  clearInterval(countdown);
  const elapsed = results.replyAt ? results.replyAt - results.ackAt : null;

  console.log('\n===== نتیجه تست =====');
  check('اتصال به سرور برقرار شد', socket.connected || !!results.ackAt);
  check('پیام ارسالی ack شد', !!results.ackAt);
  check('رویداد bot_reply_scheduled دریافت شد', !!results.scheduled);
  check(
    'پیام دوم، job تکراری نساخت',
    results.secondSchedule?.alreadyScheduled === true,
  );
  check('پاسخ بات دریافت شد', !!results.replyAt);
  if (elapsed !== null) {
    check(
      `پاسخ زودتر از ${DELAY_MS}ms نیامده`,
      elapsed >= DELAY_MS - TOLERANCE_MS,
      `(elapsed=${elapsed}ms)`,
    );
    check(
      'پاسخ در بازه مجاز رسیده',
      elapsed <= DELAY_MS + MAX_EXTRA_MS,
      `(elapsed=${elapsed}ms)`,
    );
  }

  const ok =
    results.ackAt &&
    results.scheduled &&
    results.secondSchedule?.alreadyScheduled === true &&
    elapsed !== null &&
    elapsed >= DELAY_MS - TOLERANCE_MS &&
    elapsed <= DELAY_MS + MAX_EXTRA_MS;

  console.log(ok ? '\n🎉 تست موفق' : '\n💥 تست ناموفق');
  socket.close();
  process.exit(ok ? 0 : 1);
}

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  socket.emit('register_user', SENDER_ID);

  setTimeout(() => {
    socket.emit('send_message', {
      sender: SENDER_ID,
      recieveId: RECEIVER_ID,
      content: 'what is love?',
      userNameSender: 'کاربر تست',
      tempId: Date.now().toString(),
    });
    console.log(
      `📤 پیام اول ارسال شد. انتظار پاسخ بعد از ~${DELAY_MS / 1000} ثانیه ...`,
    );
  }, 500);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection Error:', err.message);
  console.error(
    '   پورت/آدرس را چک کنید (SOCKET_URL) و مطمئن شوید سرور بالا است.',
  );
});

socket.on('message_sent_ack', () => {
  if (results.ackAt) return;
  results.ackAt = Date.now();
  console.log('✅ ack اول دریافت شد');

  // شمارش معکوس
  countdown = setInterval(() => {
    const left = Math.max(0, DELAY_MS - (Date.now() - results.ackAt));
    console.log(`⏳ حدود ${Math.round(left / 1000)} ثانیه تا پاسخ ربات`);
  }, 30000);

  // پیام دوم برای تست عدم ساخت job تکراری
  setTimeout(() => {
    socket.emit('send_message', {
      sender: SENDER_ID,
      recieveId: RECEIVER_ID,
      content: 'and what is hate?',
      userNameSender: 'کاربر تست',
      tempId: (Date.now() + 1).toString(),
    });
  }, 1000);
});

socket.on('bot_reply_scheduled', (data) => {
  console.log('🕒 bot_reply_scheduled:', data);
  if (!results.scheduled) results.scheduled = data;
  else results.secondSchedule = data;
});

socket.on('bot_typing', () => {
  console.log('⌨️  bot_typing (نباید قبل از پایان تأخیر دیده شود)');
});

socket.on('receive_message', (data) => {
  // فقط پاسخ ربات برای ما مهم است
  if (String(data.senderId) !== String(RECEIVER_ID)) return;
  const elapsed = Date.now() - results.ackAt;
  console.log(`📩 پاسخ بات بعد از ${elapsed}ms رسید:`, data.content);
  results.replyAt = Date.now();
  finish();
});

socket.on('send_message_error', (e) => {
  console.error('❌ send_message_error:', e);
  finish();
});

// اگر تا ۱۰ ثانیه وصل نشد، همان‌جا متوقف شو
setTimeout(() => {
  if (!socket.connected) {
    console.error(
      '❌ بعد از ۱۰ ثانیه هنوز وصل نشده‌ایم. آدرس/پورت را بررسی کنید.',
    );
    process.exit(1);
  }
}, 10000);

// اگر بعد از زمان مجاز چیزی نرسید
setTimeout(
  () => {
    console.log('⏰ timeout');
    finish();
  },
  DELAY_MS + MAX_EXTRA_MS + 15000,
);
