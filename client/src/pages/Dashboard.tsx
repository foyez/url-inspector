import { createURL, deleteURLs, fetchURLs, rerunURLs } from "@/api/urls";
import URLForm from "@/components/URLForm";
import URLTable from "@/components/URLTable";
import { UseCrawlPolling } from "@/hooks/useCrawlPolling";
import {
  dashboardReducer,
  initialDashboardState,
} from "@/reducers/dashboardReducer";
import type { URLData } from "@/types";
import { useEffect, useReducer } from "react";
import toast from "react-hot-toast";

function Dashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const loadData = async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const urls = await fetchURLs();
      dispatch({ type: "SET_URLS", urls });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load URLs";
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  UseCrawlPolling({
    urls: state.urls,
    update: (urls) => dispatch({ type: "SET_URLS", urls }),
  });

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
      />
    </div>
  );
}

export default Dashboard;
