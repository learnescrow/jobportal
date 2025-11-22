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

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJobs() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
        const url = baseUrl
          ? `${baseUrl}/wp-json/ukjobs/v1/jobs`
          : "https://lightpink-gull-213019.hostingersite.com/wp-json/ukjobs/v1/jobs";

        console.log("🔍 Fetching Jobs:", url);

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`API Error: ${res.status}`);

        const data: Job[] = await res.json();
        console.log("📦 FULL JOBS DATA:", data);

        if (!Array.isArray(data)) throw new Error("Invalid API response");

        // 👇 Remove paid jobs here
        const publicJobs = data.filter(
          (job) =>
            !job.categories?.some((cat) => cat.toLowerCase() === "paidjob")
        );

        console.log(`🚀 Public Jobs: ${publicJobs.length}`);
        setJobs(publicJobs);
        setError(null);
      } catch (err) {
        console.error("❌ Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  return { jobs, loading, error };
}
