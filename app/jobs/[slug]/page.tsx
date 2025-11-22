//File: app/jobs/%5Bslug%5D/page.tsx
interface JobPageProps {
  params: Promise<{ slug: string }>;
}

import { Briefcase } from "lucide-react";

export default async function PublicJobDetailPage(props: JobPageProps) {
  const { slug } = await props.params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/wp-json/ukjobs/v1/jobs/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">Job not found</div>
    );
  }

  const job = await res.json();

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

          <a
            href={job.meta.apply_link}
            target="_blank"
            className="text-sm text-blue-600 underline mt-1 mb-6">
            Visit Website
          </a>

          <a
            href={job.meta.apply_link}
            target="_blank"
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
            Apply for position
          </a>
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
        <div className="mt-16 mb-32">
          <h2 className="text-2xl font-bold mb-4">Job Details</h2>

          <table className="w-full border-2 border-gray-100 rounded-xl overflow-hidden">
            <tbody>
              {/* Salary */}
              {job.meta.salary && (
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium bg-gray-50 w-1/3">Salary</td>
                  <td className="p-4">
                    €{Number(job.meta.salary).toLocaleString()}
                  </td>
                </tr>
              )}

              {/* Experience */}
              {job.meta.experience && (
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium bg-gray-50 w-1/3">
                    Experience
                  </td>
                  <td className="p-4">{job.meta.experience} years</td>
                </tr>
              )}

              {/* Apply Link */}
              <tr>
                <td className="p-4 font-medium bg-gray-50 w-1/3">Apply Link</td>
                <td className="p-4">
                  <a
                    href={job.meta.apply_link}
                    target="_blank"
                    className="text-blue-600 underline">
                    {job.meta.apply_link}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            className="
  fixed bottom-4 left-1/2 -translate-x-1/2 z-50 
  md:static md:translate-x-0 md:bottom-auto md:left-auto flex  w-full md:w-auto mt-10 p-4 md:p-0   
">
            <a
              href={job.meta.apply_link}
              target="_blank"
              className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition shadow-lg md:shadow-none text-center ">
              Apply for position
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
