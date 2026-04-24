import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 w-full h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-50">
      <div className="flex items-center space-x-10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
            O
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            ODYSSEY CART
          </span>
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-slate-500">
          <Link
            href="/"
            className="text-emerald-600 border-b-2 border-emerald-600 py-5"
          >
            Home
          </Link>
          <Link
            href="/items"
            className="hover:text-slate-900 transition-colors py-5"
          >
            Items
          </Link>
          <Link
            href="/categories"
            className="hover:text-slate-900 transition-colors py-5"
          >
            Categories
          </Link>
          <Link
            href="/about"
            className="hover:text-slate-900 transition-colors py-5"
          >
            About
          </Link>
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
