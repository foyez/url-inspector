import { useCrawlPolling } from "@/hooks/useCrawlPolling";
import type { URLData } from "@/types";
import { renderHook, act } from "@testing-library/react";

vi.useFakeTimers();

describe("useCrawlPolling", () => {
  const mockReload = vi.fn();

  const urls: URLData[] = [
    {
      id: 1,
      title: "URL 1",
      html_version: "HTML5",
      has_login_form: true,
      internal_links: 10,
      external_links: 5,
      broken_links: 2,
      created_at: "",
      status: "done",
    },
    {
      id: 2,
      title: "URL 1",
      html_version: "HTML5",
      has_login_form: true,
      internal_links: 10,
      external_links: 5,
      broken_links: 2,
      created_at: "",
      status: "queued",
    },
    {
      id: 3,
      title: "URL 1",
      html_version: "HTML5",
      has_login_form: true,
      internal_links: 10,
      external_links: 5,
      broken_links: 2,
      created_at: "",
      status: "running",
    },
  ];

  beforeEach(() => {
    mockReload.mockReset();
  });

  it("sets interval only when a URL is running", () => {
    renderHook(() => useCrawlPolling({ urls, reload: mockReload }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(mockReload).toHaveBeenCalled();
  });

  it("does not poll when all URLs are done", () => {
    renderHook(() => useCrawlPolling({ urls: [urls[0]], reload: mockReload }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(mockReload).not.toHaveBeenCalled();
  });

  it("clears timer on unmount", () => {
    const { unmount } = renderHook(() =>
      useCrawlPolling({ urls, reload: mockReload })
    );
    unmount();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(mockReload).not.toHaveBeenCalled();
  });
});
