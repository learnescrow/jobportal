//File :- /hooks/usePaidjobs.ts

"use client";

import { useEffect, useState } from "react";
import type { Job } from "./useJobs";

export function usePaidJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const PAID_TAG = "paidjob"; // 👈 CORRECT VALUE FROM API

  useEffect(() => {
    async function loadPaidJobs() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
        const url = baseUrl
          ? `${baseUrl}/wp-json/ukjobs/v1/jobs`
          : "https://lightpink-gull-213019.hostingersite.com/wp-json/ukjobs/v1/jobs";

        

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const allJobs: Job[] = await res.json();

        

        const filtered = allJobs.filter((job) =>
          job.categories?.some(
            (cat) => cat.toLowerCase() === PAID_TAG.toLowerCase()
          )
        );

      
        setJobs(filtered);
      } catch (err) {
        console.error("❌ Paid Jobs Fetch Error:", err);
        setJobs([]);
      }

      setLoading(false);
    }

    loadPaidJobs();
  }, []);

  return { loading, jobs };
}
