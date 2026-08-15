import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetUser } from 'src/modules/auth/user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('userMessages')
  async getUserMessages(
    @Query('userIdLogin') userIdLogin: string, // تبدیل به string (GUID)
    @Query('userIdSender') userIdSender: string, // تبدیل به string (GUID)
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

  @UseGuards(JwtAuthGuard)
  @Get('allUserMessagese')
  async getMessagesByReceiveId(@Query('userIdLogin') userIdLogin: string) {
    try {
      const response: any =
        await this.chatService.getMessagesByReceiveId(userIdLogin); // اصلاح نام متد فراخوانی شده از سرویس
      
      const filteredResponse = response.map((message: any) => ({
        userProfile: message.userProfile, // از جدول User می‌آید
        attachmentName: message.AttachmentName,
        ext: message.Ext,
        fileName: message.FileName,
        userNameSender: message.UserName, // از جدول User می‌آید
        attachmentType: message.AttachmentType,
        sender: message.Id, // فرمت این فیلد حالا از دیتابیس string (GUID) برمی‌گردد
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
      userId: user.userId, // در دکوراتور نیز انتظار می‌رود این مقدار string باشد
      username: user.username,
    };
  }
}
