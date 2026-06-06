import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatEntity } from './chat.entity';

@Injectable()
export class SendMessageService {
  constructor(
    @InjectRepository(ChatEntity)
    private readonly chatRepository: Repository<ChatEntity>,
  ) {}

  async saveMessage(msgData: any): Promise<ChatEntity> {
    const newMessage = this.chatRepository.create({
      userProfile: msgData?.userProfile,
      recieveId: msgData?.recieveId,
      sender: Number(msgData?.sender),
      time: msgData?.time,
      userNameSender: msgData?.userNameSender,
      title: msgData?.title,
    });

    const response = await this.chatRepository.save(newMessage);
    return response;
  }
}
