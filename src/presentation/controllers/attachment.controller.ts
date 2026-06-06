import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { AddAttachmentUseCase } from 'src/application/use-cases/addAttachment.use-case';

@Controller('api/attachment')
export class AttachmentController {
  constructor(private readonly addAttachmentUseCase: AddAttachmentUseCase) {}

  @Post('addAttachment')
  @UseInterceptors(
    FilesInterceptor('attachmentFile', 5, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const attachmentType = req.body.attachmentType;
          if (!attachmentType) {
            throw new BadRequestException('attachmentType ارسال نشده است');
          }
          const basePath = process.env.STATIC_ROOT || 'storage';
          const uploadPath = join(basePath, attachmentType);

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },

        filename: (req, file, cb) => {
          const uniqueName = req.body.fileName;
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async addAttachment(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('هیچ فایلی آپلود نشده است.');
    }

    const file = files[0];
    let productId: number | null = null;
    if (body.productId && body.productId !== 'null') {
      productId = Number(body.productId);
    }
    const attachmentData = {
      fileName: file.filename?.split('.')[0],
      ext: extname(file.originalname),
      attachmentType: body.attachmentType,
      productId,
    };

    return await this.addAttachmentUseCase.execute(attachmentData);
  }
}

 