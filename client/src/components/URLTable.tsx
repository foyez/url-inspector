import type { SortDir, URLData } from "@/types";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { startCrawl, stopCrawl } from "@/api/urls";
import toast from "react-hot-toast";

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
    <div className="border rounded overflow-x-auto">
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  e.target.checked ? selectAll() : clearSelection()
                }
                checked={allSelected}
              />
            </th>
            <th
              className="cursor-pointer p-2 text-left"
              onClick={() => setSortBy("title")}
            >
              Title {sortBy === "title" && (sortDir === "asc" ? " ▲" : " ▼")}
            </th>
            <th
              className="cursor-pointer p-2"
              onClick={() => setSortBy("html_version")}
            >
              HTML Version{" "}
              {sortBy === "html_version" && (sortDir === "asc" ? " ▲" : " ▼")}
            </th>
            <th className="p-2">Login</th>
            <th
              className="cursor-pointer p-2"
              onClick={() => setSortBy("internal_links")}
            >
              Internal{" "}
              {sortBy === "internal_links" && (sortDir === "asc" ? " ▲" : " ▼")}
            </th>
            <th
              className="cursor-pointer p-2"
              onClick={() => setSortBy("external_links")}
            >
              External{" "}
              {sortBy === "external_links" && (sortDir === "asc" ? " ▲" : " ▼")}
            </th>
            <th
              className="cursor-pointer p-2"
              onClick={() => setSortBy("broken_links")}
            >
              Broken{" "}
              {sortBy === "broken_links" && (sortDir === "asc" ? " ▲" : " ▼")}
            </th>
            <th
              className="cursor-pointer p-2"
              onClick={() => setSortBy("status")}
            >
              Status {sortBy === "status" && (sortDir === "asc" ? " ▲" : " ▼")}
            </th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id} className="border-t hover:bg-amber-50">
              <td className="p-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(url.id)}
                  onChange={() => toggleSelect(url.id)}
                />
              </td>
              <td className="p-2 text-left text-blue-600 underline">
                <Link to={`/details/${url.id}`}>
                  {url.title || "(untitled)"}
                </Link>
              </td>
              <td className="p-2 text-center">{url.html_version}</td>
              <td className="p-2 text-center">
                {url.has_login_form ? "Yes" : "No"}
              </td>
              <td className="p-2 text-center">{url.internal_links}</td>
              <td className="p-2 text-center">{url.external_links}</td>
              <td className="p-2 text-center">{url.broken_links}</td>
              <td className="p-2 text-center">
                <StatusBadge status={url.status} />
              </td>
              <td className="p-2 text-center space-x-1">
                {url.status === "queued" || url.status === "error" ? (
                  <button
                    onClick={() => handleStart(url.id)}
                    className="cursor-pointer text-blue-600 underline text-xs"
                  >
                    Start
                  </button>
                ) : url.status === "running" ? (
                  <button
                    onClick={() => handleStop(url.id)}
                    className="cursor-pointer text-red-600 underline text-xs"
                  >
                    Stop
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected.length > 0 && (
        <div className="flex justify-end p-2 gap-2 bg-gray-50 border-t">
          <button
            onClick={onRerun}
            className="cursor-pointer px-4 py-1 bg-yellow-500 text-white rounded"
          >
            Rerun
          </button>
          <button
            onClick={onDelete}
            className="cursor-pointer px-4 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        </div>
      )}

      <div className="flex justify-between items-center px-4 py-2 text-sm bg-gray-50 border-t">
        <div>
          Showing {urls.length} of {total} result{urls.length !== 1 && "s"}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-2 self-center">Page {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * import.meta.env.VITE_PAGE_SIZE >= total}
            className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default URLTable;
