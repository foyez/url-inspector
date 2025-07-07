import {
  initialTableState,
  tableReducer,
  type TableState,
} from "@/reducers/tableReducer";
import { useReducer } from "react";

export function useTableControls() {
  const [state, dispatch] = useReducer(tableReducer, initialTableState);

  const setTotal = (total: number) => dispatch({ type: "SET_TOTAL", total });
  const setSearch = (search: string) =>
    dispatch({ type: "SET_SEARCH", search });
  const setSortBy = (sortBy: string) => dispatch({ type: "SET_SORT", sortBy });
  const setPage = (page: number) => dispatch({ type: "SET_PAGE", page });
  const setPageSize = (pageSize: number) =>
    dispatch({ type: "SET_PAGE_SIZE", pageSize });
  const setFilters = (filters: TableState["filters"]) =>
    dispatch({ type: "SET_FILTERS", filters });
  const reset = () => dispatch({ type: "RESET" });

  return {
    state,
    setTotal,
    setSearch,
    setSortBy,
    setPage,
    setPageSize,
    setFilters,
    reset,
  };
}
