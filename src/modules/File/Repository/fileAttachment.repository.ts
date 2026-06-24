import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import {
  existsSync,
  mkdirSync,
  appendFileSync,
  unlinkSync,
  readdirSync,
  readFileSync,
  rmSync,
} from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { v4 as uuidv4 } from 'uuid';
import type {
  IVideoAttachRepository,
  UploadStartDraftInput,
  UploadSession,
  DraftResult,
  UUID,
} from '../IRepositories/IVideoAttach.repository';
import { VideoDraftEntity } from '../VideoDraftEntity';

@Injectable()
export class FileAttachmentRepository implements IVideoAttachRepository {
  constructor(
    @InjectRepository(VideoDraftEntity)
    private readonly draftRepo: Repository<VideoDraftEntity>,
  ) {}

  // ── resizeVideo ───────────────────────────────────────────────────────────

  async resizeVideo(filePath: string, filename: string): Promise<string> {
    const outputDir = join(process.cwd(), 'uploads', 'resized');
    mkdirSync(outputDir, { recursive: true });

    const outputFilename = `resized-${filename}`;
    const outputPath = join(outputDir, outputFilename);

    await new Promise<void>((resolve, reject) => {
      ffmpeg(filePath)
        .videoFilter(
          'scale=1080:1920:force_original_aspect_ratio=decrease,' +
            'pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black',
        )
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions(['-crf 23', '-preset fast', '-movflags +faststart'])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    try {
      unlinkSync(filePath);
    } catch {
      // اگر حذف نشد مشکلی نیست
    }

    return `/uploads/resized/${outputFilename}`;
  }

  // ── createDraft ───────────────────────────────────────────────────────────

  async createDraft(data: {
    fileName: string;
    size: number;
    mimeType: string;
  }): Promise<{ uploadId: string }> {
    const uploadId = uuidv4();

    const draft = this.draftRepo.create({
      uploadId,
      filename: data.fileName,
      size: String(data.size),
      contentType: data.mimeType,
      status: 'CREATED',
    });

    await this.draftRepo.save(draft);
    return { uploadId };
  }

  // ── uploadStartFileDraft (chunk upload) ───────────────────────────────────

  async uploadStartFileDraft(
    data: UploadStartDraftInput,
  ): Promise<UploadSession> {
    const { draftId, chunkIndex = 0, totalChunks = 1, file } = data;

    if (!draftId) {
      throw new InternalServerErrorException('draftId الزامی است');
    }

    if (!file?.buffer) {
      throw new InternalServerErrorException('chunk buffer خالی است');
    }

    const draft = await this.draftRepo.findOne({
      where: { uploadId: draftId },
    });

    if (!draft) {
      throw new NotFoundException(`Draft ${draftId} یافت نشد`);
    }

    const chunksDir = join(process.cwd(), 'uploads', 'chunks', draftId);
    mkdirSync(chunksDir, { recursive: true });

    const chunkPath = join(
      chunksDir,
      `chunk-${String(chunkIndex).padStart(5, '0')}`,
    );
    appendFileSync(chunkPath, file.buffer);

    if (draft.status === 'CREATED') {
      draft.status = 'UPLOADING';
      await this.draftRepo.save(draft);
    }

    const receivedChunks = this._getSortedChunkBuffers(chunksDir).length;
    const isComplete = receivedChunks >= totalChunks;

    return {
      draftId,
      uploadId: draft.uploadId ?? draftId,
      chunkIndex,
      totalChunks,
      receivedChunks,
      isComplete,
    };
  }

  // ── completeDraft ─────────────────────────────────────────────────────────

  async completeDraft(draftId: UUID): Promise<DraftResult> {
    const draft = await this.draftRepo.findOne({
      where: { uploadId: draftId },
    });

    if (!draft) {
      throw new NotFoundException(`Draft ${draftId} یافت نشد`);
    }

    const chunksDir = join(process.cwd(), 'uploads', 'chunks', draftId);
    if (!existsSync(chunksDir)) {
      throw new InternalServerErrorException('chunk‌های آپلود یافت نشدند');
    }

    const finalDir = join(process.cwd(), 'uploads', 'final');
    mkdirSync(finalDir, { recursive: true });

    const ext = draft.filename?.split('.').pop() ?? 'mp4';
    const finalFilename = `${draftId}.${ext}`;
    const finalPath = join(finalDir, finalFilename);

    // merge chunks
    const buffers = this._getSortedChunkBuffers(chunksDir);
    for (const buf of buffers) {
      appendFileSync(finalPath, buf);
    }

    // resize
    const resizedUrl = await this.resizeVideo(finalPath, finalFilename);

    draft.status = 'COMPLETED';
    draft.finalUrl = resizedUrl;
    await this.draftRepo.save(draft);

    this._cleanupChunks(chunksDir);

    return { ok: true, draftId, url: resizedUrl };
  }

  // ── deleteDraft ───────────────────────────────────────────────────────────

  async deleteDraft(draftId: UUID): Promise<DraftResult> {
    const draft = await this.draftRepo.findOne({
      where: { uploadId: draftId },
    });

    if (!draft) {
      throw new NotFoundException(`Draft ${draftId} یافت نشد`);
    }

    draft.status = 'DELETED';
    await this.draftRepo.save(draft);

    const chunksDir = join(process.cwd(), 'uploads', 'chunks', draftId);
    if (existsSync(chunksDir)) {
      this._cleanupChunks(chunksDir);
    }

    return { ok: true, draftId };
  }

  // ── private helpers ───────────────────────────────────────────────────────

  private _getSortedChunkBuffers(dir: string): Buffer[] {
    if (!existsSync(dir)) return [];
    return readdirSync(dir)
      .filter((f) => f.startsWith('chunk-'))
      .sort()
      .map((f) => readFileSync(join(dir, f)));
  }

  private _cleanupChunks(dir: string): void {
    try {
      readdirSync(dir).forEach((f) => {
        rmSync(join(dir, f), { force: true });
      });
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // silent
    }
  }
}
