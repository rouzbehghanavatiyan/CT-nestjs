import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { StatusEntity } from 'src/modules/Api/status.entity';
import { BotReplyJobEntity } from 'src/modules/chat/botReplyJob.entity';
import { ChatEntity } from 'src/modules/chat/chat.entity';
import { VideoDraftEntity } from 'src/modules/File/VideoDraftEntity';
import { Payment } from 'src/modules/store/paymant.entity';
import { StoreEntity } from 'src/modules/store/store.entity';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<number>('DB_PORT', 1433)),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [
    ChatEntity,
    StoreEntity,
    StatusEntity,
    Payment,
    VideoDraftEntity,
    BotReplyJobEntity,
  ],
  synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
