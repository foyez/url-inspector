import type { SortDir, Status, URLData } from ".";

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

export type ListURLsOptions = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: SortDir;
  search?: string;
  filters?: {
    status?: string;
    html_version?: string;
  };
};

export type ListURLsResponse = {
  urls: URLData[];
  total: number;
};
