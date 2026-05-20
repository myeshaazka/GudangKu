export const STORAGE_KEY = "gudangku-riwayat";

export const products = [
  { value: "1", label: "Beras Wangi 5kg", category: "SEMBAKO", unit: "PACK" },
  { value: "2", label: "Minyak Goreng 2L", category: "SEMBAKO", unit: "PACK" },
];

export function getHistoryFromStorage() {
  if (typeof window === "undefined") return [];

  const item = window.localStorage.getItem(STORAGE_KEY);
  if (!item) return [];

  try {
    return JSON.parse(item);
  } catch (error) {
    console.error("Failed to parse history storage", error);
    return [];
  }
}

export function addHistoryItem(item) {
  if (typeof window === "undefined") return;

  const history = getHistoryFromStorage();
  const nextHistory = [item, ...history];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
  return nextHistory;
}
