import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage, diskStorage } from 'multer';
import { extname } from 'path';
import { UploadStartFileDraftUseCase } from './use-case/uploadStartFileDraft.use-case';
import { CreateDraftUseCase } from './use-case/createDraft.use-case';
import { CompleteDraftUseCase } from './use-case/completeDraft.use-case';
import { DeleteDraftUseCase } from './use-case/deleteDraft.use-case';
import { ResizeVideoUseCase } from './use-case/resizeVideo.use-case';

@Controller('api/file')
export class FileController {
  constructor(
    private readonly uploadStartFileDraftUseCase: UploadStartFileDraftUseCase,
    private readonly createDraftUseCase: CreateDraftUseCase,
    private readonly completeDraftUseCase: CompleteDraftUseCase,
    private readonly deleteDraftUseCase: DeleteDraftUseCase,
    private readonly resizeVideoUseCase: ResizeVideoUseCase,
  ) {}

  @Post('uploadVideo')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAndResizeVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { code: -1, message: 'فایلی ارسال نشده است' };
    }
    const resizedVideoPath = await this.resizeVideoUseCase.execute(file);

    return {
      code: 0,
      message: 'ویدیو با موفقیت دریافت و ریسایز شد',
      data: {
        originalPath: file.path,
        resizedPath: resizedVideoPath,
      },
    };
  }

  @Post('uploadChunk')
  @UseInterceptors(
    FileInterceptor('chunk', {
      storage: memoryStorage(),
    }),
  )
  async uploadChunk(@UploadedFile() file: Express.Multer.File, @Body() body) {
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
