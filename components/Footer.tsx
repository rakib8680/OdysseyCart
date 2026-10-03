import Link from "next/link";
import {
  Compass,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Globe,
} from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/config/products";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-20 pb-8 border-t border-slate-900">
      <div className="app-container">
        {/* Main Grid: 6 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-16 mb-16">
          {/* Brand & Socials (Spans 2 columns) */}
          <div className="col-span-2 md:col-span-2 pr-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-white mb-6 group"
            >
              <Compass className="w-6 h-6 text-emerald-500 transition-transform group-hover:rotate-180 duration-700" />
              <span className="font-bold text-xl tracking-tight">
                OdysseyCart.
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs">
              Curating the world&apos;s finest artifacts for the modern
              lifestyle. Built for uncompromising performance and designed for
              timeless aesthetics.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column 1: Shop */}
          <div className="flex flex-col space-y-4 text-sm">
            <h4 className="text-white font-semibold mb-2">Shop</h4>
            <Link
              href="/categories"
              className="text-emerald-400 font-medium hover:text-emerald-300 transition-colors"
            >
              All Departments
            </Link>
            <Link
              href="/items"
              className="hover:text-emerald-400 transition-colors"
            >
              All Products
            </Link>
            {PRODUCT_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="hover:text-emerald-400 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/items?sort=newest"
              className="hover:text-emerald-400 transition-colors"
            >
              New Arrivals
            </Link>
          </div>

          {/* Links Column 2: Support */}
          <div className="flex flex-col space-y-4 text-sm">
            <h4 className="text-white font-semibold mb-2">Support</h4>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Help Center
            </Link>
            <Link
              href="/account/orders"
              className="hover:text-emerald-400 transition-colors"
            >
              Track Order
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Returns & Exchanges
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Shipping Info
            </Link>
            <Link
              href="/contact"
              className="hover:text-emerald-400 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          {/* Links Column 3: Company */}
          <div className="flex flex-col space-y-4 text-sm">
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <Link
              href="/about"
              className="hover:text-emerald-400 transition-colors"
            >
              About Us
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Careers
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Journal
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Store Locator
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Sustainability
            </Link>
          </div>

          {/* Links Column 4: Legal */}
          <div className="flex flex-col space-y-4 text-sm">
            <h4 className="text-white font-semibold mb-2">Legal</h4>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Cookie Policy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-500">
          <p>© 2026 OdysseyCart. All rights reserved.</p>

          {/* Supported Payment Badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-2"
            aria-label="Accepted payment methods"
          >
            <span className="h-6 px-2.5 rounded bg-white/6 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white tracking-wider italic">
              VISA
            </span>
            <span className="h-6 px-2.5 rounded bg-white/6 border border-white/10 flex items-center justify-center gap-1.5">
              <span className="flex -space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EB001B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F79E1B] opacity-90" />
              </span>
              <span className="text-[10px] font-medium text-slate-300">
                Mastercard
              </span>
            </span>
            <span className="h-6 px-2.5 rounded bg-white/6 border border-white/10 flex items-center justify-center text-[10px] font-bold text-sky-400 tracking-wider">
              AMEX
            </span>
            <span className="h-6 px-2.5 rounded bg-white/6 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-200">
              Pay<span className="text-sky-400">Pal</span>
            </span>
            <span className="h-6 px-2.5 rounded bg-white/6 border border-white/10 flex items-center justify-center text-[10px] font-medium text-slate-200">
              Apple Pay
            </span>
            <span className="h-6 px-2.5 rounded bg-white/6 border border-white/10 flex items-center justify-center text-[10px] font-medium text-slate-200">
              <span className="text-sky-400 font-bold">G</span> Pay
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button className="flex items-center hover:text-white transition-colors">
              <Globe className="w-4 h-4 mr-2" />
              United States (EN)
            </button>
            <span className="w-1 h-1 rounded-full bg-slate-800" />
            <button className="hover:text-white transition-colors">
              USD ($)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
