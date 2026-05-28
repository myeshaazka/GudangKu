"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { AlertCircle } from "lucide-react";
import { useAppState } from "../AppStateProvider";

export default function Dashboard() {
  const router = useRouter();
  const { currentUser } = useAppState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [currentUser, router]);

  const { products, transactions } = useAppState();

  if (isLoading || !currentUser) {
    return null;
  }

  // Calculate dynamic stats
  const totalSKUs = products.length;
  const totalStock = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const totalIncoming = transactions
    .filter((t) => t.type === "masuk")
    .reduce((acc, t) => acc + Number(t.qty), 0);
  const totalOutgoing = transactions
    .filter((t) => t.type === "keluar")
    .reduce((acc, t) => acc + Number(t.qty), 0);

  // Critical stock products (stock <= 5)
  const criticalProducts = products.filter((p) => Number(p.stock) <= 5);

  return (
    <DashboardLayout title="Dashboard Analitik">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-full flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Performa & Pergerakan Stok</h2>
          <p className="text-gray-400 font-medium mt-1">Status dan ringkasan audit mutasi gudang secara visual.</p>
        </div>

        {/* Content Box */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Critical Stock Alert Box */}
          <div className="bg-[#fef2f2] border border-[#fee2e2] rounded-3xl p-6 flex flex-col gap-4">
            
            {/* Alert Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3 text-[#ef4444]">
                <AlertCircle size={20} strokeWidth={2.5} />
                <span className="font-bold text-sm tracking-wide">Peringatan Stok Kritis (Stok ≤ 5)</span>
              </div>
              <span className="bg-[#fee2e2] text-[#ef4444] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {criticalProducts.length} Produk
              </span>
            </div>

            {/* Critical Product List */}
            <div className="flex flex-col gap-3.5 mt-2">
              {criticalProducts.length > 0 ? (
                criticalProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center py-1 border-b border-[#fee2e2]/40 last:border-0">
                    <div className="flex items-center gap-3">
                      {/* Red indicator dot */}
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                      <span className="font-bold text-[15px] text-gray-800">{p.name}</span>
                      {/* Category Pill Tag */}
                      <span className="bg-[#fee2e2] text-[#ef4444] text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>
                    {/* Sisa Stok */}
                    <div className="text-[13px] font-semibold text-gray-500">
                      Sisa stok: <span className="text-[#ef4444] font-black text-[15px]">{p.stock} {p.unit}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm font-medium py-2">Semua stok produk dalam kondisi aman.</p>
              )}
            </div>

          </div>

          {/* Dynamic Stats Cards Grid */}
          <div className="grid grid-cols-4 gap-4 mt-auto">
            {/* Total SKU Card */}
            <div className="bg-[#faf9f7] rounded-3xl p-6 border border-gray-50 shadow-sm flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                TOTAL SKU TERDAFTAR
              </span>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-4xl font-black text-gray-950">{totalSKUs}</span>
                <span className="text-sm font-bold text-gray-400">Katalog</span>
              </div>
            </div>

            {/* Total Stok Gudang */}
            <div className="bg-[#faf9f7] rounded-3xl p-6 border border-gray-50 shadow-sm flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                TOTAL STOK GUDANG
              </span>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-4xl font-black text-blue-900">{totalStock}</span>
                <span className="text-sm font-bold text-gray-400">Unit</span>
              </div>
            </div>

            {/* Barang Masuk Card */}
            <div className="bg-[#e8f7f0] rounded-3xl p-6 border border-[#d1f2e1] shadow-sm flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-[#065f46] tracking-wider uppercase">
                BARANG MASUK (PASOKAN)
              </span>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-4xl font-black text-[#047857]">{totalIncoming}</span>
                <span className="text-sm font-bold text-[#065f46] opacity-70">Unit</span>
              </div>
            </div>

            {/* Barang Keluar Card */}
            <div className="bg-[#fdf0f0] rounded-3xl p-6 border border-[#fcd5d5] shadow-sm flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-[#991b1b] tracking-wider uppercase">
                BARANG KELUAR (KELUAR)
              </span>
              <div className="flex items-baseline gap-1.5 mt-4">
                <span className="text-4xl font-black text-[#b91c1c]">{totalOutgoing}</span>
                <span className="text-sm font-bold text-[#991b1b] opacity-70">Unit</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
