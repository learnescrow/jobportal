import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  const filters = [
    "Internships",
    "Part-time",
    "Full-time",
    "Remote",
    "Freshers",
    "local jobs",
  ];

  return (
    <section className="w-full h-[80vh] md:h-[100vh] bg-[#5D2BFF] flex  justify-center px-4 ">
      <div className="w-full max-w-3xl md:mt-30 mt-50">
        <h1 className="text-4xl sm:text-4xl lg:text-4xl xl:text-6xl font-bold text-white text-center leading-tight mb-6">
          The #1 Platform for
          <br />
          all Oppurtunities
        </h1>

        <form
          className="
            relative flex items-center 
            rounded-full p-2
            bg-white/10 
            backdrop-blur-xl 
            border border-white/20 
            shadow-lg
          ">
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
            type="submit"
            className="
              absolute right-3
              bg-[#5D2BFF] text-white
              rounded-full px-6 py-3
              flex items-center gap-2 font-semibold
              shadow-md hover:bg-blue-700 transition-all
            ">
            Find jobs
            <ArrowRight size={18} />
          </button>
        </form>

        {/* 🔽 Search Pills — UNDER CURRENT UI */}
        <div className="flex flex-nowrap md:flex-wrap overflow-x-auto justify-center gap-3 mt-5 ml-6 pl-6 md:pl-0 scrollbar-hide">
          {filters.map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="
                text-white text-sm
                bg-white/20 border border-white/30
                backdrop-blur-md
                px-4 py-2 rounded-full
                hover:bg-white/30
                transition-all whitespace-nowrap 
              ">
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
