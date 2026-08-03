import { Mail, Clock, MapPin, ShieldCheck } from "lucide-react";

export function ContactInfo() {
  const infoCards = [
    {
      icon: Mail,
      title: "Direct Email",
      value: "support@odysseycart.com",
      description: "We monitor inbox 7 days a week",
    },
    {
      icon: Clock,
      title: "Support Hours",
      value: "Mon – Fri: 9am – 6pm EST",
      description: "Weekend inquiries answered within 24h",
    },
    {
      icon: ShieldCheck,
      title: "Response Guarantee",
      value: "< 24 Hour Turnaround",
      description: "Priority queue for order & billing issues",
    },
    {
      icon: MapPin,
      title: "Headquarters",
      value: "New York, NY",
      description: "79 Madison Ave, 10th Floor",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {infoCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              {card.title}
            </h3>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              {card.value}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
