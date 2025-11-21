"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const { signOut } = useClerk();

  const menu = [
    {
      label: "Part-Time Jobs",
      icon: "lucide:clock",
      href: "/dashboard/jobs",
    },
    {
      label: "Full-Time Jobs",
      icon: "lucide:briefcase",
      href: "/full-time-jobs",
    },
    {
      label: "Profile",
      icon: "lucide:user",
      href: "/profile",
    },
  ];

  return (
    <div
      className={`flex h-full flex-col bg-black py-8 transition-all duration-300 ${
        open ? "w-64" : "w-[100px]"
      }`}>
      {/* Logo */}
      <div className="mb-8 px-4">
        <div className="flex items-center gap-4 rounded-xl p-3 text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
            <Icon
              icon="lucide:bar-chart-2"
              className="h-6 w-6 text-neon-green"
            />
          </div>
          {open && <span className="text-sm font-semibold">Worklance</span>}
        </div>
      </div>

      {/* MENU ITEMS */}
      <div className="flex flex-col gap-2 px-4 mt-4 flex-1">
        {menu.map((item, idx) => (
          <Link
            key={idx}
            href={item.href}
            className={`flex items-center gap-4 rounded-xl p-3 text-white hover:bg-white/10 transition cursor-pointer ${
              open ? "justify-start" : "justify-start"
            }`}>
            <Icon icon={item.icon} className="h-4 w-4" />
            {open && <span className="text-sm font-[500]">{item.label}</span>}
          </Link>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col px-4 gap-4">
        {/* Collapse */}
        <button
          className="flex items-center gap-4 rounded-xl p-3 text-white hover:bg-white/10 cursor-pointer"
          onClick={() => setOpen(!open)}>
          <Icon
            icon={open ? "lucide:chevrons-left" : "lucide:chevrons-right"}
            className="h-6 w-6"
          />
          {open && <span className="text-sm">Collapse</span>}
        </button>

        {/* Logout */}
        <button
          className="flex items-center gap-4 rounded-xl p-3 text-white hover:bg-white/10 cursor-pointer"
          onClick={() => signOut({ redirectUrl: "/auth" })}>
          <Icon icon="lucide:log-out" className="h-6 w-6" />
          {open && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
