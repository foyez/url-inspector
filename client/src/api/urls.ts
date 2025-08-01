import type { URLDetails } from "@/types";
import type {
  ApiResponse,
  CrawlResponse,
  ListURLsOptions,
  ListURLsResponse,
} from "@/types/api";
import client from "./client";

export const fetchURLs = async (
  options: ListURLsOptions = {}
): Promise<ListURLsResponse> => {
  const params = new URLSearchParams();
  if (options.page) params.append("page", options.page.toString());
  if (options.pageSize) params.append("page_size", options.pageSize.toString());
  if (options.sortBy) params.append("sort_by", options.sortBy);
  if (options.sortDir) params.append("sort_dir", options.sortDir);
  if (options.search) params.append("search", options.search);
  if (options.filters?.status) params.append("status", options.filters.status);
  if (options.filters?.html_version)
    params.append("html_version", options.filters.html_version);

  const res = await client.get<ApiResponse<ListURLsResponse>>(
    `/urls/?${params}`,
    {
      timeout: 5000,
    }
  );
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to fetch URLs");
  }
  return res.data.data;
};

export const createURL = async (url: string): Promise<void> => {
  const res = await client.post<ApiResponse<null>>("/urls/", { url });
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to create URL");
  }
};

export const deleteURLs = async (ids: number[]): Promise<void> => {
  const res = await client.delete<ApiResponse<null>>("/urls/", {
    data: { url_ids: ids },
  });
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to delete URLs");
  }
};

export const rerunURLs = async (ids: number[]): Promise<void> => {
  const res = await client.post<ApiResponse<null>>("/urls/rerun", {
    url_ids: ids,
  });
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to rerun URLs");
  }
};

export const fetchURLDetails = async (id: number): Promise<URLDetails> => {
  const res = await client.get<ApiResponse<URLDetails>>(`/urls/${id}`);
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to get details");
  }
  return res.data.data;
};

export const startCrawl = async (id: number): Promise<CrawlResponse> => {
  const res = await client.post<ApiResponse<CrawlResponse>>(
    `/urls/${id}/start`
  );
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to start crawl");
  }
  return res.data.data;
};

export const stopCrawl = async (id: number): Promise<CrawlResponse> => {
  const res = await client.post<ApiResponse<CrawlResponse>>(`/urls/${id}/stop`);
  if (!res.data.success) {
    throw new Error(res.data.error || "Failed to stop crawl");
  }
  return res.data.data;
};
