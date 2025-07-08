type PaginationProps = {
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  total: number;
};

function Pagination({ page, setPage, pageSize, total }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div
      className="flex flex-col sm:flex-row justify-between items-center px-4 py-2 text-sm bg-gray-50 border-t gap-2"
      aria-label="Pagination controls"
    >
      <div>
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}{" "}
        of {total} result{total !== 1 && "s"}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setPage(page - 1)}
          disabled={isFirst}
          className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50"
          aria-label="Previous page"
        >
          Prev
        </button>
        <span className="px-2 self-center">
          Page {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={isLast}
          className="cursor-pointer px-3 py-1 border rounded disabled:opacity-50"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
