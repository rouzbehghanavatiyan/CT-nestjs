import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // host: configService.get('DB_HOST'),
        host: '127.0.0.1',
        // port: configService.get('DB_PORT'),
        port: 5432,
        // username: configService.get('DB_USERNAME'),
        username: 'postgres',
        // password: configService.get('DB_PASSWORD'),
        password: 'N0v@t00l$123',
        // database: configService.get('DB_NAME'),
        database: 'novadb',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: false,
        synchronize: false, // مهم: در production باید false باشد
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
