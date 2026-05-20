"use client";

import { createContext, useContext, useState } from "react";

const AppStateContext = createContext(null);

const initialProducts = [
  { id: "001", name: "Beras Wangi 5kg", category: "SEMBAKO", stock: 5, unit: "PACK" },
  { id: "002", name: "Minyak Goreng 2L", category: "SEMBAKO", stock: 5, unit: "PACK" },
  { id: "003", name: "Sabun Cuci Piring", category: "KEBERSIHAN", stock: 12, unit: "PACK" },
  { id: "004", name: "Tepung Terigu 1kg", category: "SEMBAKO", stock: 8, unit: "PACK" },
];

const initialTransactions = [
  {
    id: 1,
    type: "masuk",
    productName: "Beras Wangi 5kg",
    category: "SEMBAKO",
    qty: 5,
    unit: "PACK",
    user: "Myesha Azka",
    role: "OPERATOR",
    date: "2026-05-08",
  },
  {
    id: 2,
    type: "keluar",
    productName: "Minyak Goreng 2L",
    category: "SEMBAKO",
    qty: 2,
    unit: "PACK",
    user: "Myesha Azka",
    role: "OPERATOR",
    date: "2026-05-08",
  },
];

export function AppStateProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);

  const addProduct = (product) => {
    const nextId = products.reduce((maxId, item) => {
      const numericId = Number(item.id);
      return Number.isNaN(numericId) ? maxId : Math.max(maxId, numericId);
    }, 0);
    const nextProduct = {
      id: String(nextId + 1).padStart(3, "0"),
      ...product,
    };
    setProducts((prev) => [...prev, nextProduct]);
  };

  const addTransaction = (transaction) => {
    const nextTransaction = {
      id: Date.now(),
      ...transaction,
    };
    setTransactions((prev) => [nextTransaction, ...prev]);
  };

  return (
    <AppStateContext.Provider value={{ products, transactions, addProduct, addTransaction }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }
  return context;
}
