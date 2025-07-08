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

function DashboardPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);
  const {
    state: table,
    setTotal,
    setSearch,
    setSortBy,
    setPage,
    setFilters,
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
        filters: table.filters,
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
  }, [table.search, table.sortBy, table.sortDir, table.page, table.filters]);

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
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">URL Dashboard</h1>

      <URLForm onSubmit={handleSubmit} />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Search by title"
          className="border px-3 py-2 rounded-md w-full max-w-md"
          onChange={handleSearch}
        />

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <select
            onChange={(e) =>
              setFilters({
                ...table.filters,
                status: e.target.value || undefined,
              })
            }
            className="border border-gray-300 px-4 py-2 rounded-md  focus:outline-none focus:ring focus:ring-blue-200"
            value={table.filters.status || ""}
          >
            <option value="">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="done">Done</option>
            <option value="error">Error</option>
          </select>

          <select
            onChange={(e) =>
              setFilters({
                ...table.filters,
                html_version: e.target.value || undefined,
              })
            }
            className="border border-gray-300 px-4 py-2 rounded-md  focus:outline-none focus:ring focus:ring-blue-200"
            value={table.filters.html_version || ""}
          >
            <option value="">All HTML Versions</option>
            <option value="HTML5">HTML5</option>
            <option value="HTML4">HTML4</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>

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

export default DashboardPage;
