import { Suspense } from "react";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <div className="relative isolate flex-1 flex flex-col">
        {/* Ambient Brand Top-Wash — signature emerald gradient across all routes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-120 bg-ambient-top -z-10"
        />
        <main className="flex-1 w-full">{children}</main>
      </div>
      <Footer />
      <Suspense>
        <CartDrawer />
      </Suspense>
    </>
  );
}

