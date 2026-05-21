"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("gudangku_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    async function loadData() {
      try {
        const [productsResponse, transactionsResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/transactions"),
        ]);

        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          if (productsData.length > 0) {
            setProducts(productsData);
          }
        } else {
          console.error("Failed to load products from Neon:", productsResponse.status);
        }

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          setTransactions(transactionsData);
        } else {
          console.error("Failed to load transactions from Neon:", transactionsResponse.status);
        }
      } catch (error) {
        console.error("Failed to load data from Neon:", error);
      }
    }

    loadData();
  }, []);

  const login = async ({ email, password }) => {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (error) {
      payload = null;
    }

    if (!response.ok) {
      const message = payload?.error || text || "Gagal login.";
      throw new Error(message);
    }

    const user = payload || null;
    if (!user) {
      throw new Error("Respons login kosong dari server.");
    }

    setCurrentUser(user);
    window.localStorage.setItem("gudangku_user", JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem("gudangku_user");
  };

  const addProduct = async (product) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Gagal menyimpan produk ke Neon.");
    }

    const data = await response.json();
    setProducts((prev) => [...prev, data]);
    return data;
  };

  const updateProduct = async (product) => {
    const response = await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Gagal memperbarui produk.");
    }

    const data = await response.json();
    setProducts((prev) => prev.map((item) => (item.id === data.id ? data : item)));
    return data;
  };

  const deleteProduct = async (productId) => {
    const response = await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: productId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Gagal menghapus produk.");
    }

    await response.json();
    setProducts((prev) => prev.filter((item) => item.id !== productId));
    return true;
  };

  const addTransaction = async (transaction) => {
    const response = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...transaction,
        user: currentUser?.username ?? currentUser?.name ?? currentUser?.email ?? null,
        role: currentUser?.role ?? null,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Gagal menyimpan transaksi ke Neon.");
    }

    const data = await response.json();
    const nextTransaction = {
      id: data.id,
      ...transaction,
      user: currentUser?.username ?? currentUser?.name ?? currentUser?.email ?? null,
      role: currentUser?.role ?? null,
    };

    setTransactions((prev) => [nextTransaction, ...prev]);

    if (transaction.productId) {
      const delta = transaction.type === "masuk" ? Number(transaction.qty) : -Number(transaction.qty);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === transaction.productId
            ? { ...item, stock: Math.max(0, Number(item.stock) + delta) }
            : item
        )
      );
    }

    return nextTransaction;
  };

  const cancelTransaction = async (transactionId) => {
    const response = await fetch("/api/transactions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: transactionId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Gagal membatalkan transaksi.");
    }

    const data = await response.json();

    setTransactions((prev) => prev.filter((item) => item.id !== transactionId));

    if (data.productId) {
      setProducts((prev) =>
        prev.map((item) =>
          item.id === data.productId
            ? { ...item, stock: data.newStock ?? Math.max(0, Number(item.stock) + Number(data.delta)) }
            : item
        )
      );
    }

    return data;
  };

  return (
    <AppStateContext.Provider value={{ products, transactions, currentUser, login, logout, addProduct, updateProduct, deleteProduct, addTransaction, cancelTransaction }}>
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
