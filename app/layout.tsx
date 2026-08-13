import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

import { constructMetadata } from "@/lib/utils/seo";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 font-sans flex flex-col min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
