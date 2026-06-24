// file-video.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  IVideoAttachRepository,
  UploadStartDraftInput,
  UploadSession,
  DraftResult,
  UUID,
} from './IRepositories/IVideoAttach.repository';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { VideoDraftEntity } from './VideoDraftEntity';

@Injectable()
export class FileVideoService implements IVideoAttachRepository {
  constructor(
    @InjectRepository(VideoDraftEntity)
    private readonly draftRepo: Repository<VideoDraftEntity>,
  ) {}

    async resizeVideo(filePath: string, filename: string): Promise<string> {
      const outputDir = path.join(process.cwd(), 'uploads', 'videos');
      fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, filename);

      return new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .videoCodec('libx264')
          .outputOptions([
            '-vf scale=720:-2', // عرض 720، ارتفاع خودکار (حفظ نسبت تصویر)
            '-preset veryfast', // سرعت encode
            '-crf 28', // کیفیت معمولی با فشرده سازی خوب
            '-movflags +faststart', // شروع سریع در موبایل و وب
          ])
          .audioCodec('aac')
          .audioBitrate('96k') // صدای مناسب موبایل
          .on('end', () => {
            fs.unlink(filePath, () => {}); // حذف فایل موقت
            resolve(outputPath);
          })
          .on('error', (err) => reject(err))
          .save(outputPath);
      });
    }

  async createDraft(data: any): Promise<DraftResult> {
    const draft = this.draftRepo.create({
      productId: data.productId,
      status: 'CREATED',
      filename: data.filename ?? null,
      contentType: data.contentType ?? null,
      size: data.size ?? null,
      metadata: data.metadata ?? null,
    });

    const saved = await this.draftRepo.save(draft);

    return {
      ok: true,
      draftId: saved.id,
    };
  }

  async uploadStartFileDraft(
    data: UploadStartDraftInput,
  ): Promise<UploadSession> {
    let draftId = data.draftId;
    if (!draftId) {
      const result = await this.createDraft({
        contentType: data.contentType ?? data.mimeType,
        filename: data.filename,
        size: data.size,
        metadata: data.metadata,
      });
      draftId = result.draftId;
    }

    if (!data.file.arrayBuffer) {
      throw new Error('file.arrayBuffer is not available');
    }
    const buffer = Buffer.from(await data.file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), 'uploads', 'raw');
    fs.mkdirSync(uploadDir, { recursive: true });

    const ext = data.filename?.split('.').pop() ?? 'mp4';
    const savedFilename = `${draftId}.${ext}`;
    const filePath = path.join(uploadDir, savedFilename);

    fs.writeFileSync(filePath, buffer);

    // آپدیت وضعیت draft
    await this.draftRepo.update(
      { id: draftId },
      { status: 'UPLOADING', filename: savedFilename },
    );

    const uploadId = uuidv4();

    return {
      draftId,
      uploadId,
    };
  }

  // ── completeDraft ─────────────────────────────────────────────────────────
  async completeDraft(draftId: UUID): Promise<any> {
    const draft = await this.draftRepo.findOne({ where: { id: draftId } });
    if (!draft) {
      return { ok: false, draftId, message: 'draft not found' };
    }

    const rawPath = path.join(
      process.cwd(),
      'uploads',
      'raw',
      draft.filename ?? '',
    );
    if (!fs.existsSync(rawPath)) {
      return { ok: false, draftId, message: 'raw file not found' };
    }

    try {
      const resizedFilename = `resized_${draftId}.mp4`;
      const finalPath = await this.resizeVideo(rawPath, resizedFilename);

      await this.draftRepo.update(
        { id: draftId },
        {
          status: 'COMPLETED',
          finalUrl: finalPath,
        },
      );

      return { ok: true, draftId };
    } catch (err) {
      // return { ok: false, draftId, message: err.message };
      console.log(err);
      
    }
  }

  async deleteDraft(draftId: UUID): Promise<DraftResult> {
    const draft = await this.draftRepo.findOne({ where: { id: draftId } });
    if (!draft) {
      return { ok: false, draftId, message: 'draft not found' };
    }

    // حذف فایل‌های روی دیسک اگر وجود دارند
    const tryDelete = (filePath: string) => {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, () => {});
      }
    };

    if (draft.filename) {
      tryDelete(path.join(process.cwd(), 'uploads', 'raw', draft.filename));
    }
    if (draft.finalUrl) {
      tryDelete(draft.finalUrl);
    }

    await this.draftRepo.update({ id: draftId }, { status: 'DELETED' });

    return { ok: true, draftId };
  }
}
