"use client";

import { useState } from "react";
import { User, ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/app/AppStateProvider";

export default function Topbar({ title }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { currentUser, logout } = useAppState();

  const handleToggleMenu = () => {
    setIsMenuOpen((open) => !open);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="bg-white h-20 rounded-[2rem] flex items-center justify-between px-8 shadow-sm border border-gray-100 relative">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>

      <div className="relative">
        <button
          type="button"
          onClick={handleToggleMenu}
          className="h-11 min-w-[3rem] rounded-full border border-gray-200 flex items-center justify-center gap-2 px-4 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <User size={20} strokeWidth={2} />
          <ChevronDown size={18} strokeWidth={2} className={isMenuOpen ? "rotate-180 transition-transform" : "transition-transform"} />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 rounded-[1.75rem] border border-gray-100 bg-white shadow-xl p-4 z-50">
            {currentUser ? (
              <>
                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400 mb-3">Logged in as</p>
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.username || currentUser.name || currentUser.email}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-[0.2em] mt-2">Role: {currentUser.role}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-2xl bg-red-50 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-600">Belum login.</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
