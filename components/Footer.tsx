import Link from "next/link";
import {
  Compass,
  Twitter,
  Instagram,
  Youtube,
  Github,
  Globe,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-20 pb-8 px-4 sm:px-6 lg:px-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
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
              href="/items"
              className="hover:text-emerald-400 transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/items?category=Tech"
              className="hover:text-emerald-400 transition-colors"
            >
              Tech Essentials
            </Link>
            <Link
              href="/items?category=Furniture"
              className="hover:text-emerald-400 transition-colors"
            >
              Modern Furniture
            </Link>
            <Link
              href="/items?category=Accessories"
              className="hover:text-emerald-400 transition-colors"
            >
              Daily Accessories
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              New Arrivals
            </Link>
          </div>

          {/* Links Column 2: Support */}
          <div className="flex flex-col space-y-4 text-sm">
            <h4 className="text-white font-semibold mb-2">Support</h4>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Help Center
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Track Order
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Returns & Exchanges
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Shipping Info
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Links Column 3: Company */}
          <div className="flex flex-col space-y-4 text-sm">
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
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
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-500">
          <p>© 2026 OdysseyCart. All rights reserved.</p>
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
