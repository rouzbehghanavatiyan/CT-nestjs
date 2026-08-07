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
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly userList: Map<string, any> = new Map();
  private readonly optionalUserLis: Map<string, any> = new Map();
  private readonly userSocketMap: Map<number, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly sendMessageService: SendMessageService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected on main port: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.userList.delete(client.id);
    this.handleUserDisconnectLogic(client);
  }

  @SubscribeMessage('register_user')
  handleRegisterUser(
    @MessageBody() userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.userSocketMap.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() msgData: any,
    @ConnectedSocket() client: Socket,
  ) {
    // 1. ذخیره در دیتابیس
    const saveMessages = await this.sendMessageService.saveMessage(msgData);
    console.log(msgData);

    // 2. ارسال به همه (Broadcast) به جز خود فرستنده
    client.broadcast.emit('receive_message', {
      id: saveMessages?.id,
      userProfile: msgData?.userProfile,
      recieveId: msgData?.recieveId,
      sender: Number(msgData?.sender),
      time: msgData?.time,
      userNameSender: msgData?.userNameSender,
      title: msgData?.title,
    });

    // 3. ارسال نوتیفیکیشن به گیرنده خاص
    const receiverSocketId = this.userSocketMap.get(Number(msgData.recieveId));
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('new_message_notification', {
        senderId: Number(msgData.sender),
        senderName: msgData.userNameSender,
        message: msgData.title,
        timestamp: new Date().toISOString(),
      });
    }

    // 4. ارسال نوتیفیکیشن عمومی سیستم
    this.server.emit('notification_message', {
      type: 'message',
      title: 'پیام جدید',
      message: `پیام جدید از ${msgData.userNameSender}`,
      senderId: Number(msgData.sender),
      senderName: msgData.userNameSender,
      receiverId: Number(msgData.recieveId),
      chatData: {
        id: saveMessages?.id,
        title: msgData.title,
        time: msgData.time,
      },
    });
  }

  @SubscribeMessage('mark_messages_as_read')
  async handleMarkAsRead(
    @MessageBody() data: { sender: number; receiver: number },
  ) {
    try {
      await this.chatService.markMessagesAsRead(data.sender, data.receiver);

      this.server.emit('messages_read_confirmation', {
        sender: data.sender,
        receiver: data.receiver,
      });
    } catch (error) {
      console.error('Error marking messages as read', error);
    }
  }

  @SubscribeMessage('user_entered_optional')
  async handleUserEnteredOptional(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.userList.set(client.id, data);

    client.emit(
      'user_entered_optional_response',
      Array.from(this.userList.values()),
    );
    this.server.emit(
      'user_entered_optional_response',
      Array.from(this.userList.values()),
    );
  }

  @SubscribeMessage('add_liked')
  handleAddLiked(
    @MessageBody() data: { userId: number; movieId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('👍 add_liked_response:', data);
    
    this.server.emit('add_liked_response', data);
  }

  @SubscribeMessage('remove_liked')
  handleRemoveLiked(
    @MessageBody() data: { userId: number; movieId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('👎 remove_liked_response:', data);
    
    this.server.emit('remove_liked_response', data);
  }


  @SubscribeMessage('user_left_optional')
  handleUserLeftOptional(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.cleanupUserOptional(data.userId);
    this.server.emit(
      'user_entered_optional_response',
      Array.from(this.userList.values()),
    );
  }

  @SubscribeMessage('add_invite_offline')
  async handleAddInviteOffline(
    @MessageBody() inviteData: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      console.log('📩 add_invite_offline received:', inviteData);

      if (!inviteData) {
        return {
          status: 1,
          message: 'Invite data is empty',
        };
      }

      const receiverUserId =
        Number(inviteData?.reciveUserId) ||
        Number(inviteData?.receiveUserId) ||
        Number(inviteData?.receiverUserId) ||
        Number(inviteData?.userId);

      const senderUserId =
        Number(inviteData?.senderUserId) ||
        Number(inviteData?.fromUserId) ||
        Number(inviteData?.userId);

      const receiverSocketId = this.userSocketMap.get(receiverUserId);

      console.log('receiverUserId:', receiverUserId);
      console.log('receiverSocketId:', receiverSocketId);

      /**
       * اگر کاربر مقصد آنلاین بود، برایش ارسال کن
       */
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('receive_invite', inviteData);

        return {
          status: 0,
          message: 'Invite sent to online user',
          isOnline: true,
          data: inviteData,
        };
      }

      /**
       * اگر کاربر مقصد آنلاین نبود، باز هم ACK موفق برگردان
       * چون invite در دیتابیس قبلاً با addInvite ساخته شده.
       */
      return {
        status: 0,
        message: 'Invite created but receiver is offline',
        isOnline: false,
        data: inviteData,
      };
    } catch (error) {
      console.log('❌ add_invite_offline error:', error);

      return {
        status: 1,
        message: 'Socket invite failed',
        error: error?.message,
      };
    }
  }

  @SubscribeMessage('add_invite_optional')
  handleAddInviteOptional(@MessageBody() data: any) {
    this.optionalUserLis.set(data.userIdSender, data);
    this.server.emit('add_invite_optional_response', data);

    const targetSocketId = this.userSocketMap.get(data.userIdReciever);
    if (targetSocketId) {
      this.server.to(targetSocketId).emit('add_invite_optional_target', data);
    }
  }

  private handleUserDisconnectLogic(client: Socket) {
    const userData = this.userList.get(client.id);
    if (userData) {
      const userId = userData.userIdJoin;
      this.userSocketMap.delete(userId);
      this.cleanupUserOptional(userId);
    }
    this.userList.delete(client.id);
    this.server.emit(
      'user_entered_optional_response',
      Array.from(this.userList.values()),
    );
  }

  private cleanupUserOptional(userId: any) {
    for (const [key, value] of this.userList.entries()) {
      if (value.userIdJoin === userId) {
        this.userList.delete(key);
        break;
      }
    }
    for (const [userIdSender, inviteData] of this.optionalUserLis.entries()) {
      if (
        inviteData.userIdSender === userId ||
        inviteData.userIdReciever === userId
      ) {
        this.optionalUserLis.delete(userIdSender);
      }
    }
  }
}