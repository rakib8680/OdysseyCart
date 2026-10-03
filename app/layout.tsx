import type { Metadata } from "next";
import { Urbanist, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";
import { constructMetadata } from "@/lib/utils/seo";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "font-sans antialiased",
        plusJakartaSans.variable,
        urbanist.variable
      )}
    >
      <body className="bg-white text-slate-900 font-sans flex flex-col min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
