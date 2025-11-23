"use client";

import Hero from "@/components/hero";
import JobsList from "@/components/JobsList";
import { useJobs } from "@/hooks/useJobs";
import { usePaidJobs } from "@/hooks/usePaidJobs";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/Search-bar";
import LogoRow from "@/components/logo-stripes";

export default function Home() {
  const router = useRouter();
  const { jobs, loading } = useJobs();
  const { jobs: paidJobs, loading: loadingPaid } = usePaidJobs();

  const publicJobs = jobs.filter(
    (job) => !job.categories?.includes("paidjobs")
  );

  return (
    <>
      <SearchBar />

      <Hero />
      <LogoRow />

      {/* PUBLIC JOBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <h2 className="text-2xl font-bold mb-6">Latest Job Listings</h2>
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-10">
          <JobsList jobs={publicJobs} />
          {/* RIGHT – Sidebar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
            <p className="text-gray-700 leading-relaxed mb-6">
              Work with the most talented and accomplished developers on a
              freelance, contract, part-time, or full-time basis.
            </p>

            <a
              href="mailto:anilkumar50833@gmail.com"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full transition">
              <span className="mr-2 text-xl">＋</span>
              Post a job
            </a>
          </div>
        </div>
      </section>

      {/* PAID JOBS */}
      {/* PAID JOBS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-20">
        <h2 className="text-2xl font-bold mb-6">Premium Jobs</h2>

        {loadingPaid ? (
          <p>Loading premium jobs...</p>
        ) : paidJobs.length === 0 ? (
          <p>No premium jobs available right now.</p>
        ) : (
          <div className="relative">
            {/* The blurred premium job list */}
            <div className="opacity-30 blur-sm pointer-events-none select-none">
              <JobsList jobs={paidJobs} />
            </div>

            {/* Overlay CTA */}
            <div className="absolute inset-0 flex justify-center items-center">
              <button
                onClick={() => router.push("/pricing")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-xl hover:bg-yellow-400">
                Unlock Premium Jobs 🔒
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
