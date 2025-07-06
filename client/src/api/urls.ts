import type { URLData, URLDetails } from "@/types";
import client from "./client";

export const fetchURLs = () =>
  client.get<URLData[]>("/urls", { timeout: 5000 });

export const createURL = (url: string) => client.post("/urls", { url });

export const deleteURLs = (ids: number[]) =>
  client.delete("/urls", { data: { url_ids: ids } });

export const rerunURLs = (ids: number[]) =>
  client.post("/urls/rerun", { url_ids: ids });

export const getURLDetails = (id: number) =>
  client.get<URLDetails>(`/urls/${id}`);
