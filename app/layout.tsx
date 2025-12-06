import type { Metadata } from "next";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Lexend } from "next/font/google";
import PageLayout from "@/components/layouts/page-layout";

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
        <Head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-T2DQBH37TP"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-T2DQBH37TP');
            `,
            }}
          />
        </Head>
        <body className="antialiased">
          <PageLayout>{children}</PageLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
