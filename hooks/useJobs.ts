"use client";

import { useEffect, useState } from "react";
export interface Job {
  id: number;
  slug: string;
  title: string;
  meta: {
    company: string;
    location: string;
    salary: string;
    type: string;
    experience: string;
    closing_date: string;
    apply_link: string;
  };
  description: string;
}

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/all");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error("Jobs API error:", err);
      }
      setLoading(false);
    }

    loadJobs();
  }, []);

  return { jobs, loading };
}

export function useJobDetail(slug: string | null) {
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function loadJob() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/job/${slug}`
        );

        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Job detail API error:", err);
      }
    }

    loadJob();
  }, [slug]);

  return job;
}
