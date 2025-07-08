/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import * as api from "@/api/urls";
import DashboardPage from "@/pages/DashboardPage";
import type { URLData } from "@/types";

// Mock react-hot-toast to prevent errors
vi.mock("react-hot-toast", () => ({
  __esModule: true,
  default: { success: vi.fn(), error: vi.fn() },
}));

// Mock child components
vi.mock("../components/URLControls", () => ({
  __esModule: true,
  default: ({ onAdd }: any) => (
    <form
      aria-label="Mock Form"
      onSubmit={(e) => {
        e.preventDefault();
        onAdd("https://example.com");
      }}
    >
      <button type="submit">Mock Add URL</button>
    </form>
  ),
}));

vi.mock("../components/URLTable", () => ({
  __esModule: true,
  default: ({ urls }: any) => (
    <div>
      {urls.length === 0 ? (
        <p>No URLs</p>
      ) : (
        urls.map((url: any) => <p key={url.id}>{url.title}</p>)
      )}
    </div>
  ),
}));

const URLS: URLData[] = [
  {
    id: 1,
    title: "URL 1",
    html_version: "HTML5",
    has_login_form: true,
    internal_links: 10,
    external_links: 5,
    broken_links: 2,
    status: "done",
    created_at: "",
  },
  {
    id: 2,
    title: "URL 2",
    html_version: "HTML5",
    has_login_form: true,
    internal_links: 10,
    external_links: 5,
    broken_links: 2,
    status: "queued",
    created_at: "",
  },
];

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("loads and displays URLs on mount", async () => {
    vi.spyOn(api, "fetchURLs").mockResolvedValueOnce({
      urls: URLS,
      total: 2,
    });

    render(<DashboardPage />);
    expect(screen.getByText(/URL Dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/URL 1/i)).toBeInTheDocument();
      expect(screen.getByText(/URL 2/i)).toBeInTheDocument();
    });
  });

  it("shows error toast when fetch fails", async () => {
    const fetchSpy = vi
      .spyOn(api, "fetchURLs")
      .mockRejectedValueOnce(new Error("Fetch failed"));
    const toast = await import("react-hot-toast");

    render(<DashboardPage />);

    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith("Fetch failed");
    });

    expect(fetchSpy).toHaveBeenCalled();
  });

  it("submits new URL via form and reloads", async () => {
    const fetchSpy = vi
      .spyOn(api, "fetchURLs")
      .mockResolvedValueOnce({ total: 2, urls: URLS });
    const createSpy = vi
      .spyOn(api, "createURL")
      .mockResolvedValueOnce(undefined);
    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: /Mock Add URL/i }));

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith("https://example.com");
    });

    // on mount + after submit
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("shows error toast on add URL failure", async () => {
    vi.spyOn(api, "fetchURLs").mockResolvedValueOnce({ total: 0, urls: [] });
    vi.spyOn(api, "createURL").mockRejectedValueOnce(
      new Error("Create failed")
    );
    const toast = await import("react-hot-toast");

    render(<DashboardPage />);
    fireEvent.click(screen.getByRole("button", { name: /Add URL/i }));

    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith("Create failed");
    });
  });
});
