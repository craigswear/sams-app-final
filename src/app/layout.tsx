import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext';
const poppins = Poppins({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });
export const metadata: Metadata = {
  title: "SAMS - Student Accommodation Management System",
  description: "The all-in-one platform for accommodation compliance, tracking, and data-driven insights.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={poppins.className}><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}