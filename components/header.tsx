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
  const [clicked, setClicked] = useState(false);

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
    <header className="w-full ">
      <div className="mx-auto px-4 py-4 flex items-center justify-between">
        {/* LEFT — LOGO + INSTAGRAM (stack on very small screens) */}
        <div className="flex items-start gap-2 min-[350px]:items-center min-[350px]:flex-row flex-col">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold whitespace-nowrap flex flex-row items-center gap-2 ">
            <div className="h-10 md:h-14 w-10 md:w-14 rounded-full flex justify-center items-center overflow-hidden ">
              <Image
                src="/logoicons.png"
                alt="Worklance Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-0">
              <p className=" font-bold whitespace-nowrap">WorkLance</p>
              <span className="text-[10px]">
                One platform, all oppurtunities{" "}
              </span>
            </div>
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
          <div className="hidden md:flex flex-row items-center gap-4 ml-6">
            {/* Find jobs (Desktop only) */}
            <Link href="/" className="text-sm hover:underline">
              Home
            </Link>

            <Link
              href="/jobs"
              className="text-sm  hover:underline hidden md:block ml-4">
              Find jobs
            </Link>
            {/* View plans (Desktop only) */}
            <Link
              href="/pricing"
              className="hidden md:flex px-5 py-2  hover:text-gray-700 rounded-full text-sm  hover:underline transition">
              View plans
            </Link>

            <Link
              href="mailto:worklancehire@gmail.com"
              className="text-sm  hover:underline hidden md:block">
              Contact
            </Link>
          </div>
        </div>

        {/* RIGHT — POST A JOB + Desktop Instagram */}
        <div className="flex items-center gap-4">
          {/* Instagram (Desktop only) */}
          <Link
            href="https://www.instagram.com/worklance_hire?igsh=ZWw4d3A0OHhpMGZ4&utm_source=ig_contact_invite"
            target="_blank"
            className="hidden md:flex items-center gap-1 text-sm  hover:underline">
            <Instagram size={18} />
            Follow on Insta
          </Link>

          {/* Post a job */}
          <Link
            href="/post-a-job"
            className="hidden md:flex items-center text-sm  hover:underline text-black px-5 py-2 rounded-full  transition whitespace-nowrap">
            <Plus size={18} className="mr-1" />
            Post a job
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setClicked((prev) => !prev);
                setDropdown((v) => !v);
              }}
              className="font-bold rounded-full overflow-hidden cursor-pointer bg-[#5d2bff] text-white px-5 py-2 hover:underline">
              {clicked ? "Close" : "Menu"}
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
                      src={user?.imageUrl || "/person.png"}
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
                        <li className="p-3 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                          <button
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                            Dashboard
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="p-3 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                          <button
                            onClick={() => router.push("/auth")}
                            className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                            Login
                          </button>
                        </li>
                      </>
                    )}
                    {/* MOBILE ONLY OPTIONS */}
                    <li className="p-3 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl md:hidden">
                      <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                        Home
                      </button>
                    </li>

                    <li className="p-3 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl md:hidden">
                      <button
                        onClick={() => router.push("/jobs")}
                        className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                        Find jobs
                      </button>
                    </li>

                    <li className="p-3 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl md:hidden mb-2">
                      <button
                        onClick={() => router.push("/pricing")}
                        className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                        View plans
                      </button>
                    </li>

                    {/* Support */}
                    <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                      <a
                        href="mailto:worklancehire@gmail.com"
                        className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                        <HelpSvg />
                        Contact support
                      </a>
                    </li>

                    {/* News */}
                    <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                      <button
                        onClick={() => router.push("/news")}
                        className="flex items-center gap-2 text-black hover:text-[#377DFF] transition font-bold">
                        <NewSvg />
                        News
                      </button>
                    </li>

                    {/* Logout */}
                    <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                      <button
                        onClick={() => signOut({ redirectUrl: "/auth" })}
                        className="flex items-center gap-2 text-black hover:text-red-500 transition font-bold w-full">
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
