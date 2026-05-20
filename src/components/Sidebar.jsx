"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  LogOut,
  ShoppingBag,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Katalog", path: "/katalog", icon: LayoutGrid },
    { name: "Masuk", path: "/masuk", icon: ArrowDownLeft },
    { name: "Keluar", path: "/keluar", icon: ArrowUpRight },
    { name: "Riwayat", path: "/riwayat", icon: History },
  ];

  return (
    <aside className="w-64 bg-white h-[calc(100vh-2rem)] my-4 ml-4 rounded-[2rem] flex flex-col shadow-sm border border-gray-100">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-8 pt-10 pb-8">
        <div className="bg-brand text-white p-2.5 rounded-xl shadow-sm">
          <ShoppingBag size={22} strokeWidth={2.5} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          GudangKu<span className="text-brand">.</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path || (pathname === "/" && item.path === "/katalog");
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-medium text-sm
                ${
                  isActive
                    ? "bg-brand-light text-brand"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mb-4">
        <Link href="/login" className="w-full flex items-center gap-4 px-4 py-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200 font-medium text-sm">
          <LogOut size={18} strokeWidth={2} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
