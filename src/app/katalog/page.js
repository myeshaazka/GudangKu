"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, MoreVertical, X, AlertCircle, ChevronDown, Eye, Pencil, Trash2, Info } from "lucide-react";
import { useAppState } from "../AppStateProvider";

export default function Katalog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailModalProduct, setDetailModalProduct] = useState(null);
  const [editModalProduct, setEditModalProduct] = useState(null); // State for edit modal
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("SEMBAKO");
  const [newUnit, setNewUnit] = useState("PACK");
  const [newStock, setNewStock] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const { products, addProduct } = useAppState();

  const handleAddProduct = () => {
    const stockValue = Number(newStock);
    if (!newName.trim() || !newStock || stockValue <= 0) {
      setFormMessage("Isi semua field produk dengan benar.");
      return;
    }

    addProduct({
      name: newName.trim(),
      category: newCategory,
      unit: newUnit,
      stock: stockValue,
    });

    setFormMessage("");
    setNewName("");
    setNewCategory("SEMBAKO");
    setNewUnit("PACK");
    setNewStock("");
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout title="Katalog Produk">
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 min-h-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Katalog Produk</h2>
            <p className="text-gray-400 font-medium mt-1">{products.length} produk terdaftar</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-brand hover:bg-[#4a3ae0] text-white px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} strokeWidth={2.5} />
            Tambah
          </button>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-5 rounded-3xl bg-white border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-200"
            >
              <div className="flex items-center gap-5">
                {/* ID Badge */}
                <div className="bg-[#f0ece5] text-gray-500 w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs">
                  <span className="text-[10px] uppercase opacity-70">ID</span>
                  {product.id}
                </div>
                
                {/* Name & Category */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs font-bold text-gray-400 tracking-wider mt-0.5 uppercase">{product.category}</p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-6 pr-2">
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">{product.stock}</span>
                  <span className="text-xs font-bold text-gray-400 ml-1.5">{product.unit}</span>
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === product.id && (
                    <div className="absolute right-0 top-12 w-44 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 py-2.5 z-10 animate-in fade-in zoom-in-95 duration-200">
                      <button 
                        onClick={() => {
                          setDetailModalProduct(product);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <Eye size={16} className="text-gray-500" strokeWidth={2.5} />
                        Lihat Detail
                      </button>
                      <button 
                        onClick={() => {
                          setEditModalProduct(product);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-5 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <Pencil size={16} className="text-gray-500" strokeWidth={2.5} />
                        Edit Barang
                      </button>
                      <button className="w-full text-left px-5 py-3 text-[13px] font-medium text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors mt-1 pt-3 border-t border-gray-50">
                        <Trash2 size={16} strokeWidth={2.5} />
                        Hapus Barang
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tambah Barang */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#d9d4cd]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-9 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-2xl font-bold text-gray-900">Tambah Barang</h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Warning text */}
            <div className="flex items-start gap-2 mb-8 text-[#f05252]">
              <AlertCircle size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" />
              <p className="text-[12px] font-medium leading-tight">
                Mohon pastikan semua formulir di bawah ini diisi dengan lengkap.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5">
              {/* Nama Barang */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Nama Barang (Nama_Barang)
                </label>
                <input 
                  type="text"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Masukkan nama produk..."
                  className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Kategori & Satuan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={newCategory}
                      onChange={(event) => setNewCategory(event.target.value)}
                      className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none cursor-pointer"
                    >
                      <option value="SEMBAKO">SEMBAKO</option>
                      <option value="ELEKTRONIK">ELEKTRONIK</option>
                      <option value="KEBERSIHAN">KEBERSIHAN</option>
                    </select>
                    <ChevronDown size={16} strokeWidth={3} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Satuan
                  </label>
                  <div className="relative">
                    <select
                      value={newUnit}
                      onChange={(event) => setNewUnit(event.target.value)}
                      className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none cursor-pointer"
                    >
                      <option value="PACK">PACK</option>
                      <option value="PCS">PCS</option>
                      <option value="KG">KG</option>
                    </select>
                    <ChevronDown size={16} strokeWidth={3} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Stok Awal */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Stok Awal (Stok)
                </label>
                <input 
                  type="number"
                  value={newStock}
                  onChange={(event) => setNewStock(event.target.value)}
                  placeholder="Masukkan kuantitas stok..."
                  className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-600 font-medium focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {formMessage && <p className="text-sm text-red-500 text-center">{formMessage}</p>}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleAddProduct}
              className="w-full bg-brand hover:bg-[#4a3ae0] text-white rounded-full py-3.5 font-bold text-[14px] mt-8 shadow-[0_4px_12px_-4px_rgba(91,74,251,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(91,74,251,0.6)] transition-all duration-200"
            >
              Simpan Barang
            </button>
          </div>
        </div>
      )}

      {/* Modal Lihat Detail */}
      {detailModalProduct && (
        <div className="fixed inset-0 bg-[#d9d4cd]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-[28rem] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[12px] font-bold text-gray-400 tracking-wider uppercase">Informasi Produk</h3>
              <button 
                onClick={() => setDetailModalProduct(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Product Header Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="bg-[#f0ece5] text-gray-600 w-[72px] h-[72px] rounded-[1.25rem] flex flex-col items-center justify-center font-bold text-sm">
                <span className="text-[10px] uppercase opacity-60 mb-0.5">ID</span>
                {detailModalProduct.id}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{detailModalProduct.name}</h2>
                <p className="text-[11px] font-bold text-brand tracking-wider uppercase">{detailModalProduct.category}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#fbfaf8] rounded-2xl p-5 border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Stok Tersedia</p>
                <p className="text-3xl font-black text-gray-900">{detailModalProduct.stock}</p>
              </div>
              <div className="bg-[#fbfaf8] rounded-2xl p-5 border border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">Satuan Barang</p>
                <p className="text-2xl font-black text-gray-900 mt-1">{detailModalProduct.unit}</p>
              </div>
            </div>

            {/* Aktivitas Terakhir */}
            <div className="mb-10">
              <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3 ml-1">Aktivitas Terakhir</p>
              <div className="bg-[#fbfaf8] rounded-2xl p-4 px-5 border border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#f05252]"></div>
                  <p className="text-[13px] font-bold text-gray-900">Keluar (2 PACK)</p>
                </div>
                <p className="text-[12px] font-bold text-gray-400">2026-05-08</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setDetailModalProduct(null)}
                className="flex-1 bg-[#f4f3f1] hover:bg-[#ebe9e5] text-gray-600 rounded-2xl py-3.5 font-bold text-[14px] transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={() => {
                  setEditModalProduct(detailModalProduct);
                  setDetailModalProduct(null);
                }}
                className="flex-[1.5] bg-brand hover:bg-[#4a3ae0] text-white rounded-2xl py-3.5 font-bold text-[14px] shadow-[0_4px_12px_-4px_rgba(91,74,251,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(91,74,251,0.6)] transition-all duration-200"
              >
                Edit Barang
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Edit Barang */}
      {editModalProduct && (
        <div className="fixed inset-0 bg-[#d9d4cd]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-9 w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-2xl font-bold text-gray-900">Edit Informasi Barang</h3>
              <button 
                onClick={() => setEditModalProduct(null)} 
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Info text */}
            <div className="flex items-start gap-2 mb-8 text-brand">
              <Info size={15} strokeWidth={2.5} className="mt-0.5 flex-shrink-0" />
              <p className="text-[12px] font-medium leading-tight">
                Ubah rincian informasi produk sesuai kebutuhan terbaru.
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-5">
              
              {/* Nama Barang */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Nama Barang
                </label>
                <input 
                  type="text" 
                  defaultValue={editModalProduct.name}
                  className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>

              {/* Kategori & Satuan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Kategori
                  </label>
                  <div className="relative">
                    <select 
                      defaultValue={editModalProduct.category}
                      className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none cursor-pointer"
                    >
                      <option value="SEMBAKO">SEMBAKO</option>
                      <option value="ELEKTRONIK">ELEKTRONIK</option>
                      <option value="KEBERSIHAN">KEBERSIHAN</option>
                    </select>
                    <ChevronDown size={16} strokeWidth={3} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                    Satuan
                  </label>
                  <div className="relative">
                    <select 
                      defaultValue={editModalProduct.unit}
                      className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all appearance-none cursor-pointer"
                    >
                      <option value="PACK">PACK</option>
                      <option value="PCS">PCS</option>
                      <option value="KG">KG</option>
                    </select>
                    <ChevronDown size={16} strokeWidth={3} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Stok Awal */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                  Stok (Stok)
                </label>
                <input 
                  type="number" 
                  defaultValue={editModalProduct.stock}
                  className="w-full bg-[#faf9f7] border border-gray-100 rounded-[1.25rem] px-5 py-4 text-[13px] text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-brand hover:bg-[#4a3ae0] text-white rounded-full py-3.5 font-bold text-[14px] mt-8 shadow-[0_4px_12px_-4px_rgba(91,74,251,0.5)] hover:shadow-[0_6px_16px_-4px_rgba(91,74,251,0.6)] transition-all duration-200">
              Perbarui Barang
            </button>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
