import { fetchURLs } from "@/api/urls";
import type { URLData } from "@/types";
import { useEffect } from "react";

type UseCrawlPollingProps = {
  urls: URLData[];
  update: (urls: URLData[]) => void;
};
const POLLING_TIME = 2000;

export function UseCrawlPolling({ urls, update }: UseCrawlPollingProps) {
  useEffect(() => {
    const hasActive = urls.some((u) => u.status == "running");
    if (!hasActive) return;

    const interval = setInterval(async () => {
      try {
        const newUrls = await fetchURLs();
        update(newUrls);
      } catch (err) {
        console.error("Polling error", err);
      }
    }, POLLING_TIME);

    return () => clearInterval(interval);
  }, [urls, update]);
}
