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
        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200 w-full sm:max-w-md"
        placeholder="Enter website URL"
        required
        aria-label="Enter website URL"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add
      </button>
    </form>
  );
}

export default URLForm;
