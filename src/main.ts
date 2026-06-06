<<<<<<< HEAD
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

dotenv.config({ path: `${__dirname}/../.env` });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  app.useWebSocketAdapter(new IoAdapter(app));

  const ffmpegPath = path.join(process.cwd(), 'tools', 'ffmpeg.exe');
  ffmpeg.setFfmpegPath(ffmpegPath);

  console.log('FFmpeg Path:', ffmpegPath);

  const port = process.env.LISTEN_PORT || 5000;
  await app.listen(port);

  console.log(`Application is running on: ${process.env.LISTEN_PORT}`);
  console.log(`WebSocket is running on the same port: ${port}`);
=======
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './presentation/exceptions/global-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './presentation/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  const port = process.env.LISTEN_PORT || 4000;
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
  logger.log(`Static files served from: ${join(__dirname, '..', 'uploads')}`);
>>>>>>> 15cbbc06f1931aee169e6a7d908c5a8ef96a9d2b
}
bootstrap();
