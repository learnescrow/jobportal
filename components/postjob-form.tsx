//File :- /app/components/postjob-form.tsx
"use client";

export default function PostJobForm() {
  return (
    <div className="w-full bg-white py-20 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        {/* Top Title + Subtitle */}
        <h1 className="text-4xl md:text-5xl font-bold text-center">
          Post a job on WorkLance
        </h1>

        <p className="text-center text-gray-600 mt-4 leading-relaxed">
          Post a job and reach +15,000 qualified professionals directly from our
          newsletters and +160,000 from our website.{" "}
          <a href="#" className="text-blue-600 underline">
            We charge a single fee of $50 for post.
          </a>
        </p>

        {/* Main Card */}
        <div className="bg-white mt-12 p-8 rounded-2xl border border-[#5D2BFF]/10 shadow-sm">
          {/* Job Title */}
          <div className="mb-6">
            <label className="font-medium text-sm">
              Job title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Senior iOS Developer"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* Job Location */}
          <div className="mb-6">
            <label className="font-medium text-sm">
              Job location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. New York, USA"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* Job Type */}
          <div className="mb-6">
            <label className="font-medium text-sm">
              Job type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. full-time, part-time, freelancer..."
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* Job Description – URL */}
          <div className="mb-6">
            <label className="font-medium text-sm">
              Job description (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <p className="text-xs text-gray-500 mt-2">
              Please add a Google Docs URL or any other link to which we can
              read the job description.
            </p>
          </div>

          {/* Where People Apply */}
          <div className="mb-6">
            <label className="font-medium text-sm">
              Where people can apply? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <p className="text-xs text-gray-500 mt-2">
              A URL or email address to which applicants can send their
              applications.
            </p>
          </div>

          {/* Company Website */}
          <div className="mb-6">
            <label className="font-medium text-sm">
              Company website <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="https://"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* Email */}
          <div className="mb-8">
            <label className="font-medium text-sm">
              Your email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="email@domain.com"
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[#5D2BFF]/10  focus:outline-none focus:ring-2 focus:ring-black/20"
            />
            <p className="text-xs text-gray-500 mt-2">
              Stays private. Used for internal communication and invoicing.
            </p>
          </div>

          {/* Spotlight Options */}
          <div className="mb-10">
            <p className="font-medium text-sm mb-3">
              Make your job stand out (recommended)
            </p>

            <div className="flex items-center flex-wrap gap-3 mb-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Spotlight 1 week ($100)</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                4x more views
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-sm">Spotlight 4 weeks ($250)</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                12x more views
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full py-4 text-white text-lg font-medium rounded-full bg-[#0056FF] hover:bg-blue-700 transition">
            Post job (starting at $50)
          </button>

          <p className="text-center text-gray-500 text-xs mt-4">
            You will be sent an email with a Stripe checkout link.
          </p>
        </div>
      </div>
    </div>
  );
}
