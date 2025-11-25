"use client";

import Link from "next/link";
import { Instagram, Linkedin, Youtube, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 ">
      <div className=" mx-auto px-4 py-8">
        {/* SOCIAL ICONS — top on mobile, right on desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="https://x.com"
              target="_blank"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <X size={20} />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <Instagram size={20} />
            </Link>

            <Link
              href="https://youtube.com"
              target="_blank"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <Youtube size={20} />
            </Link>

            <Link
              href="https://linkedin.com"
              target="_blank"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition ">
              <Linkedin size={20} />
            </Link>
          </div>

          {/* COPYRIGHT + PRIVACY */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full md:w-auto gap-3 text-sm ">
            <p>© 2024 Worklance.</p>

            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
