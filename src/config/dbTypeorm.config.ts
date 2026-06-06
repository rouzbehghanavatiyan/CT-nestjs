import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ChatEntity } from 'src/modules/chat/chat.entity';
import { VideoDraftEntity } from 'src/modules/File/VideoDraftEntity';
import { Payment } from 'src/modules/store/paymant.entity';
import { StoreEntity } from 'src/modules/store/store.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mssql',
  host: '171.22.25.222',
  port: 1433,
  username: 'sa',
  password: 'qweQWE123!@#',
  database: 'sotDb',
  entities: [ChatEntity, StoreEntity, Payment, VideoDraftEntity],
  synchronize: true,
  options: {
    trustServerCertificate: true,
  },
};
