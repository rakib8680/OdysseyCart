import Link from 'next/link';

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="max-w-6xl mx-auto px-8 py-16">
      <Link href="/items" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Placeholder: Image Gallery */}
        <div className="w-full aspect-square bg-slate-100 rounded-3xl border border-slate-200 flex items-center justify-center">
            <span className="text-slate-400 font-medium">Product Image Placeholder</span>
        </div>

        {/* Placeholder: Product Info */}
        <div className="flex flex-col justify-center">
          <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-semibold uppercase tracking-wider w-fit mb-4">
            Category Tag
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Product Name ({resolvedParams.id})</h1>
          <p className="text-2xl font-medium text-slate-700 mb-6">$0.00</p>
          
          <div className="prose text-slate-600 mb-8">
            <p>Full description of the product going into detail about its geometric balance and premium build quality.</p>
          </div>

          <div className="space-y-4 mb-8 border-y border-slate-100 py-6">
             <h3 className="font-bold text-slate-900">Specifications</h3>
             <ul className="text-sm text-slate-600 space-y-2">
               <li><span className="font-medium text-slate-900">Material:</span> Premium Grade</li>
               <li><span className="font-medium text-slate-900">Dimensions:</span> Standard</li>
             </ul>
          </div>

          <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
