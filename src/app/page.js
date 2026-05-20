import DashboardLayout from "@/components/DashboardLayout";
import { Package, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { label: "Total Produk", value: "124", icon: Package, color: "text-brand", bg: "bg-brand-light" },
    { label: "Barang Masuk (Bulan Ini)", value: "850", icon: ArrowDownLeft, color: "text-green-600", bg: "bg-green-50" },
    { label: "Barang Keluar (Bulan Ini)", value: "420", icon: ArrowUpRight, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={28} strokeWidth={2} />
            </div>
            <div>
              <p className="text-gray-400 font-medium text-sm">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-[400px]">
        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Ringkasan Aktivitas Terbaru</h3>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <p className="font-medium">Belum ada aktivitas terbaru.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
