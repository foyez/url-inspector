import type { URLData } from "@/types";

export type DashboardState = {
  urls: URLData[];
  selected: number[];
  loading: boolean;
};

export type DashboardAction =
  | { type: "SET_URLS"; urls: URLData[] }
  | { type: "TOGGLE_SELECT"; id: number }
  | { type: "SELECT_ALL" }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_LOADING"; loading: boolean };

export const initialDashboardState: DashboardState = {
  urls: [],
  selected: [],
  loading: false,
};

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction
): DashboardState {
  switch (action.type) {
    case "SET_URLS":
      return { ...state, urls: action.urls };
    case "TOGGLE_SELECT": {
      const selected = state.selected.includes(action.id)
        ? state.selected.filter((id) => id !== action.id)
        : [...state.selected, action.id];
      return { ...state, selected };
    }
    case "SELECT_ALL":
      return { ...state, selected: state.urls.map((u) => u.id) };
    case "CLEAR_SELECTION":
      return { ...state, selected: [] };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}
