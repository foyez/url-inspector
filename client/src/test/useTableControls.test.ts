import { useTableControls } from "@/hooks/useTableControls";
import { renderHook, act } from "@testing-library/react";

describe("useTableControls", () => {
  it("initializes with default values", () => {
    const { result } = renderHook(() => useTableControls());

    expect(result.current.state.page).toBe(1);
    expect(result.current.state.sortBy).toBe("created_at");
    expect(result.current.state.sortDir).toBe("desc");
    expect(result.current.state.filters).toEqual({});
  });

  it("updates page", () => {
    const { result } = renderHook(() => useTableControls());
    act(() => {
      result.current.setPage(2);
    });
    expect(result.current.state.page).toBe(2);
  });

  it("updates sortBy and doesn't reset page", () => {
    const { result } = renderHook(() => useTableControls());
    act(() => {
      result.current.setPage(3);
      result.current.setSortBy("title");
    });
    expect(result.current.state.sortBy).toBe("title");
    expect(result.current.state.page).toBe(3);
  });

  it("toggles sort direction if same column is clicked again", () => {
    const { result } = renderHook(() => useTableControls());
    act(() => {
      result.current.setSortBy("internal_links");
    });
    expect(result.current.state.sortDir).toBe("asc");
    act(() => {
      result.current.setSortBy("internal_links");
    });
    expect(result.current.state.sortDir).toBe("desc");
  });

  it("updates filters and resets page", () => {
    const { result } = renderHook(() => useTableControls());
    act(() => {
      result.current.setPage(5);
      result.current.setFilters({ status: "queued" });
    });
    expect(result.current.state.filters).toEqual({ status: "queued" });
    expect(result.current.state.page).toBe(1);
  });
});
