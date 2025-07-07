import { useEffect, useReducer, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import debounce from "lodash.debounce";

import { createURL, deleteURLs, fetchURLs, rerunURLs } from "@/api/urls";
import URLForm from "@/components/URLForm";
import URLTable from "@/components/URLTable";
import { UseCrawlPolling } from "@/hooks/useCrawlPolling";
import { useTableControls } from "@/hooks/useTableControls";
import {
  dashboardReducer,
  initialDashboardState,
} from "@/reducers/dashboardReducer";
import type { URLData } from "@/types";

function Dashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const {
    state: table,
    setTotal,
    setSearch,
    setSortBy,
    setPage,
  } = useTableControls();

  const loadData = async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const { urls, total } = await fetchURLs({
        search: table.search,
        sortBy: table.sortBy,
        sortDir: table.sortDir,
        page: table.page,
        pageSize: table.pageSize,
      });
      dispatch({ type: "SET_URLS", urls });
      setTotal(total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load URLs";
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.search, table.sortBy, table.sortDir, table.page]);

  UseCrawlPolling({
    urls: state.urls,
    table,
    update: (urls) => dispatch({ type: "SET_URLS", urls }),
  });

  const debouncedSearch = debounce((value: string) => {
    setSearch(value);
  }, import.meta.env.VITE_DEBOUNCED_SEARCH_TIME);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleSubmit = async (url: string) => {
    try {
      await createURL(url);
      toast.success("URL added successfully");
      loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add URL";
      toast.error(msg);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteURLs(state.selected);
      toast.success("URLs deleted");
      loadData();
      dispatch({ type: "CLEAR_SELECTION" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    }
  };

  const handleRerun = async () => {
    try {
      await rerunURLs(state.selected);
      toast.success("Crawling restarted");
      loadData();
      dispatch({ type: "CLEAR_SELECTION" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rerun";
      toast.error(msg);
    }
  };

  const updateURLs = (modifier: (prev: URLData[]) => URLData[]) => {
    dispatch({ type: "SET_URLS", urls: modifier(state.urls) });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">URL Dashboard</h1>
      <URLForm onSubmit={handleSubmit} />
      <input
        type="text"
        placeholder="Search URLs"
        className="border px-3 py-2 rounded-md w-full max-w-md"
        onChange={handleSearch}
      />
      <URLTable
        urls={state.urls}
        selected={state.selected}
        toggleSelect={(id) => dispatch({ type: "TOGGLE_SELECT", id })}
        selectAll={() => dispatch({ type: "SELECT_ALL" })}
        clearSelection={() => dispatch({ type: "CLEAR_SELECTION" })}
        onDelete={handleDelete}
        onRerun={handleRerun}
        loading={state.loading}
        updateURLs={updateURLs}
        sortBy={table.sortBy}
        setSortBy={setSortBy}
        sortDir={table.sortDir}
        page={table.page}
        setPage={setPage}
        total={table.total}
      />
    </div>
  );
}

export default Dashboard;
