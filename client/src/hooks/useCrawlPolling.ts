import { fetchURLs } from "@/api/urls";
import type { TableState } from "@/reducers/tableReducer";
import type { URLData } from "@/types";
import { useEffect } from "react";

type UseCrawlPollingProps = {
  urls: URLData[];
  table: TableState;
  update: (urls: URLData[]) => void;
};

export function UseCrawlPolling({ urls, table, update }: UseCrawlPollingProps) {
  useEffect(() => {
    const hasActive = urls.some((u) => u.status == "running");
    if (!hasActive) return;

    const interval = setInterval(async () => {
      try {
        const { urls } = await fetchURLs({
          search: table.search,
          sortBy: table.sortBy,
          sortDir: table.sortDir,
          page: table.page,
          pageSize: table.pageSize,
        });
        update(urls);
      } catch (err) {
        console.error("Polling error", err);
      }
    }, import.meta.env.VITE_POLLING_TIME);

    return () => clearInterval(interval);
  }, [
    urls,
    table.search,
    table.sortBy,
    table.sortDir,
    table.page,
    table.pageSize,
    update,
  ]);
}
