import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { REPOSITORY_TOKENS } from '../contans/token';
import { FileVideoService } from './fileVideo.service';
import { VideoDraftEntity } from './VideoDraftEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadStartFileDraftUseCase } from './use-case/uploadStartFileDraft.use-case';
import { CreateDraftUseCase } from './use-case/createDraft.use-case';
import { CompleteDraftUseCase } from './use-case/completeDraft.use-case';
import { DeleteDraftUseCase } from './use-case/deleteDraft.use-case';
import { ResizeVideoUseCase } from './use-case/resizeVideo.use-case';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoDraftEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [FileController],
  providers: [
    FileVideoService,
    UploadStartFileDraftUseCase,
    CreateDraftUseCase,
    CompleteDraftUseCase,
    DeleteDraftUseCase,
    ResizeVideoUseCase,
    {
      provide: REPOSITORY_TOKENS.VIDEO_ATTACH,
      useClass: FileVideoService,
    },
  ],

  exports: [FileVideoService],
})
export class FileModule {}
