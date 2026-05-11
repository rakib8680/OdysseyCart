interface ProductSpecsProps {
  specs: Record<string, string>;
}

export default function ProductSpecs({ specs }: ProductSpecsProps) {
  const entries = Object.entries(specs);

  if (entries.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="font-bold text-slate-900 mb-4">Specifications</h3>
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className={`flex justify-between px-4 py-3 text-sm ${
              i % 2 === 0 ? "bg-slate-50" : "bg-white"
            }`}
          >
            <span className="font-medium text-slate-700">{key}</span>
            <span className="text-slate-500">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
