import {
  dashboardReducer,
  initialDashboardState,
} from "@/reducers/dashboardReducer";
import type { URLData } from "@/types";

const URLS: URLData[] = [
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
];

describe("dashboardReducer", () => {
  it("should set loading", () => {
    const nextState = dashboardReducer(initialDashboardState, {
      type: "SET_LOADING",
      loading: true,
    });
    expect(nextState.loading).toBe(true);
  });

  it("should set URLs", () => {
    const nextState = dashboardReducer(initialDashboardState, {
      type: "SET_URLS",
      urls: URLS,
    });
    expect(nextState.urls).toEqual(URLS);
  });

  it("should toggle selection", () => {
    const state = { ...initialDashboardState, selected: [1] };
    const nextState = dashboardReducer(state, { type: "TOGGLE_SELECT", id: 1 });
    expect(nextState.selected).toEqual([]);
  });

  it("should select all", () => {
    const state = {
      ...initialDashboardState,
      urls: URLS,
    };
    const nextState = dashboardReducer(state, { type: "SELECT_ALL" });
    expect(nextState.selected).toEqual([1, 2]);
  });

  it("should clear selection", () => {
    const state = { ...initialDashboardState, selected: [1, 2] };
    const nextState = dashboardReducer(state, { type: "CLEAR_SELECTION" });
    expect(nextState.selected).toEqual([]);
  });
});
