import { Suspense } from "react";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Navbar } from "@/components/Navbar";
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
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <Suspense>
        <CartDrawer />
      </Suspense>
    </>
  );
}

