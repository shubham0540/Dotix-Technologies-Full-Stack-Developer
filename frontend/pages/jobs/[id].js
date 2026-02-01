import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const statusStyles = {
  pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  running: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  completed: "bg-green-500/20 text-green-400 border border-green-500/30",
};

const priorityStyles = {
  Low: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  Medium: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  High: "bg-red-500/20 text-red-400 border border-red-500/30",
};

export default function JobDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [job, setJob] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${API}/jobs/${id}`)
        .then((res) => res.json())
        .then(setJob);
    }
  }, [id]);

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-950 p-8 text-zinc-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-8">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-lg">

        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">
          {job.taskName}
        </h1>

        {/* Status + Priority */}
        <div className="flex gap-4 mb-8">
          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${statusStyles[job.status]}`}
          >
            {job.status}
          </span>

          <span
            className={`px-4 py-1 rounded-full text-sm font-medium ${priorityStyles[job.priority]}`}
          >
            {job.priority}
          </span>
        </div>

        {/* Payload */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Payload</h3>
          <pre className="bg-zinc-800 border border-zinc-700 p-4 rounded-lg text-sm overflow-x-auto">
            {JSON.stringify(
              typeof job.payload === "string"
                ? JSON.parse(job.payload)
                : job.payload,
              null,
              2
            )}
          </pre>
        </div>

      </div>
    </div>
  );
}
