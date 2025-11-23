import React from "react";

const LogoRow: React.FC = () => {
  // You'd ideally host optimized SVG or PNG logos locally or via CDN.
  const logos = [
    { alt: "Del Monte", src: "/delmonte.png" },
    { alt: "Barker Ross", src: "/group.png" },
    { alt: "DPD", src: "/dpd.png" },
    { alt: "Amazon", src: "/amazon.png", highlight: true },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Trusted by leading employers
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 mb-6">
          {logos.map((logo, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center transition-all shadow-lg border-2 border-gray-100 bg-gray-200 px-6 py-2 rounded-xl ${
                logo.highlight
                  ? "scale-110 opacity-100"
                  : "opacity-80 hover:opacity-100"
              }`}>
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-12 sm:h-16 object-contain"
              />
            </div>
          ))}
        </div>

        <p className="text-gray-600 text-lg">
          <strong className="text-gray-900">Amazon</strong> – next Feb 2026
          again starts the new Part-time jobs.
        </p>
      </div>
    </section>
  );
};

export default LogoRow;
