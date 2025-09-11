import "./globals.css";
import type { Metadata } from "next";
import Navbar from "components/Navbar";

export const metadata: Metadata = {
  title: "Student Management",
  description: "Next.js 15 + TS + Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-dvh bg-gray-50 text-gray-900">
        <div className="max-w-6xl mx-auto p-4">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
