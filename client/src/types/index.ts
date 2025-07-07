export type Status = "queued" | "running" | "done" | "error";

export type SortDir = "asc" | "desc";

export type URLData = {
  id: number;
  title: string;
  html_version: string;
  has_login_form: boolean;
  internal_links: number;
  external_links: number;
  broken_links: number;
  status: Status;
  created_at: string;
};

export type URLDetails = {
  id: number;
  title: string;
  html_version: string;
  has_login_form: boolean;
  internal_links: number;
  external_links: number;
  heading_counts: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  broken_links: { link: string; statusCode: number }[];
};
