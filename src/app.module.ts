import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './shared/middleware/logger.middleware';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/dbTypeorm.config';
import { ChatEntity } from './modules/chat/chat.entity';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { ChatModule } from './modules/chat/chat.module';
import { SocketModule } from './modules/socket/socket.module';
import { StoreModule } from './modules/store/store.module';
import { FileModule } from './modules/File/file.module';
import { ApiModule } from './modules/Api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([ChatEntity]),
    ChatModule,
    SocketModule,
    ApiModule,
    StoreModule,
    AuthModule,
    FileModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
