import { createURL, deleteURLs, fetchURLs, rerunURLs } from "@/api/urls";
import {
  dashboardReducer,
  initialDashboardState,
} from "@/reducers/dashboardReducer";
import type { URLData } from "@/types";
import type { ListURLsOptions } from "@/types/api";
import { useReducer } from "react";
import toast from "react-hot-toast";

export function useDashboard() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const loadData = async (
    options: ListURLsOptions,
    setTotal: (t: number) => void
  ) => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const { urls, total } = await fetchURLs(options);
      dispatch({ type: "SET_URLS", urls });
      setTotal(total);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load URLs";
      toast.error(msg);
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  const handleSubmit = async (url: string, reload: () => void) => {
    try {
      await createURL(url);
      toast.success("URL added successfully");
      reload();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add URL";
      toast.error(msg);
    }
  };

  const handleDelete = async (reload: () => void) => {
    try {
      await deleteURLs(state.selected);
      toast.success("URLs deleted");
      reload();
      dispatch({ type: "CLEAR_SELECTION" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
    }
  };

  const handleRerun = async (reload: () => void) => {
    try {
      await rerunURLs(state.selected);
      toast.success("Crawling restarted");
      reload();
      dispatch({ type: "CLEAR_SELECTION" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to rerun";
      toast.error(msg);
    }
  };

  const updateURLs = (modifier: (prev: URLData[]) => URLData[]) => {
    dispatch({ type: "SET_URLS", urls: modifier(state.urls) });
  };

  return {
    state,
    dispatch,
    loadData,
    handleSubmit,
    handleDelete,
    handleRerun,
    updateURLs,
  };
}
