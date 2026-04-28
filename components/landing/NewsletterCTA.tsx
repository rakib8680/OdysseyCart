"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast.success("Welcome to the Odyssey!", {
        description: "Your 10% off code has been sent to your email.",
      });
    }, 1000);
  };

  return (
    <section className="relative w-full">
      {/* Background Split: Top half white, bottom half slate-950 (matches footer) */}
      <div className="absolute inset-0 flex flex-col">
        <div className="h-1/2 w-full bg-white" />
        <div className="h-1/2 w-full bg-slate-950" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        
        {/* The Floating Dark Island */}
        <div className="relative bg-slate-900 rounded-[3rem] p-10 md:p-20 shadow-2xl overflow-hidden isolation-auto">
          
          {/* Decorative Glowing Spheres */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            
            {/* Text Content */}
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                Join the Odyssey.
              </h2>
              <p className="text-xl text-slate-400 mb-0">
                Subscribe to our private newsletter to receive early access to new curated drops and <span className="text-emerald-400 font-semibold">10% off</span> your first order.
              </p>
            </div>

            {/* Newsletter Form */}
            <div className="w-full max-w-md shrink-0">
              <form onSubmit={handleSubmit} className="flex relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-12 pr-36 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all backdrop-blur-md"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full transition-all flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
              <p className="text-xs text-slate-500 mt-4 text-center md:text-left">
                By subscribing, you agree to our Terms of Service. No spam, ever.
              </p>
            </div>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}
