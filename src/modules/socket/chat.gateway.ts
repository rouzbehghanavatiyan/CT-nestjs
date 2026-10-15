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
import { PushNotificationService } from 'src/modules/chat/pushNotification.service';
import { ChatEntity } from 'src/modules/chat/chat.entity';
import { GapGptService } from 'src/modules/chat/gapgpt.service';
import { BotReplyScheduler } from './botReply.scheduler';
import { OnModuleInit } from '@nestjs/common';
import {
  BOT_REPLY_DELAY_MS,
  BOT_REPLY_POLL_MS,
} from 'src/utils/bot-reply.constants';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 30000,
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  private readonly userList: Map<string, any> = new Map();
  private readonly optionalUserList: Map<string, any> = new Map();
  private readonly userSocketMap: Map<string, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly sendMessageService: SendMessageService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly gapGptService: GapGptService,
    private readonly botReplyScheduler: BotReplyScheduler,
  ) {}

  onModuleInit() {
    this.botReplyScheduler.setHandler((userId, botId) =>
      this.generateAndDeliverBotReply(userId, botId),
    );
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
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

    let saveMessages: ChatEntity;
    try {
      saveMessages = await this.sendMessageService.execute(msgData);
    } catch (error: any) {
      client.emit('send_message_error', {
        message:
          error?.response?.message ||
          error?.message ||
          'خطا در ذخیره و ارسال پیام',
        isBlocked: error?.status === 403,
      });
      return;
    }

    const senderStr = String(msgData.sender);
    const receiverStr = String(msgData.recieveId);
    const contentText = saveMessages?.content?.text ?? String(msgData.content);

    const messagePayload = {
      id: saveMessages?.id,
      tempId: msgData?.tempId,
      userProfile: msgData?.userProfile,
      senderId: senderStr,
      receiveId: receiverStr,
      content: contentText,
      createdAt: saveMessages?.createdAt
        ? new Date(saveMessages.createdAt).toISOString()
        : new Date().toISOString(),
      userNameSender: msgData?.userNameSender,
      isRead: false,
    };

    const isReceiverBot = await this.chatService.isBotUser(receiverStr);
    console.log('🔍 Bot check:', { receiverStr, isReceiverBot });
    const receiverSocketId = this.userSocketMap.get(receiverStr);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', messagePayload);

      // this.server.to(receiverSocketId).emit('new_message_notification', {
      //   senderId: senderStr,
      //   senderName: msgData.userNameSender,
      //   message: contentText,
      //   timestamp: messagePayload.createdAt,
      // });
    } else if (!isReceiverBot) {
      // const senderName = msgData?.userNameSender || 'کاربر';
      // const notifBody = `${senderName}: ${contentText}`;
      // void this.pushNotificationService.sendToUser(receiverStr, notifBody, {
      //   type: 'chat_message',
      //   senderId: senderStr,
      //   senderName: msgData?.userNameSender,
      //   senderProfile: msgData?.userProfile,
      // });
    }

    client.emit('message_sent_ack', messagePayload);

    if (isReceiverBot) {
      await this.scheduleBotReply(senderStr, receiverStr, client);
    }
  }

  @SubscribeMessage('mark_messages_as_read')
  async handleMarkAsRead(
    @MessageBody() data: { sender: string; receiver: string },
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.sender, data.receiver);

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

  private handleUserDisconnectLogic(client: Socket) {
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

  private async scheduleBotReply(
    userId: string,
    botId: string,
    client: Socket,
  ) {
    console.log('🕒 scheduleBotReply called', { userId, botId });
    const delay = BOT_REPLY_DELAY_MS();
    const { alreadyScheduled, runAt } = await this.botReplyScheduler.schedule(
      userId,
      botId,
      delay,
    );

    client.emit('bot_reply_scheduled', {
      botId,
      alreadyScheduled,
      delayMs: delay,
      pollMs: BOT_REPLY_POLL_MS(),
      runAt: new Date(runAt).toISOString(),
    });
  }
  async generateAndDeliverBotReply(userId: string, botId: string) {
    const { messages } = await this.chatService.getUserMessageService(
      userId,
      botId,
      0,
      20,
    );

    const sorted = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const history = sorted.map((msg) => ({
      role:
        String(msg.senderId) === botId
          ? ('assistant' as const)
          : ('user' as const),
      content: msg.content?.text ?? '',
    }));

    const lastUserMsg = [...history].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    const replyText = await this.gapGptService.generateReply(
      lastUserMsg.content,
      history,
    );

    const botMessage = await this.sendMessageService.execute({
      sender: botId,
      recieveId: userId,
      content: replyText,
    });

    // کاربر ممکن است آفلاین باشد؛ پیام در دیتابیس ذخیره شده و بعداً دیده می‌شود
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('receive_message', {
        id: botMessage.id,
        senderId: botId,
        receiveId: userId,
        content: botMessage.content?.text ?? replyText,
        createdAt: botMessage.createdAt
          ? new Date(botMessage.createdAt).toISOString()
          : new Date().toISOString(),
        userNameSender: 'GAPGPT_BOT_NAME',
        isRead: false,
      });
    } else {
      // اختیاری: پوش نوتیفیکیشن
      // void this.pushNotificationService.sendToUser(userId, replyText, {...});
    }
  }
}
