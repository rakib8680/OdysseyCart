"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import {
  ArrowLeft,
  Search,
  Compass,
  ShoppingBag,
  User,
  HelpCircle,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/items?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes float-needle {
          0%,
          100% {
            transform: rotate(-10deg) scale(1.02);
          }
          50% {
            transform: rotate(15deg) scale(0.98);
          }
        }
        @keyframes orbit-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse-subtle {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        .animate-float-needle {
          animation: float-needle 6s ease-in-out infinite;
        }
        .animate-orbit-slow {
          animation: orbit-slow 40s linear infinite;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 4s ease-in-out infinite;
        }
      `}</style>

      {/* <Navbar /> */}
      <main className="flex-1 w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden py-16 lg:py-24">
        {/* Geometric Background Elements matching Site Hero */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full border border-emerald-100  lg:block pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full border border-slate-200  lg:block pointer-events-none"></div>

        <div className="max-w-3xl w-full px-4 text-center z-10 flex flex-col items-center">
          {/* Animated Vector Compass Illustration */}
          <div className="relative mb-8 flex justify-center w-full max-w-[280px] aspect-square">
            {/* Soft Pulsing Backdrop Glow */}
            <div className="absolute inset-0 bg-emerald-50 rounded-full blur-xl animate-pulse-subtle"></div>
            <div className="absolute inset-4 bg-slate-100 rounded-full blur-lg"></div>

            {/* SVG Interactive/Pulsing Navigation Map */}
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full text-slate-800 relative z-10 drop-shadow-md"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Starfield coordinates */}
              <circle
                cx="100"
                cy="100"
                r="85"
                className="stroke-slate-200/60"
                strokeWidth="1"
                strokeDasharray="3 6"
              />
              <circle
                cx="100"
                cy="100"
                r="72"
                className="stroke-slate-200"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />

              {/* Inner Compass Ring */}
              <circle
                cx="100"
                cy="100"
                r="58"
                className="stroke-slate-300 animate-orbit-slow origin-[100px_100px]"
                style={{ transformOrigin: "100px 100px" }}
                strokeWidth="2"
              />

              {/* Star Constellations */}
              <circle
                cx="45"
                cy="55"
                r="1.5"
                className="fill-emerald-400 stroke-none animate-pulse"
              />
              <circle
                cx="155"
                cy="145"
                r="1.5"
                className="fill-emerald-400 stroke-none animate-pulse"
              />
              <circle
                cx="145"
                cy="45"
                r="2"
                className="fill-slate-400 stroke-none"
              />
              <circle
                cx="55"
                cy="155"
                r="2"
                className="fill-slate-400 stroke-none"
              />

              {/* Cardinal Navigation Letters */}
              <text
                x="96"
                y="32"
                className="fill-slate-400 font-sans text-xs select-none"
              >
                N
              </text>
              <text
                x="97"
                y="176"
                className="fill-slate-400 font-sans text-xs select-none"
              >
                S
              </text>
              <text
                x="170"
                y="103"
                className="fill-slate-400 font-sans text-xs select-none"
              >
                E
              </text>
              <text
                x="24"
                y="103"
                className="fill-slate-400 font-sans text-xs select-none"
              >
                W
              </text>

              {/* Recalculating Path representation */}
              <path
                d="M 60,130 Q 75,70 100,100 T 140,70"
                className="stroke-emerald-400/80"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />

              {/* Pulsing Target Coordinates Node */}
              <circle
                cx="140"
                cy="70"
                r="5"
                className="fill-emerald-500 stroke-white stroke-2 animate-pulse"
                style={{ transformOrigin: "140px 70px" }}
              />
              <circle
                cx="140"
                cy="70"
                r="10"
                className="stroke-emerald-500/30 stroke-1 animate-ping"
                style={{ transformOrigin: "140px 70px" }}
              />

              {/* Compass Needle with Float Animation */}
              <g
                className="animate-float-needle origin-[100px_100px]"
                style={{ transformOrigin: "100px 100px" }}
              >
                {/* Pointer North (Emerald Color Accent) */}
                <path
                  d="M 100,100 L 100,45 L 110,100 Z"
                  className="fill-emerald-600 stroke-emerald-600"
                />
                <path
                  d="M 100,100 L 100,45 L 90,100 Z"
                  className="fill-emerald-500 stroke-emerald-500"
                />

                {/* Pointer South (Slate Color Accent) */}
                <path
                  d="M 100,100 L 100,155 L 110,100 Z"
                  className="fill-slate-400 stroke-slate-400"
                />
                <path
                  d="M 100,100 L 100,155 L 90,100 Z"
                  className="fill-slate-300 stroke-slate-300"
                />

                {/* Dial Pivot Center */}
                <circle
                  cx="100"
                  cy="100"
                  r="8"
                  className="fill-white stroke-slate-800"
                  strokeWidth="2.5"
                />
                <circle cx="100" cy="100" r="3" className="fill-emerald-600" />
              </g>
            </svg>
          </div>

          {/* Heading Messages */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-100 mb-4 animate-fade-in">
            <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:10s]" />
            Error 404 — Path Unresolved
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Destination <span className="text-emerald-600">Uncharted</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
            The page you are looking for has migrated, dissolved, or never
            existed in this coordinates system. Let's recalculate your route.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="w-full max-w-md relative mb-12"
          >
            <input
              type="text"
              placeholder="Search products, categories, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-24 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 h-9 px-4 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Navigation Matrix Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
            <Link
              href="/items"
              className="flex flex-col items-center p-5 bg-white border border-slate-200 rounded-2xl text-center group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Browse Catalog
              </h3>
              <p className="text-xs text-slate-400">
                Explore premium minimalist gear
              </p>
            </Link>

            <Link
              href="/account"
              className="flex flex-col items-center p-5 bg-white border border-slate-200 rounded-2xl text-center group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                My Account
              </h3>
              <p className="text-xs text-slate-400">
                Manage orders and profile
              </p>
            </Link>

            <Link
              href="/contact"
              className="flex flex-col items-center p-5 bg-white border border-slate-200 rounded-2xl text-center group hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-950/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">
                Help Center
              </h3>
              <p className="text-xs text-slate-400">
                Get assistance from our team
              </p>
            </Link>
          </div>

          {/* Fallback buttons */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold hover:border-slate-800 transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-md shadow-emerald-950/10 hover:shadow-emerald-600/20 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <Suspense>
        <CartDrawer />
      </Suspense>
    </>
  );
}
