import debounce from "lodash.debounce";
import { useEffect } from "react";

import URLTable from "@/components/URLTable";
import { useCrawlPolling } from "@/hooks/useCrawlPolling";
import { useDashboard } from "@/hooks/useDashboard";
import { useTableControls } from "@/hooks/useTableControls";
import URLControls from "@/components/URLControls";

function DashboardPage() {
  const {
    state,
    dispatch,
    loadData,
    handleSubmit,
    handleDelete,
    handleRerun,
    updateURLs,
  } = useDashboard();
  const {
    state: table,
    setTotal,
    setSearch,
    setSortBy,
    setPage,
    setFilters,
  } = useTableControls();

  const fetchAll = () => {
    loadData(
      {
        search: table.search,
        sortBy: table.sortBy,
        sortDir: table.sortDir,
        page: table.page,
        pageSize: table.pageSize,
        filters: table.filters,
      },
      setTotal
    );
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.search, table.sortBy, table.sortDir, table.page, table.filters]);

  useCrawlPolling({
    urls: state.urls,
    reload: fetchAll,
  });

  const debouncedSearch = debounce((value: string) => {
    setSearch(value);
  }, import.meta.env.VITE_DEBOUNCED_SEARCH_TIME);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">URL Dashboard</h1>

      <URLControls
        onAdd={(url) => handleSubmit(url, fetchAll)}
        onSearch={debouncedSearch}
        filters={table.filters}
        onFilterChange={setFilters}
      />

      <URLTable
        urls={state.urls}
        selected={state.selected}
        toggleSelect={(id) => dispatch({ type: "TOGGLE_SELECT", id })}
        selectAll={() => dispatch({ type: "SELECT_ALL" })}
        clearSelection={() => dispatch({ type: "CLEAR_SELECTION" })}
        onDelete={() => handleDelete(fetchAll)}
        onRerun={() => handleRerun(fetchAll)}
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
