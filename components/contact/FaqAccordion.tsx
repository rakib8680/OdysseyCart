"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Orders & Shipping",
    question: "How long will it take to receive my order?",
    answer:
      "Standard domestic shipping takes 3–5 business days. Express shipping options (1–2 business days) are available at checkout. Once shipped, you will receive a tracking link via email.",
  },
  {
    category: "Orders & Shipping",
    question: "Can I modify or cancel my order after placing it?",
    answer:
      "Orders are processed quickly to ensure fast delivery. If you need to change your order details or shipping address, please contact our support team immediately. Once an order status is updated to 'Shipped', modifications are no longer possible.",
  },
  {
    category: "Returns & Refunds",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy for all unworn, unused items in original packaging. Simply contact us with your order number to initiate a return shipping label.",
  },
  {
    category: "Payment & Security",
    question: "Which payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards (Visa, MasterCard, American Express, Discover) processed securely through Stripe. We never store raw card credentials on our servers.",
  },
  {
    category: "Account & Wishlist",
    question: "Do I need an account to place an order?",
    answer:
      "No, guest checkout is supported. However, creating a free OdysseyCart account allows you to save shipping addresses, track order histories in real time, and curate product wishlists.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 overflow-hidden shadow-xs">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          const contentId = `faq-answer-${idx}`;
          return (
            <div key={idx} className="transition-colors">
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div className="pr-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-600" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div
                  id={contentId}
                  className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/20"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
