type BulkActionsProps = {
  onRerun: () => void;
  onDelete: () => void;
};

function BulkActions({ onRerun, onDelete }: BulkActionsProps) {
  return (
    <div
      className="flex justify-end items-center gap-3 p-3 bg-gray-50 border-t"
      aria-label="Bulk actions"
    >
      <button
        onClick={onRerun}
        className="cursor-pointer px-4 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
        aria-label="Rerun crawl on selected URLs"
      >
        Rerun
      </button>
      <button
        onClick={onDelete}
        className="cursor-pointer px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        aria-label="Delete selected URLs"
      >
        Delete
      </button>
    </div>
  );
}

export default BulkActions;
