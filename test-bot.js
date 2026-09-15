const { io } = require('socket.io-client');

const socket = io('http://localhost:4005', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('✅ Connected with ID:', socket.id);

  socket.emit('register_user', '123');

  setTimeout(() => {
    console.log('📤 Sending message to bot...');
    socket.emit('send_message', {
      sender: '2',
      recieveId: '1',
      content: 'what is love?',
      userNameSender: 'کاربر تست',
    });
    console.log('⏳ منتظر پاسخ ربات (حداقل ۱۱ ثانیه تأخیر)...');
  }, 1000);
});

socket.onAny((event, ...args) => {
  console.log(`🔔 Event [${event}]:`, JSON.stringify(args, null, 2));
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection Error:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});
