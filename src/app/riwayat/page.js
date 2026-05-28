"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowUpLeft, ArrowUpRight, MoreVertical, Info, XCircle, X, Download } from "lucide-react";
import { useAppState } from "../AppStateProvider";

export default function Riwayat() {
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

  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailModalItem, setDetailModalItem] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const { transactions, cancelTransaction } = useAppState();

  const handleDownloadPDF = () => {
    const printDate = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const rows = transactions
      .map(
        (item, idx) => `
        <tr>
          <td class="center">${idx + 1}</td>
          <td class="center">
            <span class="badge ${item.type === "masuk" ? "badge-masuk" : "badge-keluar"}">
              ${item.type === "masuk" ? "▲ Masuk" : "▼ Keluar"}
            </span>
          </td>
          <td><strong>${item.productName ?? "-"}</strong></td>
          <td class="center">${item.category ?? "-"}</td>
          <td class="center bold">${item.qty} ${item.unit}</td>
          <td>${item.user ?? "-"}</td>
          <td class="center">${item.date ?? "-"}</td>
        </tr>`
      )
      .join("");

    const totalMasuk = transactions.filter((t) => t.type === "masuk").reduce((s, t) => s + Number(t.qty), 0);
    const totalKeluar = transactions.filter((t) => t.type === "keluar").reduce((s, t) => s + Number(t.qty), 0);

    const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan Mutasi Stok GudangKu</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Arial', sans-serif; color: #1f2937; background: white; font-size: 13px; }

    .page { padding: 40px 48px; max-width: 960px; margin: 0 auto; }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 3px solid #5b4afb; margin-bottom: 28px; }
    .brand { display: flex; flex-direction: column; }
    .brand h1 { font-size: 26px; font-weight: 900; color: #5b4afb; letter-spacing: -0.5px; }
    .brand p { font-size: 11px; color: #9ca3af; margin-top: 3px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
    .doc-info { text-align: right; }
    .doc-info .doc-title { font-size: 15px; font-weight: 800; color: #1f2937; }
    .doc-info .doc-date { font-size: 11px; color: #6b7280; margin-top: 4px; }

    /* Summary cards */
    .summary { display: flex; gap: 16px; margin-bottom: 28px; }
    .card { flex: 1; border-radius: 12px; padding: 16px 20px; }
    .card.total { background: #f0effe; }
    .card.masuk { background: #e8f7f0; }
    .card.keluar { background: #fdeaea; }
    .card .label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; }
    .card.total .label { color: #5b4afb; }
    .card.masuk .label { color: #047857; }
    .card.keluar .label { color: #b91c1c; }
    .card .value { font-size: 24px; font-weight: 900; }
    .card.total .value { color: #5b4afb; }
    .card.masuk .value { color: #047857; }
    .card.keluar .value { color: #b91c1c; }

    /* Table */
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #5b4afb; }
    th { padding: 10px 12px; text-align: left; color: white; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
    td { padding: 10px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
    tr:nth-child(even) td { background: #fafafa; }
    td.center { text-align: center; }
    td.bold { font-weight: 700; }

    .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10px; font-weight: 800; letter-spacing: 0.05em; }
    .badge-masuk { background: #d1fae5; color: #065f46; }
    .badge-keluar { background: #fee2e2; color: #991b1b; }

    /* Footer */
    .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
    .footer p { font-size: 10px; color: #9ca3af; }

    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .page { padding: 20px 28px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <h1>GudangKu.</h1>
        <p>Inventory Management System</p>
      </div>
      <div class="doc-info">
        <div class="doc-title">Laporan Mutasi Stok</div>
        <div class="doc-date">Dicetak: ${printDate}</div>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary">
      <div class="card total">
        <div class="label">Total Transaksi</div>
        <div class="value">${transactions.length}</div>
      </div>
      <div class="card masuk">
        <div class="label">Total Masuk (Unit)</div>
        <div class="value">${totalMasuk}</div>
      </div>
      <div class="card keluar">
        <div class="label">Total Keluar (Unit)</div>
        <div class="value">${totalKeluar}</div>
      </div>
    </div>

    <!-- Table -->
    <table>
      <thead>
        <tr>
          <th style="width:40px;">No.</th>
          <th style="width:90px;">Tipe</th>
          <th>Nama Produk</th>
          <th style="width:100px;">Kategori</th>
          <th style="width:80px;">Jumlah</th>
          <th>Operator</th>
          <th style="width:100px;">Tanggal</th>
        </tr>
      </thead>
      <tbody>
        ${rows || "<tr><td colspan='7' style='text-align:center;color:#9ca3af;padding:24px'>Tidak ada data transaksi.</td></tr>"}
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      <p>GudangKu &mdash; Dokumen ini digenerate otomatis oleh sistem.</p>
      <p>Total ${transactions.length} record &bull; ${printDate}</p>
    </div>
  </div>

  <script>
    window.onload = function () {
      window.print();
      window.onafterprint = function() { window.close(); };
    };
  </script>
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      // Fallback: download as HTML if popup is blocked
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan-mutasi-gudangku-${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    setShowDownloadModal(false);
  };


  if (isLoading || !currentUser) {
    return null;
  }

  return (
    <DashboardLayout title="Riwayat Aktivitas">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-full">

        {/* Header Row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Riwayat Aktivitas</h2>
            <p className="text-gray-400 font-medium mt-1">Catatan mutasi keluar dan masuk di GudangKu.</p>
          </div>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-2 border border-brand text-brand hover:bg-brand hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 mt-1"
          >
            <Download size={16} strokeWidth={2.5} />
            Unduh Laporan
          </button>
        </div>

        {/* Transaction List */}
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
                      <button
                        onClick={async () => {
                          setCancelError(null);
                          setIsCancelling(true);
                          try {
                            await cancelTransaction(item.id);
                            setOpenMenuId(null);
                          } catch (error) {
                            setCancelError(error?.message ?? "Gagal membatalkan transaksi.");
                          } finally {
                            setIsCancelling(false);
                          }
                        }}
                        disabled={isCancelling}
                        className="w-full text-left px-5 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={16} strokeWidth={2.5} />
                        {isCancelling ? "Membatalkan..." : "Batalkan Transaksi"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Toast */}
      {cancelError && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-3xl bg-red-50 border border-red-200 p-4 shadow-lg">
          <p className="text-sm font-semibold text-red-700">{cancelError}</p>
        </div>
      )}

      {/* ===== Download Confirmation Modal ===== */}
      {showDownloadModal && (
        <div
          className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Download Icon Circle */}
            <div className="w-14 h-14 rounded-full bg-[#f0effe] flex items-center justify-center mb-5">
              <Download size={26} strokeWidth={2} className="text-brand" />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Unduh Laporan Mutasi PDF?
            </h3>

            {/* Description */}
            <p className="text-[14px] text-gray-500 leading-relaxed mb-7 px-1">
              Aplikasi akan mengekspor seluruh catatan transaksi mutasi stok saat ini ke dalam berkas{" "}
              <strong className="text-gray-700">**PDF**</strong> yang rapi dan siap dicetak.
            </p>

            {/* Buttons */}
            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-2xl font-semibold text-[14px] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-brand hover:bg-[#4a3ae0] text-white py-3 rounded-2xl font-bold text-[14px] transition-colors shadow-md shadow-brand/30"
              >
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Transaction Modal */}
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
