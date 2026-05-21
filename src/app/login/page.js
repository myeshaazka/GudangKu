"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "../AppStateProvider";

export default function Login() {
  const router = useRouter();
  const { currentUser, login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      router.push("/katalog");
    }
  }, [currentUser, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      router.push("/katalog");
    } catch (error) {
      setMessage(error.message || "Email atau password salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-xl bg-white px-16 py-14 shadow-sm flex flex-col items-center">
        
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
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#e6e6e6] text-gray-900 h-10 px-4 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
            />
          </div>
          
          <div className="flex flex-col mb-4">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#e6e6e6] text-gray-900 h-10 px-4 focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
            />
          </div>

          {message && <p className="text-sm text-center text-red-500">{message}</p>}

          <div className="flex justify-center mt-2">
            <button 
              type="submit" 
              className="bg-[#6052f5] hover:bg-[#4a3ae0] text-white rounded-md px-14 py-2.5 font-bold text-[15px] transition-colors"
            >
              Masuk
            </button>
          </div>
          
        </form>

      </div>
    </div>
  );
}
