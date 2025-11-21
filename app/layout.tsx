import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Lexend } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/header";

export const metadata: Metadata = {
  title: "Worklance - Job Portal",
  description: "Job Portal",
};

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {" "}
          <Navbar />
          {children} <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
