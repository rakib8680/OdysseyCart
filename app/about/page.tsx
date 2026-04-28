import { Package, Shield, Zap, Globe } from "lucide-react";

export const metadata = {
  title: "About | OdysseyCart",
  description:
    "Learn about OdysseyCart — a premium e-commerce platform built for people who appreciate quality, design, and precision.",
};

const stats = [
  { value: "6+", label: "Curated Products" },
  { value: "3", label: "Product Categories" },
  { value: "100%", label: "Secure Auth" },
  { value: "Next.js", label: "Powered By" },
];

const values = [
  {
    icon: Package,
    title: "Curated Selection",
    description:
      "Every product is hand-picked for quality, design, and longevity. We don't believe in quantity over quality.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description:
      "Firebase-backed authentication ensures your account and data are always protected.",
  },
  {
    icon: Zap,
    title: "Built for Speed",
    description:
      "Next.js App Router with server-side rendering delivers lightning-fast page loads across every device.",
  },
  {
    icon: Globe,
    title: "Modern Stack",
    description:
      "Tailwind CSS, Shadcn UI, and Lucide icons power a UI that is consistent, accessible, and beautiful.",
  },
];

const techStack = [
  { name: "Next.js 15", role: "Framework" },
  { name: "React 19", role: "UI Library" },
  { name: "TypeScript", role: "Type Safety" },
  { name: "Tailwind CSS v4", role: "Styling" },
  { name: "Firebase v12", role: "Authentication" },
  { name: "Shadcn UI", role: "Components" },
  { name: "Sonner", role: "Notifications" },
  { name: "Vercel", role: "Deployment" },
];

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-24 md:py-32">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 mb-6">
            About OdysseyCart
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight mb-8">
            Built for people who
            <br />
            <span className="text-emerald-600">appreciate craft.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
            OdysseyCart is a premium e-commerce platform where precision
            engineering meets modern life. We curate the very best in tech,
            furniture, and everyday carry — designed for those who notice the
            details.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-slate-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">
                Our Mission
              </span>
              <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-6">
                Quality over everything.
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-6">
                We exist to make premium products accessible without compromise.
                Every item in our catalogue has been selected with a single
                question in mind — would we use this ourselves?
              </p>
              <p className="text-slate-500 text-lg leading-relaxed">
                From minimalist furniture to precision tech, our curation
                reflects a deep belief that the things you surround yourself
                with should be worthy of your attention.
              </p>
            </div>
            <div className="bg-slate-50 rounded-3xl p-10 border border-slate-200">
              <blockquote className="text-2xl font-semibold text-slate-800 leading-snug italic">
                &ldquo;Design is not just what it looks like and feels like.
                Design is how it works.&rdquo;
              </blockquote>
              <p className="mt-6 text-sm text-slate-500 font-medium">
                — Steve Jobs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-20">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">
              Our Values
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              What we stand for.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-5">
                  <value.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <div className="max-w-5xl mx-auto px-6 md:px-8 py-20">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-emerald-600 mb-4">
              Under the Hood
            </span>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Built with the best.
            </h2>
            <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">
              OdysseyCart is powered by a modern, production-grade stack
              designed for performance, scalability, and developer experience.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-200 hover:bg-emerald-50/30 transition-all duration-300"
              >
                <p className="font-bold text-slate-900 text-sm mb-1">
                  {tech.name}
                </p>
                <p className="text-xs text-slate-400 tracking-wide uppercase font-medium">
                  {tech.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
