const { io } = require('socket.io-client');

// آدرس سرور و پورت خود را در صورت نیاز تغییر دهید
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
});

const SENDER_ID = '2'; 
const RECEIVER_ID = '1'; 

socket.on('connect', () => {
  console.log('✅ Connected to Gateway. Socket ID:', socket.id);

  console.log(`👤 Registering user ${SENDER_ID}...`);
  socket.emit('register_user', SENDER_ID);

  setTimeout(() => {
    console.log('📤 Sending message...');
    
    const messagePayload = {
      sender: SENDER_ID,
      recieveId: RECEIVER_ID, // توجه: دقیقاً با املا recieveId (همانطور که در بک‌اند نوشتید)
      content: 'what is love?', // رشته ساده ارسال می‌شود
      userNameSender: 'کاربر تست',
      tempId: Date.now().toString(), // برای ردگیری فرانت‌اند
    };

    socket.emit('send_message', messagePayload);
    console.log('⏳ Message emitted. Waiting for acks or errors...');
  }, 1000);
});

// --- لیسنرهای حیاتی برای خطایابی ---

// دریافت موفقیت آمیز بودن ارسال پیام خودمان
socket.on('message_sent_ack', (data) => {
  console.log('✅ [message_sent_ack] Server saved and acknowledged my message:');
  console.log(JSON.stringify(data, null, 2));
});

// دریافت خطا از بک‌اند (اگر اعتبارسنجی رد شود یا ارور دیتابیس رخ دهد)
socket.on('send_message_error', (error) => {
  console.error('❌ [send_message_error] Error from backend:', error);
});

// زمانی که گیرنده (یا ربات) در حال تایپ است
socket.on('bot_typing', (data) => {
  console.log('⌨️  [bot_typing] Bot is typing...', data);
});

// دریافت پیام جدید (از طرف ربات یا کاربری دیگر)
socket.on('receive_message', (data) => {
  console.log('📩 [receive_message] New message received:');
  console.log(JSON.stringify(data, null, 2));
});

// مانیتور کردن تمام رویدادهای ناشناخته
socket.onAny((event, ...args) => {
  // فیلتر کردن رویدادهای بالا برای جلوگیری از لاگ تکراری
  const knownEvents = ['message_sent_ack', 'send_message_error', 'bot_typing', 'receive_message'];
  if (!knownEvents.includes(event)) {
    console.log(`🔔 Other Event [${event}]:`, JSON.stringify(args, null, 2));
  }
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection Error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});
