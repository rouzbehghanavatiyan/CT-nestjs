import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetUser } from 'src/modules/auth/user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('userMessages')
  async getUserMessages(
    @Query('userIdLogin') userIdLogin: number,
    @Query('userIdSender') userIdSender: number,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    try {
      const response = await this.chatService.getUserMessageService(
        userIdLogin,
        userIdSender,
        skip,
        take,
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

  @UseGuards(JwtAuthGuard)
  @Get('allUserMessagese')
  async getMessagesByRecieveId(@Query('userIdLogin') userIdLogin: number) {
    try {
      const response: any =
        await this.chatService.getMessagesByRecieveId(userIdLogin);
      const filteredResponse = response.map((message: any) => ({
        userProfile: message.userProfile,
        attachmentName: message.AttachmentName,
        ext: message.Ext,
        fileName: message.FileName,
        userNameSender: message.UserName,
        attachmentType: message.AttachmentType,
        sender: message.Id,
      }));
      return {
        status: 0,
        data: filteredResponse,
        message: 'success',
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Get('getUserProfile')
  getProfile(@GetUser() user: any) {
    return {
      userId: user.userId,
      username: user.username,
    };
  }

}
