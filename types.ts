export interface ProcessedImage {
  original: string; // Base64
  processed: string | null; // Base64
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ProcessingError {
  message: string;
}
