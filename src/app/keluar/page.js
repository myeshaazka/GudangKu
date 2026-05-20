import DashboardLayout from "@/components/DashboardLayout";

export default function BarangKeluar() {
  return (
    <DashboardLayout title="Barang Keluar">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-full flex flex-col items-center justify-center">
        
        {/* Form Container */}
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* Header Badge */}
          <div className="bg-gray-100/80 px-6 py-2.5 rounded-xl mb-12">
            <h3 className="text-gray-700 font-bold text-[15px]">Form Transaksi Keluar</h3>
          </div>

          {/* Form Fields */}
          <form className="w-full flex flex-col gap-8">
            
            {/* Produk Input */}
            <div className="relative">
              <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                Produk
              </label>
              <select className="w-full border border-[#c5bdfc] rounded-xl px-4 py-3.5 appearance-none text-gray-600 font-medium focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand bg-white transition-all cursor-pointer">
                <option value="" disabled selected>-- Pilih Barang di Gudang --</option>
                <option value="1">Beras Wangi 5kg</option>
                <option value="2">Minyak Goreng 2L</option>
              </select>
            </div>

            {/* Jumlah & Tanggal Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Jumlah Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Jumlah
                </label>
                <input 
                  type="number" 
                  defaultValue="0"
                  className="w-full border border-[#c5bdfc] rounded-xl px-4 py-3.5 text-gray-600 font-medium focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                />
              </div>

              {/* Tanggal Input */}
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white px-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                  Tanggal
                </label>
                <input 
                  type="date" 
                  className="w-full border border-[#c5bdfc] rounded-xl px-4 py-3.5 text-gray-600 font-medium focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button 
                type="button" 
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
