import Button from "@/atoms/Button";
import { useState, type FormEvent } from "react";

type Props = {
  onAdd: (url: string) => void;
  onSearch: (value: string) => void;
  filters: { status?: string; html_version?: string };
  onFilterChange: (filters: { status?: string; html_version?: string }) => void;
};

function URLControls({ onAdd, onSearch, filters, onFilterChange }: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setUrl("");
  };

  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  return (
    <div className="space-y-4">
      <form
        role="form"
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center"
      >
        <label htmlFor="url-input" className="sr-only">
          Website URL
        </label>
        <input
          id="url-input"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          aria-label="Enter website URL"
          className="border border-gray-300 px-4 py-2 rounded-md w-full sm:max-w-md focus:outline-none focus:ring focus:ring-blue-200"
        />
        {/* <button
          type="submit"
          className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add URL
        </button> */}
        <Button type="submit">Add URL</Button>
      </form>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by title"
          className="border px-4 py-2 rounded-md w-full md:max-w-xs focus:outline-none focus:ring focus:ring-blue-200"
          aria-label="Search by title"
        />

        <div className="flex gap-4 flex-wrap">
          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option value="queued">Queued</option>
            <option value="running">Running</option>
            <option value="done">Done</option>
            <option value="error">Error</option>
          </select>

          <select
            value={filters.html_version || ""}
            onChange={(e) => handleFilterChange("html_version", e.target.value)}
            className="border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            aria-label="Filter by HTML version"
          >
            <option value="">All HTML Versions</option>
            <option value="HTML5">HTML5</option>
            <option value="HTML4">HTML4</option>
            <option value="Unknown">Unknown</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default URLControls;
