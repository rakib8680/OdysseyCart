import { Skeleton } from "@/components/ui/skeleton";

export function ProductFormSkeleton() {
  return (
    <div className="space-y-10">
      {/* Two-column layout on desktop to match AddProductForm */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="space-y-10">
          {/* Card 1: Basic Information */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Title */}
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Full Description */}
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-[110px] w-full rounded-lg" />
              </div>

              {/* Tags */}
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
                <Skeleton className="h-3 w-72" />
              </div>
            </div>
          </div>

          {/* Card 2: Media */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-[50px] w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-10">
          {/* Card 3: Pricing & Inventory */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-44" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Discount */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-[50px] w-full rounded-lg" />
              </div>

              {/* Featured Toggle */}
              <div className="md:col-span-2 flex items-center gap-3 pt-2 border-t border-slate-100">
                <Skeleton className="w-5 h-5 rounded" />
                <Skeleton className="h-4 w-80" />
              </div>
            </div>
          </div>

          {/* Card 4: Specifications & Details */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 md:mt-16">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-6 w-52" />
            </div>

            <div className="space-y-6">
              {/* Specs Textarea */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-[110px] w-full rounded-lg" />
                <Skeleton className="h-3 w-80" />
              </div>

              {/* Weight & Dimensions */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <div className="grid grid-cols-4 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-[50px] w-full rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty + Shipping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-[50px] w-full rounded-lg" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-[50px] w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 pt-2">
        <Skeleton className="h-[50px] w-28 rounded-xl" />
        <Skeleton className="h-[50px] w-40 rounded-xl" />
      </div>
    </div>
  );
}
