import { Shield, Truck, Weight, Ruler, Package } from "lucide-react";
import { Product } from "@/lib/types/product";

interface KeyInformationProps {
  product: Product;
}

export default function KeyInformation({ product }: KeyInformationProps) {
  return (
    <div className="space-y-3 mb-8 border-y border-slate-100 py-6">
      <h3 className="font-bold text-slate-900 mb-4">Key Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        
        <InfoCard
          icon={<Package className="w-5 h-5 text-emerald-600 shrink-0" />}
          label="Availability"
          value={
            product.stockQuantity > 0
              ? `In Stock (${product.stockQuantity} units)`
              : "Out of Stock"
          }
        />

        <InfoCard
          icon={<Truck className="w-5 h-5 text-emerald-600 shrink-0" />}
          label="Shipping"
          value={product.shippingInfo || "Free Standard Shipping"}
        />

        {product.warranty && (
          <InfoCard
            icon={<Shield className="w-5 h-5 text-emerald-600 shrink-0" />}
            label="Warranty"
            value={product.warranty}
          />
        )}

        {product.weight > 0 && (
          <InfoCard
            icon={<Weight className="w-5 h-5 text-emerald-600 shrink-0" />}
            label="Weight"
            value={`${product.weight} kg`}
          />
        )}

        {product.dimensions &&
          (product.dimensions.length > 0 ||
            product.dimensions.width > 0 ||
            product.dimensions.height > 0) && (
            <InfoCard
              icon={<Ruler className="w-5 h-5 text-emerald-600 shrink-0" />}
              label="Dimensions"
              value={`${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} cm`}
            />
          )}
      </div>
    </div>
  );
}

// Reusable card for each info item — keeps the grid DRY
function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
      {icon}
      <div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-slate-500">{value}</p>
      </div>
    </div>
  );
}
