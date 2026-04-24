export const metadata = {
  title: 'About | OdysseyCart',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-24">
      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-8">About OdysseyCart</h1>
      <div className="prose prose-lg text-slate-600 leading-relaxed space-y-6">
        <p>
          Welcome to OdysseyCart, where precision engineering meets modern life.
        </p>
        <p>
          This application is a next-generation e-commerce platform built with <strong>Next.js (App Router)</strong> and <strong>Firebase</strong> for seamless, secure user experiences.
        </p>
        <div className="mt-12 p-6 bg-slate-100 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h2>
          <p className="text-base text-slate-600">To provide a curated collection of premium tech, minimalist furniture, and everyday carry essentials designed for those who appreciate geometric balance.</p>
        </div>
      </div>
    </div>
  );
}
