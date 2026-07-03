// src/modules/File/file.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { memoryStorage, diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { UploadStartFileDraftUseCase } from './use-case/uploadStartFileDraft.use-case';
import { CreateDraftUseCase } from './use-case/createDraft.use-case';
import { CompleteDraftUseCase } from './use-case/completeDraft.use-case';
import { DeleteDraftUseCase } from './use-case/deleteDraft.use-case';
import { ResizeVideoUseCase } from './use-case/resizeVideo.use-case';
import { FileVideoService } from './fileVideo.service';

@Controller('api/file')
export class FileController {
  constructor(
    private readonly uploadStartFileDraftUseCase: UploadStartFileDraftUseCase,
    private readonly createDraftUseCase: CreateDraftUseCase,
    private readonly completeDraftUseCase: CompleteDraftUseCase,
    private readonly deleteDraftUseCase: DeleteDraftUseCase,
    private readonly resizeVideoUseCase: ResizeVideoUseCase,
    private readonly fileVideoService: FileVideoService,
  ) {}

  @Post('uploadVideo')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'video', maxCount: 1 },
        { name: 'imageCover', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const uploadPath = './uploads/temp';
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
          },
          filename: (req, file, cb) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
        limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
      },
    ),
  )
  async uploadAndResizeVideo(
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      imageCover?: Express.Multer.File[];
    },
    @Body()
    body: {
      attachmentId: string;
      attachmentType: string;
      attachmentName: string;
    },
  ) {
    // کامنت شده به علت عدم وجود متد processAndSave در FileVideoService
    /*
    const videoFile = files?.video?.[0];
    const imageCoverFile = files?.imageCover?.[0];

    if (!videoFile) {
      throw new BadRequestException('فایل ویدیو ارسال نشده است');
    }
    if (!imageCoverFile) {
      throw new BadRequestException('فایل تصویر کاور ارسال نشده است');
    }

    const result = await this.fileVideoService.processAndSave({
      videoFile,
      imageCoverFile,
      attachmentId: body.attachmentId,
      attachmentType: body.attachmentType,
      attachmentName: body.attachmentName,
    });

    return {
      code: 0,
      message: 'ویدیو با موفقیت آپلود و پردازش شد',
      data: result,
    };
    */
    return { message: 'Feature temporarily disabled' };
  }

  @Post('uploadChunk')
  @UseInterceptors(
    FileInterceptor('chunk', {
      storage: memoryStorage(),
    }),
  )
  async uploadChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { draftId: string; chunkIndex: string; totalChunks: string },
  ) {
    return this.uploadStartFileDraftUseCase.execute({
      draftId: body.draftId,
      chunkIndex: +body.chunkIndex,
      totalChunks: +body.totalChunks,
      file,
    });
  }

  @Post('draft')
  async createDraft(
    @Body() body: { fileName: string; size: number; mimeType: string },
  ) {
    return this.createDraftUseCase.execute(body);
  }

  @Post('draft/complete')
  async completeDraft(@Body() body: { uploadId: string }) {
    return await this.completeDraftUseCase.execute(body.uploadId);
  }

  @Delete('draft/:uploadId')
  async deleteDraft(@Param('uploadId') uploadId: string) {
    return await this.deleteDraftUseCase.execute(uploadId);
  }
}
