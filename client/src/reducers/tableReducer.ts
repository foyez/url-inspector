import type { SortDir } from "@/types";

export type TableState = {
  search: string;
  sortBy: string;
  sortDir: SortDir;
  page: number;
  pageSize: number;
  total: number;
  filters: {
    status?: string;
    html_version?: string;
  };
};

export const initialTableState: TableState = {
  search: "",
  sortBy: "created_at",
  sortDir: "desc",
  page: 1,
  pageSize: import.meta.env.VITE_PAGE_SIZE,
  total: 0,
  filters: {},
};

type Action =
  | { type: "SET_TOTAL"; total: number }
  | { type: "SET_SEARCH"; search: string }
  | { type: "SET_SORT"; sortBy: string }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_PAGE_SIZE"; pageSize: number }
  | { type: "SET_FILTERS"; filters: TableState["filters"] }
  | { type: "RESET" };

export function tableReducer(state: TableState, action: Action): TableState {
  switch (action.type) {
    case "SET_TOTAL":
      return { ...state, total: action.total };
    case "SET_SEARCH":
      return { ...state, search: action.search, page: 1 };
    case "SET_SORT": {
      const isSameColumn = state.sortBy === action.sortBy;
      const newDir = isSameColumn && state.sortDir === "asc" ? "desc" : "asc";

      return {
        ...state,
        sortBy: action.sortBy,
        sortDir: newDir,
      };
    }
    case "SET_PAGE":
      return { ...state, page: action.page };
    case "SET_FILTERS":
      return { ...state, filters: action.filters, page: 1 };
    case "RESET":
      return initialTableState;
    default:
      return state;
  }
}
