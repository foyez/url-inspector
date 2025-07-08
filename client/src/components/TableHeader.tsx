import type { SortDir } from "@/types";

type TableHeaderProps = {
  label: string;
  sortKey: string;
  curSortKey: string;
  sortDir: SortDir;
  onSort: (key: string) => void;
  align?: "left" | "center" | "right";
};

function TableHeader({
  label,
  sortKey,
  curSortKey,
  sortDir,
  onSort,
  align = "center",
}: TableHeaderProps) {
  const isActive = curSortKey == sortKey;
  const direction = isActive ? (sortDir === "asc" ? "▲" : "▼") : "";

  return (
    <th
      onClick={() => onSort(sortKey)}
      className={`p-3 cursor-pointer text-${align} whitespace-nowrap select-none`}
    >
      {label}
      <span className="inline-block w-3 text-xs text-gray-500">
        {direction || " "}
      </span>
    </th>
  );
}

export default TableHeader;
