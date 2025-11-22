"use client";
import { Plus, Instagram } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
// Import your SVG Icons
import HelpSvg from "@/public/Profilesvgs/HelpSvg";
import NewSvg from "@/public/Profilesvgs/NewsSvg";
import LogoutSVG from "@/public/Profilesvgs/Logout";
import { useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const [dropdown, setDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const darkMode = false; // placeholder — adjust based on your logic
  const setDarkMode = () => {};

  // Breadcrumb Logic
  const parts = pathname.split("/").filter(Boolean);

  const breadcrumbs = parts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1),
    href: "/" + parts.slice(0, index + 1).join("/"),
  }));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdown(false);
      }
    }
    if (dropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdown]);

  return (
    <header className="w-full border-b border-gray-100 bg-white">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* LEFT — LOGO + INSTAGRAM (stack on very small screens) */}
        <div className="flex items-start gap-2 min-[350px]:items-center min-[350px]:flex-row flex-col">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold whitespace-nowrap">
            Worklance
          </Link>

          {/* Instagram (Mobile ≤350px also works) */}
          <Link
            href="https://instagram.com"
            target="_blank"
            className="hidden md:flex items-center gap-1 text-sm text-gray-700 md:hidden">
            <Instagram size={18} />
            <span className="min-[350px]:block hidden">Instagram</span>
            <span className="min-[350px]:hidden block">Insta</span>
          </Link>

          {/* Find jobs (Desktop only) */}
          <Link
            href="/jobs"
            className="text-sm text-gray-700 hover:underline hidden md:block ml-4">
            Find jobs
          </Link>

          {/* View plans (Desktop only) */}
          <Link
            href="/pricing"
            className="hidden md:flex px-5 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-50 transition">
            View plans
          </Link>
        </div>

        {/* RIGHT — POST A JOB + Desktop Instagram */}
        <div className="flex items-center gap-4">
          {/* Instagram (Desktop only) */}
          <Link
            href="https://instagram.com"
            target="_blank"
            className="hidden md:flex items-center gap-1 text-sm text-gray-700 hover:underline">
            <Instagram size={18} />
            Follow on Insta
          </Link>

          {/* Post a job */}
          <Link
            href="/post-job"
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition whitespace-nowrap">
            <Plus size={18} className="mr-1" />
            Post a job
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdown((v) => !v)}
              className="w-10 md:w-12 h-10 md:h-12 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer">
              <Image
                src={user?.imageUrl || "/download.jpeg"}
                alt="Profile"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {dropdown && (
                <motion.div
                  key="dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="w-[344px] absolute right-0 mt-3 bg-white rounded-2xl shadow-lg p-3 z-30 border border-gray-100">
                  {/* PROFILE CARD */}
                  <div
                    className="flex flex-col items-start justify-center gap-2 p-3 bg-[#F4F4F4] rounded-xl cursor-pointer mb-3 overflow-hidden"
                    onClick={() => router.push("/profile")}>
                    <Image
                      src={user?.imageUrl || "/download.jpeg"}
                      alt="Profile"
                      width={64}
                      height={64}
                      className="w-10 h-10 rounded-full object-cover mb-2"
                    />
                    <div>
                      <div className="font-bold text-lg">
                        {user?.fullName || "User"}
                      </div>
                      <div className="text-gray-500 text-sm overflow-auto">
                        {user?.primaryEmailAddress?.emailAddress ||
                          "user-email"}
                      </div>
                    </div>
                  </div>

                  {/* MENU ITEMS */}
                  <ul className="pt-2">
                    {/* Settings */}
                    {isSignedIn ? (
                      <>
                        <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                          <button
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-2 text-gray-700 hover:text-[#377DFF] transition font-bold">
                            <NewSvg />
                            Dashboard
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                          <button
                            onClick={() => router.push("/auth")}
                            className="flex items-center gap-2 text-gray-700 hover:text-[#377DFF] transition font-bold">
                            <NewSvg />
                            Login
                          </button>
                        </li>
                      </>
                    )}

                    {/* Support */}
                    <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                      <button
                        onClick={() => router.push("/support")}
                        className="flex items-center gap-2 text-gray-700 hover:text-[#377DFF] transition font-bold">
                        <HelpSvg />
                        Contact support
                      </button>
                    </li>

                    {/* News */}
                    <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                      <button
                        onClick={() => router.push("/news")}
                        className="flex items-center gap-2 text-gray-700 hover:text-[#377DFF] transition font-bold">
                        <NewSvg />
                        News
                      </button>
                    </li>

                    {/* Logout */}
                    <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                      <button
                        onClick={() => signOut({ redirectUrl: "/auth" })}
                        className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition font-bold w-full">
                        <LogoutSVG />
                        Log out
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
