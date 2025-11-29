"use client";

import { useEffect, useState } from "react";

export interface Job {
  id: number;
  slug: string;
  title: string;
  description: string;
  image?: string;
  categories: string[];
  meta: {
    company: string;
    location: string;
    salary: string;
    type: string;
    experience: string;
    closing_date: string;
    apply_link: string;
  };
  date: string;
}

export function useSearchJobs(query: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    const url = baseUrl
      ? `${baseUrl}/wp-json/ukjobs/v1/jobs`
      : "https://lightpink-gull-213019.hostingersite.com/wp-json/ukjobs/v1/jobs";

    // If empty → skip API call and clear results
    if (!query || query.trim() === "") {
      setJobs([]);
      return;
    }

    setLoading(true);
    setError(null);

    // ⏳ Debounce: avoid hammering API on fast typing
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${url}?search=${encodeURIComponent(query)}`, {
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data: Job[] = await res.json();

        setJobs(
          data.filter(
            (job) =>
              !job.categories?.some((cat) => cat.toLowerCase() === "paidjob")
          )
        );
      } catch (err) {
        console.error("❌ Search jobs failed:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce window (UX sweet spot)

    return () => clearTimeout(timeout);
  }, [query]);

  return { jobs, loading, error };
}
