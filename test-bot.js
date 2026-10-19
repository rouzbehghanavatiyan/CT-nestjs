const { io } = require('socket.io-client');

const SOCKET_URL = process.env.SOCKET_URL ?? 'http://127.0.0.1:4005';
const SENDER_ID = process.env.SENDER_ID ?? '5094';
const RECEIVER_ID = process.env.RECEIVER_ID ?? '2';

const TOLERANCE_MS = 1000;
const GEN_TIME_MS = 60000;
const GRACE_MS = 15000;

let delayMs = null;
let pollMs = 0;
let phase = 1;
let finished = false;
let deadline = null;
let countdown = null;

const t0 = {};
const sched = [];
const replies = [];
const errors = [];
const results = [];

const check = (name, ok, extra = '') => {
  results.push(ok);
  console.log(`${ok ? '✅ PASS' : '❌ FAIL'} - ${name} ${extra}`);
};
const warn = (name, ok, extra = '') =>
  console.log(`${ok ? '✅ OK  ' : '⚠️  WARN'} - ${name} ${extra}`);

console.log(`🔌 Connecting to ${SOCKET_URL} ...`);
const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 3,
});

function send(content, tempId) {
  socket.emit('send_message', {
    sender: SENDER_ID,
    recieveId: RECEIVER_ID,
    content,
    userNameSender: 'کاربر تست',
    tempId,
  });
  console.log(`📤 [فاز ${phase}] ارسال "${content}" (${tempId})`);
}

function armDeadline() {
  clearTimeout(deadline);
  const ms = (delayMs ?? 5 * 60 * 1000) + pollMs + GEN_TIME_MS + GRACE_MS;
  deadline = setTimeout(() => {
    console.log('⏰ timeout');
    finish();
  }, ms);
}

function startCountdown(ackAt) {
  clearInterval(countdown);
  countdown = setInterval(() => {
    const left = Math.max(0, (delayMs ?? 0) - (Date.now() - ackAt));
    console.log(`⏳ حدود ${Math.round(left / 1000)} ثانیه تا پاسخ بات`);
  }, 10000);
}

function validReply(text) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  return (
    words.length >= 1 && words.length <= 4 && !/[\u0600-\u06FF]/.test(text)
  );
}

function evaluatePhase(p) {
  const s = sched.filter((x) => x.phase === p);
  const r = replies.filter((x) => x.phase === p);
  const base = t0[p];
  console.log(`\n--- فاز ${p} ---`);
ل
  check(`[F${p}] ack پیام دریافت شد`, !!base);
  check(`[F${p}] رویداد bot_reply_scheduled دریافت شد`, s.length >= 1);

  if (p === 1) {
    check(
      '[F1] اولین پیام job جدید ساخت (alreadyScheduled=false)',
      s[0]?.data.alreadyScheduled === false,
    );
    check(
      '[F1] پیام دوم job تکراری نساخت (alreadyScheduled=true)',
      s[1]?.data.alreadyScheduled === true,
    );
  } else {
    check(
      '[F2] پیام جدید بعد از پاسخ، job جدید ساخت (alreadyScheduled=false)',
      s[0]?.data.alreadyScheduled === false,
    );
  }

  check(`[F${p}] دقیقاً یک پاسخ آمد`, r.length === 1, `(تعداد=${r.length})`);

  if (r[0] && base) {
    const elapsed = r[0].at - base;
    check(
      `[F${p}] پاسخ زودتر از ${delayMs}ms نیامد`,
      elapsed >= delayMs - TOLERANCE_MS,
      `(elapsed=${elapsed}ms)`,
    );
    check(
      `[F${p}] پاسخ در بازه مجاز رسید`,
      elapsed <= delayMs + pollMs + GEN_TIME_MS,
      `(elapsed=${elapsed}ms)`,
    );
    check(
      `[F${p}] قالب پاسخ معتبر (۱ تا ۴ کلمه، غیرفارسی)`,
      validReply(r[0].content),
      `("${r[0].content}")`,
    );
  }
}

function finish() {
  if (finished) return;
  finished = true;
  clearTimeout(deadline);
  clearInterval(countdown);

  console.log('\n===== نتیجه تست =====');
  check('اتصال به سرور برقرار شد', socket.connected || !!t0[1]);
  check(
    'خطای send_message_error نداشتیم',
    errors.length === 0,
    errors.length ? JSON.stringify(errors) : '',
  );

  evaluatePhase(1);
  if (phase >= 2) {
    evaluatePhase(2);
    const r1 = replies.find((x) => x.phase === 1)?.content;
    const r2 = replies.find((x) => x.phase === 2)?.content;
    if (r1 && r2)
      warn(
        'پاسخ فاز ۲ با فاز ۱ فرق دارد',
        r1.toLowerCase() !== r2.toLowerCase(),
        `("${r1}" / "${r2}")`,
      );
  } else {
    check('فاز ۲ اجرا شد', false, '(فاز ۱ کامل نشد)');
  }

  const ok = results.every(Boolean);
  console.log(ok ? '\n🎉 تست موفق' : '\n💥 تست ناموفق');
  socket.close();
  process.exit(ok ? 0 : 1);
}

function endPhase() {
  if (phase === 1) {
    phase = 2;
    console.log('\n➡️  شروع فاز ۲: پیام جدید بعد از پاسخ');
    send('tell me something', 'm3');
  } else {
    finish();
  }
}

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);
  socket.emit('register_user', SENDER_ID);
  setTimeout(() => send('what is love?', 'm1'), 500);
});

socket.on('connect_error', (err) => {
  console.error('❌ Connection Error:', err.message);
});

socket.on('message_sent_ack', (data) => {
  const id = data?.tempId;
  if (id === 'm1' && !t0[1]) {
    t0[1] = Date.now();
    console.log('✅ ack پیام اول');
    setTimeout(() => send('and what is hate?', 'm2'), 1000);
  } else if (id === 'm3' && !t0[2]) {
    t0[2] = Date.now();
    console.log('✅ ack پیام فاز ۲');
    startCountdown(t0[2]);
  }
});

socket.on('bot_reply_scheduled', (data) => {
  console.log(`🕒 [فاز ${phase}] bot_reply_scheduled:`, data);
  sched.push({ phase, data, at: Date.now() });
  if (delayMs === null) {
    delayMs = data.delayMs;
    pollMs = data.pollMs ?? 0;
    console.log(
      `⏱️ تاخیر سرور: ${delayMs / 1000}s | بازه‌ی چک: ${pollMs / 1000}s`,
    );
    startCountdown(t0[1] ?? Date.now());
  }
  armDeadline();
});

socket.on('bot_typing', () => {
  const base = t0[phase];
  const early =
    base && delayMs && Date.now() - base < delayMs - TOLERANCE_MS - 15000;
  warn('bot_typing قبل از موعد نیامده', !early);
});

socket.on('receive_message', (data) => {
  if (String(data.senderId) !== String(RECEIVER_ID)) return;
  const at = Date.now();
  const elapsed = at - (t0[phase] ?? at);
  console.log(
    `📩 [فاز ${phase}] پاسخ بات بعد از ${elapsed}ms: "${data.content}"`,
  );
  replies.push({ phase, at, content: String(data.content ?? '') });

  if (replies.filter((x) => x.phase === phase).length === 1) {
    console.log(`🔎 ${GRACE_MS / 1000}s منتظر پاسخ اضافه می‌مانیم ...`);
    setTimeout(endPhase, GRACE_MS);
  }
});

socket.on('send_message_error', (e) => {
  console.error('❌ send_message_error:', e);
  errors.push(e);
  finish();
});

setTimeout(() => {
  if (!socket.connected) {
    console.error('❌ بعد از ۱۰ ثانیه وصل نشدیم؛ SOCKET_URL را چک کنید.');
    process.exit(1);
  }
}, 10000);

armDeadline();
