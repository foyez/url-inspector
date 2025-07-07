import type { Status } from "@/types";

type StatusBadgeProps = {
  status: Status;
};

const statusColorMap: Record<Status, string> = {
  queued: "bg-yellow-500",
  running: "bg-blue-500",
  done: "bg-green-500",
  error: "bg-red-500",
};

function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColorMap[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-white text-xs ${color}`}
    >
      {status}
      {status === "running" && (
        <svg
          className="w-3 h-3 animate-spin text-blue-800"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      )}
    </span>
  );
}

export default StatusBadge;
