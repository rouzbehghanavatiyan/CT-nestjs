// IVideoAttach.repository.ts

export type UUID = string;

export interface DraftResult {
  ok: boolean;
  draftId: UUID;
  message?: string;
  url?: string;
}

// createDraft هم DraftResult برمی‌گرداند (نه { uploadId })
export interface UploadSession {
  draftId: UUID;
  uploadId: UUID;
  chunkIndex?: number;
  totalChunks?: number;
  receivedChunks?: number;
  isComplete?: boolean;
}

export interface UploadStartDraftInput {
  draftId?: UUID;
  mimeType?: string;
  filename?: string;
  contentType?: string;
  size?: number;
  metadata?: Record<string, any>;
  chunkIndex?: number;
  totalChunks?: number;
  file: {
    buffer?: Buffer;
    arrayBuffer?: () => Promise<ArrayBuffer>;
  };
}

export interface IVideoAttachRepository {
  resizeVideo(filePath: string, filename: string): Promise<string>;
  // createDraft(data: any): Promise<any>;
  // uploadStartFileDraft(data: UploadStartDraftInput): Promise<UploadSession>;
  // completeDraft(draftId: UUID): Promise<DraftResult>;
  // deleteDraft(draftId: UUID): Promise<DraftResult>;
}
