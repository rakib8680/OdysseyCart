import { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { MessageSquare, Headset } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us & Support — OdysseyCart",
  description:
    "Have a question about an order, product, or return? Reach out to our OdysseyCart customer support team or browse our frequently asked questions.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* ── Editorial Header Banner ── */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Headset className="w-3.5 h-3.5" />
            <span>Customer Care & Assistance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            We're Here to Help
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Have questions about an ongoing order, product availability, or custom requests? Our dedicated team is committed to providing prompt, attentive support.
          </p>
        </div>

        {/* ── Main Content 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Support Channels & FAQ */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Support Channels & Commitments
                </h2>
              </div>
              <ContactInfo />
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            <FaqAccordion />
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
