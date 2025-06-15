import type { Metadata } from "next";
import { Poppins } from "next/font/google";
// The import for './globals.css' is now removed
import { AuthProvider } from '@/context/AuthContext';

const poppins = Poppins({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: "SAMS - Student Accommodation Management System",
  description: "The all-in-one platform for accommodation compliance, tracking, and data-driven insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* The global styles are now included directly here */}
        <style jsx global>{`
          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
          }
          html,
          body {
            max-width: 100vw;
            overflow-x: hidden;
          }
          a {
            color: inherit;
            text-decoration: none;
          }
        `}</style>
      </head>
      <body className={poppins.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}