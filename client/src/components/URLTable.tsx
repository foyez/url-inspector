import type { SortDir, URLData } from "@/types";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { startCrawl, stopCrawl } from "@/api/urls";
import toast from "react-hot-toast";
import TableHeader from "./TableHeader";
import RowActions from "./RowActions";
import BulkActions from "./BulkActions";
import Pagination from "./Pagination";

type URLTableProps = {
  urls: URLData[];
  selected: number[];
  toggleSelect: (ids: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
  onDelete: () => void;
  onRerun: () => void;
  loading: boolean;
  updateURLs: (modifier: (prev: URLData[]) => URLData[]) => void;
  sortBy: string;
  sortDir: SortDir;
  setSortBy: (col: string) => void;
  page: number;
  setPage: (page: number) => void;
  total: number;
};

function URLTable({
  urls,
  selected,
  toggleSelect,
  selectAll,
  clearSelection,
  onDelete,
  onRerun,
  loading,
  updateURLs,
  sortBy,
  sortDir,
  setSortBy,
  page,
  setPage,
  total,
}: URLTableProps) {
  const allSelected = urls.length > 0 && selected.length === urls.length;

  const envPageSize = Number(import.meta.env.VITE_PAGE_SIZE);
  const safePageSize =
    Number.isFinite(envPageSize) && envPageSize > 0 ? envPageSize : 10;

  const handleStart = async (id: number) => {
    try {
      const res = await startCrawl(id);
      toast.success("Crawl started");

      updateURLs((prev) => {
        return prev.map((url) =>
          url.id === id ? { ...url, status: res.status } : url
        );
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to start crawling";
      toast.error(msg);
    }
  };

  const handleStop = async (id: number) => {
    try {
      const res = await stopCrawl(id);
      toast.success("Crawl stopped");

      updateURLs((prev) => {
        return prev.map((url) =>
          url.id === id ? { ...url, status: res.status } : url
        );
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to stop crawling";
      toast.error(msg);
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading URLs...</div>;
  }

  if (!urls.length) {
    return (
      <div className="p-4 text-gray-400 italic">
        No URLs found. Add one above.
      </div>
    );
  }

  return (
    <div className="border rounded overflow-hidden shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-sm min-w-[800px]">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr className="border-b">
              <th className="p-3 text-center">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    e.target.checked ? selectAll() : clearSelection()
                  }
                  checked={allSelected}
                  className="w-4 h-4"
                />
              </th>
              {[
                { label: "Title", key: "title" },
                { label: "HTML Version", key: "html_version" },
                { label: "Internal", key: "internal_links" },
                { label: "External", key: "external_links" },
                { label: "Broken", key: "broken_links" },
                { label: "Status", key: "status" },
              ].map((col) => (
                <TableHeader
                  key={col.key}
                  label={col.label}
                  sortKey={col.key}
                  curSortKey={sortBy}
                  sortDir={sortDir}
                  onSort={setSortBy}
                />
              ))}
              <th className="p-3 text-center">Login</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {urls.map((url) => (
              <tr
                key={url.id}
                className="border-t hover:bg-amber-50 transition-colors duration-150"
              >
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(url.id)}
                    onChange={() => toggleSelect(url.id)}
                    className="w-4 h-4"
                  />
                </td>
                <td className="p-3 text-blue-600 underline max-w-[200px] truncate text-left">
                  <Link to={`/details/${url.id}`}>
                    {url.title || "(untitled)"}
                  </Link>
                </td>
                <td className="p-3 text-center">{url.html_version}</td>

                <td className="p-3 text-center">{url.internal_links}</td>
                <td className="p-3 text-center">{url.external_links}</td>
                <td className="p-3 text-center">{url.broken_links}</td>
                <td className="p-3 text-center">
                  <StatusBadge status={url.status} />
                </td>
                <td className="p-3 text-center">
                  {url.has_login_form ? "Yes" : "No"}
                </td>
                <td className="p-3 text-center space-x-2">
                  <RowActions
                    status={url.status}
                    onStart={() => handleStart(url.id)}
                    onStop={() => handleStop(url.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected.length > 0 && (
        <BulkActions onDelete={onDelete} onRerun={onRerun} />
      )}

      <Pagination
        page={page}
        setPage={setPage}
        pageSize={safePageSize}
        total={total}
      />
    </div>
  );
}

export default URLTable;
