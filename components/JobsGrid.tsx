"use client";

import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";

interface Job {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  meta: {
    company: string;
    location: string;
    salary: string;
    type: string;
    closing_date?: string;
  };
}

export default function JobsGrid() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(
          "https://dev.worklance.co.uk/wp-json/ukjobs/v1/all"
        );
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("API Error:", err);
      }
      setLoading(false);
    }
    loadJobs();
  }, []);

  if (loading) return <p className="text-center py-10">Loading jobs...</p>;

  return (
    <div className="max-w-6xl mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Recent jobs</h1>

      {/* GRID LAYOUT: LEFT LIST + RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
        {/* LEFT – JOB LIST */}
        <div className="space-y-5">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={`/dashboard/jobs/${job.slug}`}
              className="flex items-start justify-between bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition duration-200">
              {/* LEFT – Logo + Text */}
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.title}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <Briefcase size={20} className="text-gray-500" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {job.meta.company} • {job.meta.type}
                  </p>

                  <h2 className="text-lg font-semibold mt-1 leading-snug">
                    {job.title}
                  </h2>
                </div>
              </div>

              {/* RIGHT – Badges */}
              <div className="flex flex-col items-end gap-2 whitespace-nowrap">
                {job.meta.closing_date && (
                  <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                    {job.meta.closing_date}
                  </span>
                )}

                <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  {job.meta.location}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* RIGHT – SIDEBAR */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit shadow-sm">
          <p className="text-gray-700 leading-relaxed mb-6">
            Work with the most talented and accomplished developers on a
            freelance, contract, part-time, or full-time basis.
          </p>

          <a
            href="/post-job"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-medium transition">
            <span className="mr-2 text-xl">＋</span>
            Post a job
          </a>
        </div>
      </div>
    </div>
  );
}
