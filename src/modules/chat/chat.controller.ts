import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetUser } from 'src/modules/auth/user.decorator';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('userMessages')
  async getUserMessages(
    @Query('userIdLogin') userIdLogin: string,
    @Query('userIdSender') userIdSender: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    try {
      const response = await this.chatService.getUserMessageService(
        userIdLogin,
        userIdSender,
        Number(skip) || 0,
        Number(take) || 10,
      );

      console.log(response);

      return {
        message: `Messages between user`,
        data: response,
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Get('allUserMessagese')
  async getMessagesByReceiveId(
    @GetUser('userId') userIdLogin: any,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ) {
    try {
      const currentUserId =
        typeof userIdLogin === 'object' ? userIdLogin?.UserId : userIdLogin;

      const { data, hasMore, total } =
        await this.chatService.getMessagesByReceiveId(
          currentUserId,
          Number(skip) || 0,
          Number(take) || 20,
        );

      const filteredResponse = data.map((message: any) => ({
        userProfile: message.userProfile,
        attachmentName: message.AttachmentName,
        ext: message.Ext,
        fileName: message.FileName,
        userNameSender: message.UserName,
        attachmentType: message.AttachmentType,
        sender: message.Id,
        unreadCount: message.unreadCount,
        isReadChat: !message.isReadChat,
        lastMessageDate: message.LastMessageDate,
      }));

      return {
        status: 0,
        data: filteredResponse,
        hasMore,
        total,
        message: 'success',
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('getUserProfile')
  getProfile(@GetUser() user: any) {
    return {
      userId: user.userId,
      username: user.username,
    };
  }

  @Patch('markAsRead')
  async markAsRead(
    @Body('senderId') senderId: string,
    @Body('receiveId') receiveId: string,
    @Body('messageId') messageId?: number,
  ) {
    try {
      const result = await this.chatService.markMessagesAsRead(
        senderId,
        receiveId,
        messageId,
      );

      return {
        status: 0,
        message: 'Messages marked as read successfully',
        affected: result.affected,
      };
    } catch (error: any) {
      return {
        status: 1,
        message: error.message || 'Failed to mark messages as read',
      };
    }
  }
  @Get('unreadCount/:userId')
  async getUnreadCount(@Param('userId') userId: string) {
    return this.chatService.getUnreadMessagesCount(userId);
  }
}
