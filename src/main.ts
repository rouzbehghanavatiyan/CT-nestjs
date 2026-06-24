import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './presentation/exceptions/global-exception.filter';
import path, { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ResponseInterceptor } from './presentation/interceptors/response.interceptor';
import ffmpeg from 'fluent-ffmpeg';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  const ffmpegPath = path.join(process.cwd(), 'tools', 'ffmpeg.exe');
  ffmpeg.setFfmpegPath(ffmpegPath);

  console.log('FFmpeg Path:', ffmpegPath);

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
}
bootstrap();
