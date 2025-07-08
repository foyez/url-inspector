type Props = {
  status: string;
  onStart: () => void;
  onStop: () => void;
};

function RowActions({ status, onStart, onStop }: Props) {
  return (
    <div className="flex justify-center gap-2">
      {status === "queued" || status === "error" ? (
        <button
          onClick={onStart}
          className="cursor-pointer text-blue-600 underline text-xs focus:outline-none focus:ring focus:ring-blue-300 rounded"
          aria-label="Start crawling"
        >
          Start
        </button>
      ) : status === "running" ? (
        <button
          onClick={onStop}
          className="cursor-pointer text-red-600 underline text-xs focus:outline-none focus:ring focus:ring-red-300 rounded"
          aria-label="Stop crawling"
        >
          Stop
        </button>
      ) : null}
    </div>
  );
}

export default RowActions;
