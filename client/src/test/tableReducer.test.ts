import {
  initialTableState,
  tableReducer,
  type TableState,
} from "@/reducers/tableReducer";

describe("tableReducer", () => {
  it("should update page", () => {
    const nextState = tableReducer(initialTableState, {
      type: "SET_PAGE",
      page: 3,
    });
    expect(nextState.page).toBe(3);
  });

  it("should update total", () => {
    const nextState = tableReducer(initialTableState, {
      type: "SET_TOTAL",
      total: 100,
    });
    expect(nextState.total).toBe(100);
  });

  it("should update filters and reset page", () => {
    const state = { ...initialTableState, page: 5 };
    const nextState = tableReducer(state, {
      type: "SET_FILTERS",
      filters: { status: "done" },
    });
    expect(nextState.filters).toEqual({ status: "done" });
    expect(nextState.page).toBe(1);
  });

  it("should toggle sort direction when same column", () => {
    const state: TableState = {
      ...initialTableState,
      sortBy: "title",
      sortDir: "asc",
    };
    const nextState = tableReducer(state, {
      type: "SET_SORT",
      sortBy: "title",
    });
    expect(nextState.sortDir).toBe("desc");
  });

  it("should change sort column and reset direction", () => {
    const state: TableState = {
      ...initialTableState,
      sortBy: "title",
      sortDir: "desc",
    };
    const nextState = tableReducer(state, {
      type: "SET_SORT",
      sortBy: "status",
    });
    expect(nextState.sortBy).toBe("status");
    expect(nextState.sortDir).toBe("asc");
  });
});
