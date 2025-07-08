import URLTable from "@/components/URLTable";
import type { URLData } from "@/types";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const sampleUrl = (overrides = {}): URLData => ({
  id: 1,
  title: "Test Site",
  html_version: "HTML5",
  has_login_form: true,
  internal_links: 10,
  external_links: 5,
  broken_links: 2,
  status: "queued",
  created_at: "",
  ...overrides,
});

describe("URLTable Component", () => {
  const baseProps = {
    toggleSelect: vi.fn(),
    selectAll: vi.fn(),
    clearSelection: vi.fn(),
    onDelete: vi.fn(),
    onRerun: vi.fn(),
    updateURLs: vi.fn(),
    sortBy: "title",
    setSortBy: vi.fn(),
    // sortDir: "asc",
    page: 1,
    setPage: vi.fn(),
    total: 1,
  };

  it("renders no data message when empty", () => {
    render(
      <URLTable
        {...baseProps}
        urls={[]}
        selected={[]}
        loading={false}
        sortDir="asc"
      />
    );
    expect(screen.getByText(/No URLs found/i)).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <URLTable
        {...baseProps}
        urls={[]}
        selected={[]}
        loading={true}
        sortDir="asc"
      />
    );
    expect(screen.getByText(/Loading URLs/i)).toBeInTheDocument();
  });

  it("renders table with data and correct fields", () => {
    render(
      <MemoryRouter>
        <URLTable
          {...baseProps}
          urls={[sampleUrl()]}
          selected={[]}
          loading={false}
          sortDir="asc"
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/Test Site/i)).toBeInTheDocument();
    expect(screen.getByText("HTML5")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
  });

  it("displays start button for 'queued' status", () => {
    render(
      <MemoryRouter>
        <URLTable
          {...baseProps}
          urls={[sampleUrl({ status: "queued" })]}
          selected={[]}
          loading={false}
          sortDir="asc"
        />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Start/i })).toBeInTheDocument();
  });

  it("does not render start/stop for 'done' status", () => {
    render(
      <MemoryRouter>
        <URLTable
          {...baseProps}
          urls={[sampleUrl({ status: "done" })]}
          selected={[]}
          loading={false}
          sortDir="asc"
        />
      </MemoryRouter>
    );

    expect(
      screen.queryByRole("button", { name: /Start/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Stop/i })
    ).not.toBeInTheDocument();
  });

  it("calls toggleSelect when checkbox is clicked", () => {
    render(
      <MemoryRouter>
        <URLTable
          {...baseProps}
          urls={[sampleUrl()]}
          selected={[]}
          loading={false}
          sortDir="asc"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    expect(baseProps.toggleSelect).toHaveBeenCalled();
  });

  it("renders bulk action buttons if selected", () => {
    render(
      <MemoryRouter>
        <URLTable
          {...baseProps}
          urls={[sampleUrl()]}
          selected={[1]}
          loading={false}
          sortDir="asc"
        />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Rerun/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

  it("renders pagination and disables buttons at edges", () => {
    render(
      <MemoryRouter>
        <URLTable
          {...baseProps}
          urls={[sampleUrl()]}
          selected={[]}
          loading={false}
          page={1}
          total={1}
          sortDir="asc"
        />
      </MemoryRouter>
    );
    expect(screen.getByRole("button", { name: /Prev/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Next/i })).toBeDisabled();
  });
});
