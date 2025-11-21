"use client";

import { useState, useMemo } from "react";
import { useJobs } from "@/hooks/useJobs";

import JobFilters from "@/components/JobFilters";
import JobsList from "@/components/JobsList";

export default function PublicJobsPage() {
  const { jobs, loading } = useJobs();
  const [filterType, setFilterType] = useState("");

  // 🔥 Collect unique job types (ALWAYS before any return!)
  const jobTypes = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];
    const types = jobs.map((j: any) => j.meta.type).filter(Boolean);
    return Array.from(new Set(types)); // unique values
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    if (!filterType) return jobs;
    return jobs.filter((j: any) => j.meta.type === filterType);
  }, [jobs, filterType]);

  // ❌ Don't put hooks below this line
  if (loading) return <p className="p-10">Loading jobs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Find your dream job</h1>

      {/* FILTERS */}
      <JobFilters
        types={jobTypes}
        activeType={filterType}
        onTypeChange={setFilterType}
      />
      <h2 className="text-2xl font-bold mb-6">All jobs</h2>
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
        {/* LEFT – Jobs */}
        <div>
          <JobsList jobs={filteredJobs} />
        </div>

        {/* RIGHT – Sidebar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <p className="text-gray-700 leading-relaxed mb-6">
            Work with the most talented and accomplished developers on a
            freelance, contract, part-time, or full-time basis.
          </p>

          <a
            href="/post-job"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full transition">
            <span className="mr-2 text-xl">＋</span>
            Post a job
          </a>
        </div>
      </div>
    </div>
  );
}
