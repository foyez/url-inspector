import type { URLData } from "@/types";
import { useEffect } from "react";

type UseCrawlPollingProps = {
  urls: URLData[];
  reload: () => void;
};

export function useCrawlPolling({ urls, reload }: UseCrawlPollingProps) {
  useEffect(() => {
    const hasRunning = urls.some((u) => u.status === "running");
    if (!hasRunning) return;

    const interval = setInterval(() => {
      reload();
    }, import.meta.env.VITE_POLLING_TIME);

    return () => clearInterval(interval);
  }, [urls, reload]);
}
