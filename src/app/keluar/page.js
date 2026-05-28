"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useAppState } from "../AppStateProvider";

export default function BarangKeluar() {
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

  if (isLoading || !currentUser) {
    return null;
  }
  const [product, setProduct] = useState("");
  const [qty, setQty] = useState(0);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const { products, addTransaction } = useAppState();

  const handleSubmit = async () => {
    if (!product || qty <= 0 || !date) {
      setMessage("Lengkapi semua kolom sebelum menyimpan.");
      return;
    }

    const selectedProduct = products.find((item) => item.id === product);
    const nextItem = {
      productId: selectedProduct?.id,
      type: "keluar",
      productName: selectedProduct?.name ?? "-",
      category: selectedProduct?.category ?? "-",
      qty: Number(qty),
      unit: selectedProduct?.unit ?? "PCS",
      date,
    };

    try {
      await addTransaction(nextItem);
      setMessage("Mutasi keluar berhasil disimpan. Lihat di halaman Riwayat.");
      setProduct("");
      setQty(0);
      setDate("");
    } catch (error) {
      setMessage("Gagal menyimpan transaksi. Coba lagi.");
      console.error(error);
    }
  };

  return (
    <DashboardLayout title="Barang Keluar">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="bg-gray-100/80 px-6 py-2.5 rounded-xl mb-12">
            <h3 className="text-gray-700 font-bold text-[15px]">Form Transaksi Keluar</h3>
          </div>

          <form className="w-full flex flex-col gap-8">
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Produk
              </label>
              <select
                value={product}
                onChange={(event) => setProduct(event.target.value)}
                className="w-full border border-[#c5bdfc] rounded-xl px-4 py-3.5 text-gray-600 font-medium focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand bg-white transition-all cursor-pointer"
              >
                <option value="" disabled>-- Pilih Barang di Gudang --</option>
                {products.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Jumlah
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(event) => setQty(Number(event.target.value))}
                  min="0"
                  className="w-full border border-[#c5bdfc] rounded-xl px-4 py-3.5 text-gray-600 font-medium focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full border border-[#c5bdfc] rounded-xl px-4 py-3.5 text-gray-600 font-medium focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                />
              </div>
            </div>

            {message && <p className="text-sm text-center text-green-600">{message}</p>}

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-brand hover:bg-[#4a3ae0] text-white px-10 py-3 rounded-full font-bold text-[15px] shadow-[0_4px_12px_-4px_rgba(91,74,251,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(91,74,251,0.6)] transition-all duration-200"
              >
                Simpan Mutasi
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
