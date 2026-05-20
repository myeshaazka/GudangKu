"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowUpLeft, ArrowUpRight, MoreVertical, Info, XCircle, X } from "lucide-react";
import { useAppState } from "../AppStateProvider";

export default function Riwayat() {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const { transactions } = useAppState();

  return (
    <DashboardLayout title="Riwayat Aktivitas">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-full">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Riwayat Aktivitas</h2>
          <p className="text-gray-400 font-medium mt-1">Log transaksi gudang terbaru</p>
        </div>

        <div className="flex flex-col gap-4">
          {transactions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 px-6 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-200"
            >
              <div className="flex items-center gap-6">
                <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center ${
                  item.type === "masuk"
                    ? "bg-[#e8f7f0] text-[#2ebd6c]"
                    : "bg-[#fdeaea] text-[#ea5b5b]"
                }`}>
                  {item.type === "masuk" ? (
                    <ArrowUpLeft size={22} strokeWidth={3} />
                  ) : (
                    <ArrowUpRight size={22} strokeWidth={3} />
                  )}
                </div>

                <div className="w-44">
                  <h3 className="text-[16px] font-bold text-gray-900 leading-snug">{item.productName}</h3>
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-1 uppercase">{item.category}</p>
                </div>

                <div className="flex items-baseline gap-1.5 w-16">
                  <span className="text-2xl font-black text-gray-900">{item.qty}</span>
                  <span className="text-[11px] font-bold text-gray-400">{item.unit}</span>
                </div>
              </div>

              <div className="flex items-center gap-16 pr-2">
                <div className="w-32">
                  <p className="text-[13px] font-bold text-gray-900">{item.user}</p>
                  <p className="text-[10px] font-bold text-gray-400 tracking-wider mt-0.5 uppercase">{item.role}</p>
                </div>

                <p className="text-[14px] font-bold text-gray-600 tracking-wide w-28 text-left">{item.date}</p>

                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                    className="text-gray-300 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-50"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openMenuId === item.id && (
                    <div className="absolute right-0 top-12 w-[200px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-3 z-10 animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={() => {
                          setDetailModalItem(item);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <Info size={16} strokeWidth={2.5} className="text-gray-500" />
                        Detail Transaksi
                      </button>
                      <button className="w-full text-left px-5 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1">
                        <XCircle size={16} strokeWidth={2.5} />
                        Batalkan Transaksi
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detailModalItem && (
        <div className="fixed inset-0 bg-[#d9d4cd]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-9 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Rincian Transaksi</h3>
                <p className="text-[11px] font-bold text-[#8b92a5] tracking-widest uppercase">
                  Audit Log GudangKu
                </p>
              </div>
              <button
                onClick={() => setDetailModalItem(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className={`flex items-center justify-between px-5 py-4 rounded-[1.25rem] mb-8 ${
              detailModalItem.type === "masuk"
                ? "bg-[#e8f7f0] text-[#2ebd6c]"
                : "bg-[#fdeaea] text-[#ea5b5b]"
            }`}>
              <div className="flex items-center gap-3">
                {detailModalItem.type === "masuk" ? (
                  <ArrowUpLeft size={20} strokeWidth={3} />
                ) : (
                  <ArrowUpRight size={20} strokeWidth={3} />
                )}
                <span className="text-[13px] font-bold tracking-wide uppercase">
                  Transaksi {detailModalItem.type}
                </span>
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase opacity-80">
                ID: 00{detailModalItem.id}
              </span>
            </div>

            <div className="flex flex-col gap-6 mb-10 px-1">
              <div className="flex justify-between items-center border-b border-gray-100/50 pb-4">
                <span className="text-[13px] font-medium text-[#8b92a5]">Nama Produk</span>
                <span className="text-[14px] font-bold text-gray-900">{detailModalItem.productName}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100/50 pb-4">
                <span className="text-[13px] font-medium text-[#8b92a5]">Kategori</span>
                <span className="text-[13px] font-bold text-gray-900 uppercase">{detailModalItem.category}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100/50 pb-4">
                <span className="text-[13px] font-medium text-[#8b92a5]">Jumlah Mutasi</span>
                <span className="text-[14px] font-bold text-brand">{detailModalItem.qty} {detailModalItem.unit}</span>
              </div>

              <div className="flex justify-between items-center border-b border-gray-100/50 pb-4">
                <span className="text-[13px] font-medium text-[#8b92a5]">Operator Pelaksana</span>
                <span className="text-[14px] font-bold text-gray-900">{detailModalItem.user}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[13px] font-medium text-[#8b92a5]">Waktu Validasi</span>
                <span className="text-[14px] font-bold text-gray-900">{detailModalItem.date}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
