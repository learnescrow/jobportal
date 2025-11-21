"use client";
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
// import SettingsSVG from "@/public/Profilesvgs/SettingsSvg"; // rename if needed

export default function DashboardHeader() {
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
    <header className="w-full flex items-center justify-between bg-white shadow px-6 py-4 mb-6 rounded-xl">

      {/* LEFT — Breadcrumbs */}
      <nav className="flex items-center gap-2 text-gray-600 font-medium">
        {breadcrumbs.map((crumb, index) => (
          <span key={index} className="flex items-center gap-2">
            <Link href={crumb.href} className="hover:text-black">
              {crumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-400">/</span>
            )}
          </span>
        ))}
      </nav>

      {/* RIGHT — Profile Button + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdown((v) => !v)}
          className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
        >
          <Image
            src={user?.imageUrl || 
            "/download.jpeg"
            }
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
              className="w-[344px] absolute right-0 mt-3 bg-white rounded-2xl shadow-lg p-3 z-30 border border-gray-100"
            >
              {/* PROFILE CARD */}
              <div
                className="flex flex-col items-start justify-center gap-2 p-3 bg-[#F4F4F4] rounded-xl cursor-pointer mb-3 overflow-hidden"
                onClick={() => router.push("/profile")}
              >
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
                    {user?.primaryEmailAddress?.emailAddress}
                  </div>
                </div>
              </div>

              {/* MENU ITEMS */}
              <ul className="pt-2">
                {/* Settings */}
                

                {/* Support */}
                <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                  <button
                    onClick={() => router.push("/support")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#377DFF] transition font-bold"
                  >
                    <HelpSvg />
                    Contact support
                  </button>
                </li>

                {/* News */}
                <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                  <button
                    onClick={() => router.push("/news")}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#377DFF] transition font-bold"
                  >
                    <NewSvg />
                    News
                  </button>
                </li>

                {/* Logout */}
                <li className="p-4 hover:bg-[#f4f4f4] transition-colors hover:rounded-2xl">
                  <button
                    onClick={() => signOut({ redirectUrl: "/auth" })}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition font-bold w-full"
                  >
                    <LogoutSVG />
                    Log out
                  </button>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
