import { useState, type FormEvent } from "react";

type URLFormProps = {
  onSubmit: (url: string) => void;
};

function URLForm({ onSubmit }: URLFormProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      return;
    }
    onSubmit(url);
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border px-4 py-2 w-full rounded"
        placeholder="Enter website url"
      />
      <button
        type="submit"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add
      </button>
    </form>
  );
}

export default URLForm;
