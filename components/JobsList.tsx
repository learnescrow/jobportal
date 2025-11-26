"use client";
import { useAuth } from "@clerk/nextjs";
import { Briefcase } from "lucide-react";

export default function JobsList({ jobs }: any) {
  const { isSignedIn } = useAuth();

  return (
    <div className="space-y-5">
      {jobs.map((job: any) => {
        // ✅ Must be OUTSIDE JSX
        const jobUrl = isSignedIn
          ? `/dashboard/jobs/${job.slug}`
          : `/jobs/${job.slug}`;

        return (
          <a
            key={job.id}
            href={jobUrl}
            className="flex flex-wrap  items-start justify-start md:justify-between gap-4 md:gap-0 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition overflow-hidden">
            {/* LEFT */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Briefcase size={20} className="text-gray-500" />
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

            {/* RIGHT */}
            {/* RIGHT */}
            <div className="flex flex-col items-start md:items-end gap-2 whitespace-nowrap">
              {job.meta.closing_date
                ? (() => {
                    const closingDate = new Date(job.meta.closing_date);
                    const now = new Date();
                    const isClosed = closingDate < now;

                    const formattedClosing = closingDate.toLocaleDateString(
                      "en-UK",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    );

                    return (
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          isClosed
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-50 text-blue-600"
                        }`}>
                        {isClosed ? "Closed" : `Ends: ${formattedClosing}`}
                      </span>
                    );
                  })()
                : null}

              <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                {job.meta.location}
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
