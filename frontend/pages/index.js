import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/* ---------- UI STYLES ---------- */
const statusStyles = {
  pending: "bg-yellow-600/20 text-yellow-400",
  running: "bg-blue-600/20 text-blue-400",
  completed: "bg-green-600/20 text-green-400",
};

const priorityStyles = {
  Low: "bg-gray-600/20 text-gray-300",
  Medium: "bg-orange-600/20 text-orange-400",
  High: "bg-red-600/20 text-red-400",
};

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("Low");

  /* ---------- API CALLS ---------- */
  const fetchJobs = async () => {
    const res = await fetch(`${API}/jobs`);
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const createJob = async () => {
    if (!taskName.trim()) {
      alert("Task name is required");
      return;
    }

    await fetch(`${API}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskName,
        priority,
        payload: {}
      })
    });

    setTaskName("");
    fetchJobs();
  };

  const runJob = async (id) => {
    await fetch(`${API}/run-job/${id}`, { method: "POST" });
    fetchJobs();
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">
          Dotix – Job Scheduler
        </h1>
        <p className="text-zinc-400 mb-8">
          Create, run and track background jobs
        </p>

        {/* Create Job */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create Job</h2>

          <div className="flex flex-wrap gap-4">
            <input
              className="w-64"
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button
              onClick={createJob}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded"
            >
              + Create Job
            </button>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-800 text-zinc-300">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Task</th>
                <th className="p-3 text-left">Priority</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-zinc-500">
                    No jobs created yet
                  </td>
                </tr>
              )}

              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t border-zinc-800 hover:bg-zinc-800/50"
                >
                  <td className="p-3">{job.id}</td>

                  <td className="p-3 text-blue-400 hover:underline">
                    <Link href={`/jobs/${job.id}`}>
                      {job.taskName}
                    </Link>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${priorityStyles[job.priority]}`}>
                      {job.priority}
                    </span>
                  </td>

                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${statusStyles[job.status]}`}>
                      {job.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    {job.status === "pending" && (
                      <button
                        onClick={() => runJob(job.id)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-1 rounded"
                      >
                        Run
                      </button>
                    )}

                    {job.status === "running" && (
                      <span className="text-blue-400 animate-pulse">
                        Running...
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
