"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname(); // "/jobs/senior-software-engineer"

  const parts = pathname.split("/").filter(Boolean); // ["jobs", "senior-software-engineer"]

  let path = "";

  return (
    <div className="text-sm text-gray-500">
      <Link href="/" className="hover:underline">
        Home
      </Link>

      {parts.map((part, index) => {
        path += `/${part}`;

        return (
          <span key={index}>
            {" / "}
            <Link
              href={path}
              className={`hover:underline ${
                index === parts.length - 1 ? "font-semibold text-gray-700" : ""
              }`}>
              {decodeURIComponent(part).replace(/-/g, " ")}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
