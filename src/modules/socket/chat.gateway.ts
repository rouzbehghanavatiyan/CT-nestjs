import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from 'src/modules/chat/chat.service';
import { SendMessageService } from 'src/modules/chat/sendMessage.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly userList: Map<string, any> = new Map();
  private readonly optionalUserList: Map<string, any> = new Map(); // اصلاح نام
  private readonly userSocketMap: Map<string, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly sendMessageService: SendMessageService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // ✅ اول پردازش دیسکانکت، بعد حذف از لیست اصلی
    this.handleUserDisconnectLogic(client);
    this.userList.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register_user')
  handleRegisterUser(
    @MessageBody() userId: string | number,
    @ConnectedSocket() client: Socket,
  ) {
    const strUserId = String(userId);
    this.userSocketMap.set(strUserId, client.id);
    console.log(`User ${strUserId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() msgData: any,
    @ConnectedSocket() client: Socket, // 🟢 اضافه کردن کلاینت برای دسترسی به سوکت فرستنده
  ) {
    const saveMessages = await this.sendMessageService.execute(msgData);

    const senderStr = String(msgData?.sender);
    const receiverStr = String(msgData?.recieveId);

    const messagePayload = {
      id: saveMessages?.id,
      userProfile: msgData?.userProfile,
      recieveId: receiverStr,
      sender: senderStr,
      time: msgData?.time,
      userNameSender: msgData?.userNameSender,
      title: msgData?.title,
    };

    // 1. ارسال پیام به خود فرستنده (تا در UI تایید شود)
    client.emit('receive_message', messagePayload);

    // 2. پیدا کردن سوکت گیرنده و ارسال فقط برای او
    const receiverSocketId = this.userSocketMap.get(receiverStr);

    if (receiverSocketId) {
      // ارسال پیام چت
      this.server.to(receiverSocketId).emit('receive_message', messagePayload);

      // ارسال نوتیفیکیشن پاپ‌آپ فقط به گیرنده
      this.server.to(receiverSocketId).emit('new_message_notification', {
        senderId: senderStr,
        senderName: msgData.userNameSender,
        message: msgData.title,
        timestamp: new Date().toISOString(),
      });

      // ارسال نوتیفیکیشن سیستم فقط به گیرنده (جلوگیری از درز اطلاعات به کل کاربران)
      this.server.to(receiverSocketId).emit('notification_message', {
        type: 'message',
        title: 'پیام جدید',
        message: `پیام جدید از ${msgData.userNameSender}`,
        senderId: senderStr,
        senderName: msgData.userNameSender,
        receiverId: receiverStr,
        chatData: messagePayload,
      });
    }
  }

  @SubscribeMessage('mark_messages_as_read')
  async handleMarkAsRead(
    @MessageBody() data: { sender: string; receiver: string },
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.sender, data.receiver);

      // فقط به فرستنده‌ی پیام خبر بده که پیامش خوانده شد
      const senderSocketId = this.userSocketMap.get(String(data.sender));
      if (senderSocketId) {
        this.server.to(senderSocketId).emit('messages_read_confirmation', {
          sender: data.sender,
          receiver: data.receiver,
        });
      }
    } catch (error) {
      console.error('Error marking messages as read', error);
    }
  }

  @SubscribeMessage('user_entered_optional')
  handleUserEnteredOptional(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.userList.set(client.id, data);
    const currentUsers = Array.from(this.userList.values());

    this.server.emit('user_entered_optional_response', currentUsers);
  }

  @SubscribeMessage('user_left_optional')
  handleUserLeftOptional(@MessageBody() data: { userId: string | number }) {
    this.cleanupUserOptional(data.userId);
    this.server.emit(
      'user_entered_optional_response',
      Array.from(this.userList.values()),
    );
  }

  @SubscribeMessage('add_liked')
  handleAddLiked(@MessageBody() data: { userId: string; movieId: number }) {
    this.server.emit('add_liked_response', data);
  }

  @SubscribeMessage('remove_liked')
  handleRemoveLiked(@MessageBody() data: { userId: string; movieId: number }) {
    this.server.emit('remove_liked_response', data);
  }

  @SubscribeMessage('add_invite_offline')
  async handleAddInviteOffline(@MessageBody() inviteData: any) {
    try {
      if (!inviteData) {
        return { status: 1, message: 'Invite data is empty' };
      }

      // ✅ استفاده از ?? (Nullish Coalescing) برای جلوگیری از خطای مقدار 0
      const receiverUserId = String(
        inviteData?.receiverUserId ??
          inviteData?.receiveUserId ??
          inviteData?.reciveUserId ??
          inviteData?.userId ??
          '',
      );

      const receiverSocketId = this.userSocketMap.get(receiverUserId);

      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('receive_invite', inviteData);
        return {
          status: 0,
          message: 'Invite sent to online user',
          isOnline: true,
          data: inviteData,
        };
      }

      return {
        status: 0,
        message: 'Invite created but receiver is offline',
        isOnline: false,
        data: inviteData,
      };
    } catch (error: any) {
      console.error('❌ add_invite_offline error:', error.message);
      return {
        status: 1,
        message: 'Socket invite failed',
        error: error.message,
      };
    }
  }

  @SubscribeMessage('add_invite_optional')
  handleAddInviteOptional(@MessageBody() data: any) {
    this.optionalUserList.set(data.userIdSender, data);
    this.server.emit('add_invite_optional_response', data);

    const targetSocketId = this.userSocketMap.get(String(data.userIdReciever));
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('add_invite_optional_target', data);
    }
  }

  // --- Private Helpers ---

  private handleUserDisconnectLogic(client: Socket) {
    // 1. گشتن در مپ سوکت‌ها برای پیدا کردن و حذف تضمینی کاربر
    let disconnectedUserId: string | null = null;

    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        disconnectedUserId = userId;
        this.userSocketMap.delete(userId); // حذف تضمینی از مپ
        break;
      }
    }

    // 2. پاکسازی لیست آپشنال اگر کاربری پیدا شد
    if (disconnectedUserId) {
      this.cleanupUserOptional(disconnectedUserId);
    }

    // پخش رویداد آپدیت لیست به بقیه
    this.server.emit(
      'user_entered_optional_response',
      Array.from(this.userList.values()),
    );
  }

  private cleanupUserOptional(userId: string | number) {
    const targetUserId = String(userId);

    for (const [key, value] of this.userList.entries()) {
      if (String(value.userIdJoin) === targetUserId) {
        this.userList.delete(key);
        break;
      }
    }

    for (const [userIdSender, inviteData] of this.optionalUserList.entries()) {
      if (
        String(inviteData.userIdSender) === targetUserId ||
        String(inviteData.userIdReciever) === targetUserId
      ) {
        this.optionalUserList.delete(userIdSender);
      }
    }
  }
}
