import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // I've added your font back
import "./globals.css";
import { AuthProvider } from '@/context/AuthContext'; // Import the provider

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "SAMS - Student Accommodation Management System",
  description: "The all-in-one platform for accommodation compliance, tracking, and data-driven insights.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* The AuthProvider now wraps all of your pages */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}