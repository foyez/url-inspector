import { fetchURLDetails } from "@/api/urls";
import type { URLDetails } from "@/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function URLDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<URLDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const data = await fetchURLDetails(Number(id));
        setDetails(data);
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : "Failed to load details";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 text-gray-600" aria-live="polite">
        Loading...
      </div>
    );
  }
  if (!details) {
    return (
      <div className="p-6 text-gray-400 italic" role="alert">
        No data found for this URL.
      </div>
    );
  }

  const chartData = [
    { type: "Internal", count: details.internal_links },
    { type: "External", count: details.external_links },
  ];

  return (
    <div
      className="max-w-5xl mx-auto p-6 space-y-8"
      aria-labelledby="page-title"
    >
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold break-words">
          Details: {details.title || "(untitled)"}
        </h1>
        <Link
          to="/"
          className="text-blue-600 underline text-sm hover:text-blue-800"
        >
          ← Back to Dashboard
        </Link>
      </header>

      <section
        className="grid md:grid-cols-2 gap-6 text-sm"
        aria-labelledby="meta-heading"
      >
        <div className="space-y-2">
          <p>
            <strong>HTML Version:</strong> {details.html_version}
          </p>
          <p>
            <strong>Has Login Form:</strong>{" "}
            {details.has_login_form ? "Yes" : "No"}
          </p>
        </div>

        <div className="h-64">
          <h2 className="text-base font-semibold mb-2">
            Link Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4ade80" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section aria-labelledby="broken-links-heading">
        <h2 className="text-base font-semibold mb-2">Broken Links</h2>

        {details.broken_links.length > 0 ? (
          <div className="overflow-x-auto border rounded shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2">URL</th>
                  <th className="px-4 py-2">Status Code</th>
                </tr>
              </thead>
              <tbody>
                {details.broken_links.map((link, idx) => (
                  <tr
                    key={idx}
                    className="border-t hover:bg-amber-50 transition-colors"
                  >
                    <td className="px-4 py-2 break-all text-blue-600 underline">
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.link}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-red-600 font-medium">
                      {link.status_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No broken links 🎉</p>
        )}
      </section>
    </div>
  );
}

export default URLDetailsPage;
