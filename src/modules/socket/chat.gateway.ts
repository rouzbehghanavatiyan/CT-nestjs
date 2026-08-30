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
import { PushNotificationService } from '../chat/pushNotification.service';

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
  private readonly optionalUserList: Map<string, any> = new Map();
  private readonly userSocketMap: Map<string, string> = new Map();
  private readonly activeChatMap: Map<string, string> = new Map(); // userId -> activePeerId

  constructor(
    private readonly chatService: ChatService,
    private readonly sendMessageService: SendMessageService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // اول پردازش دیسکانکت، بعد حذف از لیست اصلی
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
    @ConnectedSocket() client: Socket,
  ) {
    // اعتبارسنجی حداقلی ورودی
    if (
      !msgData?.sender ||
      !msgData?.recieveId ||
      !String(msgData?.content ?? '').trim()
    ) {
      client.emit('send_message_error', {
        message: 'sender, recieveId و content الزامی هستند',
      });
      return;
    }

    let saveMessages;
    try {
      saveMessages = await this.sendMessageService.execute(msgData);
    } catch (error: any) {
      client.emit('send_message_error', {
        message: error?.message || 'خطا در ذخیره پیام',
      });
      return;
    }

    const senderStr = String(msgData.sender);
    const receiverStr = String(msgData.recieveId);

    // ChatEntity.content یک آبجکت {type, text} است؛ برای کلاینت‌ها
    // (که فعلا فقط پیام متنی رندر می‌کنند) متن ساده را بیرون می‌کشیم
    const contentText = saveMessages.content?.text ?? '';

    const messagePayload = {
      id: saveMessages.id,
      tempId: msgData?.tempId,
      userProfile: msgData?.userProfile,
      senderId: senderStr,
      receiveId: receiverStr,
      content: contentText,
      createdAt: saveMessages.createdAt.toISOString(),
      userNameSender: msgData?.userNameSender,
      isRead: false,
    };

    const receiverSocketId = this.userSocketMap.get(receiverStr);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', messagePayload);

      this.server.to(receiverSocketId).emit('new_message_notification', {
        senderId: senderStr,
        senderName: msgData.userNameSender,
        message: contentText,
        timestamp: saveMessages.createdAt.toISOString(),
      });

      this.server.to(receiverSocketId).emit('notification_message', {
        type: 'message',
        title: 'پیام جدید',
        message: `پیام جدید از ${msgData.userNameSender}`,
        senderId: senderStr,
        senderName: msgData.userNameSender,
        receiverId: receiverStr,
        chatData: messagePayload,
      });
    } else {
      const senderName = msgData?.userNameSender || 'کاربر';
      const notifBody = `${senderName}: ${contentText}`;
      void this.pushNotificationService.sendToUser(receiverStr, notifBody);
    }

    client.emit('message_sent_ack', messagePayload);
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
        this.server.to(senderSocketId).emit('messages_read', {
          sender: data.sender,
          receiver: data.receiver,
        });
      }
    } catch (error) {
      console.error('Error marking messages as read', error);
    }
  }

  @SubscribeMessage('join_chat')
  handleJoinChat(@MessageBody() data: { userId: string; peerId: string }) {
    if (data?.userId && data?.peerId) {
      this.activeChatMap.set(String(data.userId), String(data.peerId));
    }
  }

  @SubscribeMessage('leave_chat')
  handleLeaveChat(@MessageBody() userId: string) {
    if (userId) {
      this.activeChatMap.delete(String(userId));
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

      // استفاده از ?? برای جلوگیری از خطای مقدار 0
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
      console.error('add_invite_offline error:', error.message);
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
    // گشتن در مپ سوکت‌ها برای پیدا کردن و حذف تضمینی کاربر
    let disconnectedUserId: string | null = null;

    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        disconnectedUserId = userId;
        this.userSocketMap.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      this.cleanupUserOptional(disconnectedUserId);
    }

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
