import { Inter } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "./AppStateProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GudangKu - Inventory Management",
  description: "Modern inventory management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
