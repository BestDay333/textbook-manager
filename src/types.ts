export type BookFormat = 'pdf' | 'epub' | 'fb2';

export interface Textbook {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade?: number;        // класс (1–11)
  year?: number;
  format: BookFormat;
  fileUri: string;       // local path after download
  coverUri?: string;
  fileSize: number;      // bytes
  downloadedAt: string;  // ISO date
  lastOpenedAt?: string;
  currentPage?: number;
  totalPages?: number;
  tags: string[];
}

export interface DownloadItem {
  id: string;
  textbookId: string;
  url: string;
  progress: number;      // 0–1
  status: 'queued' | 'downloading' | 'done' | 'error';
  error?: string;
}

export type RootStackParamList = {
  Tabs: undefined;
  Reader: { textbookId: string };
  BookDetail: { textbookId: string };
  Search: undefined;
  AddBook: undefined;
};

export type TabParamList = {
  Library: undefined;
  Downloads: undefined;
  Settings: undefined;
};
