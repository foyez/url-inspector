import type { Status } from ".";

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: string | null;
};

export type CrawlResponse = {
  id: number;
  message: string;
  status: Status;
};
