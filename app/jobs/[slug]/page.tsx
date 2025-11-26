"use client";
import { useEffect, useState } from "react";
import Accordion from "@/components/accordion";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobPageProps {
  params: { slug: string };
}
export default function PublicJobDetailPage({ params }: JobPageProps) {
   const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isPaidJob, setIsPaidJob] = useState(false);

  useEffect(() => {
    async function loadJob() {
      const { slug } = await params;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wp-json/ukjobs/v1/jobs/${slug}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        setJob(null);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setJob(data);

      // ✅ detect paid job here
      const paid = data.categories?.some(
        (cat: string) => cat.toLowerCase() === "paidjob"
      );
      setIsPaidJob(paid);

      setLoading(false);
    }

    loadJob();
  }, [params]);

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!job)
    return <p className="p-10 text-center text-red-500">Job not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mt-10 mb-12">
        {job.title}
      </h1>

      {/* TOP CARD */}
      <div className="bg-white border border-gray-200 rounded-3xl p-10 flex flex-col md:flex-row md:items-center gap-10 shadow-sm">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center text-center flex-1">
          {/* LOGO */}
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            {job.image ? (
              <img
                src={job.image}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <Briefcase size={32} className="text-gray-500" />
            )}
          </div>

          <h3 className="text-lg font-semibold">{job.meta.company}</h3>

          {isPaidJob ? (
            <span  
            onClick={() => router.push("/pricing")}
            className="text-sm text-gray-400 mt-1 py-6 mb-6 cursor-pointer  hover:underline">
              Website link locked 🔒
            </span>
          ) : (
            <a
              href={job.meta.apply_link}
              target="_blank"
              className="text-sm text-blue-600 underline mt-1 mb-6">
              Visit Website
            </a>
          )}

          {isPaidJob ? (
            <button
               onClick={() => router.push("/pricing")}
              className="w-full md:w-auto px-8 py-3 bg-blue-600  text-white
                 rounded-full font-medium cursor-pointer shadow-lg md:shadow-none">
              🔒 Subscribe to apply
            </button>
          ) : (
            <a
              href={job.meta.apply_link}
              target="_blank"
              className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white 
                 rounded-full font-medium hover:bg-blue-700 transition 
                 shadow-lg md:shadow-none text-center">
              Apply for position
            </a>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 md:pl-10">
          {/* Job Type */}
          <div className="mb-6">
            <p className="font-medium text-sm mb-2">Job Type:</p>
            <span className="text-sm bg-gray-100 px-4 py-1 rounded-full">
              {job.meta.type}
            </span>
          </div>

          <hr className="my-6 bg-gray-100" style={{ color: "#f7f7f7" }} />

          {/* Location */}
          <div className="mb-6">
            <p className="font-medium text-sm mb-2">Location:</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm bg-green-50 text-green-700 px-4 py-1 rounded-full">
                {job.meta.location}
              </span>
              {job.meta.location.toLowerCase().includes("remote") && (
                <span className="text-sm bg-gray-100 text-gray-600 px-4 py-1 rounded-full">
                  Remote
                </span>
              )}
            </div>
          </div>

          <hr className="my-6" style={{ color: "#f7f7f7" }} />

          {/* Date Posted */}
          <div>
            <p className="font-medium text-sm mb-2">Date posted:</p>
            <span className="text-sm bg-blue-50 text-blue-600 px-4 py-1 rounded-full">
              {job.meta.closing_date}
            </span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl">
        {/* ABOUT COMPANY */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-6">About {job.meta.company}</h2>
          <div
            className="text-gray-700 leading-9"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </div>

        {/* TABLE IF ANY ADDITIONAL META EXISTS */}
        {/* JOB DETAILS ACCORDION */}
        <div className="mt-16 mb-32">
          <h2 className="text-2xl font-bold mb-4">Job Details</h2>

          <Accordion title="Salary">
            €{Number(job.meta.salary).toLocaleString()}
          </Accordion>

          <Accordion title="Experience">{job.meta.experience} years</Accordion>

          <Accordion title="Apply Link">
            <a
              href={job.meta.apply_link}
              target="_blank"
              className="text-blue-600 underline">
              {job.meta.apply_link}
            </a>
          </Accordion>
        </div>
      </div>
      {/* STICKY APPLY BUTTON (MOBILE) */}
      <div
        className=" max-w-3xl mx-auto
    fixed bottom-4 left-1/2 -translate-x-1/2 z-50
    md:static md:translate-x-0 md:bottom-auto md:left-auto 
    flex w-full md:w-auto mt-10 p-4 md:p-0
">
        {isPaidJob ? (
          <button
             onClick={() => router.push("/pricing")}
            className="w-full md:w-auto px-8 py-4 bg-blue-600  text-white
                 rounded-full font-medium cursor-pointer shadow-lg md:shadow-none">
            🔒 Subscribe to apply
          </button>
        ) : (
          <a
            href={job.meta.apply_link}
            target="_blank"
            className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white 
                 rounded-full font-medium hover:bg-blue-700 transition 
                 shadow-lg md:shadow-none text-center">
            Apply for position
          </a>
        )}
      </div>
    </div>
  );
}
