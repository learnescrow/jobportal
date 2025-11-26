"use client";
import { useState } from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import { useSearchJobs } from "@/hooks/useSearchJobs";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const { jobs, loading } = useSearchJobs(query);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const filters = [
    "Internships",
    "Part-time",
    "Full-time",
    "Remote",
    "Freshers",
    "local jobs",
  ];
  //bg-[#5D2BFF]

  const navigateJobUrl = (slug: string) =>
    isSignedIn ? `/dashboard/jobs/${slug}` : `/jobs/${slug}`;

  return (
    <section className="relative w-full h-[100vh] bg-white flex justify-center px-4 bg-gradient-to-b from-white to-[#5D2BFF]/10">
      <div className="w-full max-w-3xl mt-40 md:mt-56">
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold  text-center leading-tight mb-6">
          The #1 Platform for
          <br /> all Opportunities
        </h1>

        {/* Search Bar */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-[#5D2BFF]/20 shadow-lg p-2 rounded-full">
          <input
            type="text"
            placeholder="Search for jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="
              w-full bg-white text-gray-800 
              placeholder-gray-500 
              rounded-full py-4 pr-20 pl-6
              focus:outline-none
            "
          />

          <button
            className="
              absolute right-3 top-1/2 -translate-y-1/2
              bg-[#5D2BFF] text-white
              rounded-full px-6 py-3
              flex items-center gap-2 font-semibold
              shadow-md hover:bg-blue-700 transition-all
            ">
            Find jobs
            <ArrowRight size={18} />
          </button>

          {/* Floating Search Results */}
          {query.trim() !== "" && (
            <div
              className="
                absolute mt-20 w-full 
                rounded-[36px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg 
                max-h-80 overflow-y-auto z-[1000]
                p-2 
              ">
              <div className="w-full z-50  h-auto rounded-[28px]">
                {loading && (
                  <p className="text-center text-white text-gray-500 py-3">
                    Searching…
                  </p>
                )}

                {!loading && jobs.length === 0 && (
                  <p className="text-center text-white text-gray-500 py-3">
                    No results found
                  </p>
                )}

                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={navigateJobUrl(job.slug)}
                    className="
                    flex items-center gap-3 
                    p-3 
                    bg-gray-100 rounded-full transition
                  ">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Briefcase size={18} className="text-gray-500" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {job.title}
                      </span>
                      <span className="text-xs text-gray-500">
                        {job.meta.company} • {job.meta.location}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3 mt-5 overflow-x-auto scrollbar-hide pb-3">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => router.push("/jobs")}
              className="
                 text-sm bg-[#5D2BFF]/10 border border-[#5D2BFF]/30 whitespace-nowrap
                backdrop-blur-md px-4 py-2 rounded-full
                hover:bg-white/30 hover:underline transition-all
              ">
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
