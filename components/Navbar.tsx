"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Items", href: "/items" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
  ];

  return (
    <nav className="sticky top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-50">
      <div className="flex items-center space-x-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
            O
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ODYSSEY CART
          </span>
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          {navLinks.map((link) => {
            // Determine if the link is active based on exact match for home, or starting with the path for sub-routes
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`py-5 transition-colors border-b-2 bg-transparent ${
                  isActive
                    ? "text-emerald-600 border-emerald-600"
                    : "text-slate-500 border-transparent hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* We will implement authentication state later. For now, public view or static user */}
        <Link
          href="/login"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Login
        </Link>
        <Link
          href="/login"
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
