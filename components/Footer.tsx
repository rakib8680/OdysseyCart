import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto py-8 px-8 w-full bg-white border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400 font-medium">
      <p>© 2024 Odyssey Next.js Assessment. Built for performance.</p>
      <div className="flex space-x-6">
        <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
        <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
        <Link href="#" className="hover:text-slate-900 transition-colors">Documentation</Link>
      </div>
    </footer>
  );
}
