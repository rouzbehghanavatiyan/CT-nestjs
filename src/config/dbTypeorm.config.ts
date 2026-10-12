import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<number>('DB_PORT', 1433)),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  autoLoadEntities: true,
  entities: [
    join(__dirname, '..', '**', '*.entity.{ts,js}'),
    join(__dirname, '..', '**', '*Entity.{ts,js}'),
  ],
  synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
});
