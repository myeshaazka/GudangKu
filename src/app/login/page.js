"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../AppStateProvider";

import { ShoppingBag } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { currentUser, login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (error) {
      setMessage(error.message || "Email atau password salah.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#fefae8" }}
    >
      <div className="w-full max-w-md bg-white rounded-3xl px-12 py-12 shadow-lg flex flex-col items-center">

        {/* Logo Icon */}
        <div className="bg-brand text-white p-3.5 rounded-2xl shadow-sm mb-6">
          <ShoppingBag size={30} strokeWidth={2.5} />
        </div>

        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Selamat Datang
        </h1>
        <p className="text-gray-400 text-sm font-medium mb-8">
          Masuk dengan akun admin Anda
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">

          <div className="flex flex-col">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#f0effe] text-gray-800 h-11 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6052f5]/40 transition-all"
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#f0effe] text-gray-800 h-11 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6052f5]/40 transition-all"
            />
          </div>

          {message && (
            <p className="text-sm text-center text-red-500">{message}</p>
          )}

          <div className="flex justify-center mt-3">
            <button
              type="submit"
              className="bg-[#6052f5] hover:bg-[#4a3ae0] active:scale-95 text-white rounded-xl px-16 py-3 font-bold text-[15px] transition-all duration-200 shadow-md shadow-[#6052f5]/30"
            >
              Masuk
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
