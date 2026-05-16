import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
export default function LoadingItems() {
  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-full p-0 gap-0 border border-slate-200 overflow-hidden flex flex-col bg-white shadow-sm">
            <div className="w-full aspect-[4/3] border-b border-slate-100">
              <Skeleton className="w-full h-full rounded-none" />
            </div>
            <CardHeader className="p-5 pb-3">
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-7 w-3/4 mb-1" />
            </CardHeader>
            <CardContent className="p-5 pt-0 flex-grow">
              <div className="space-y-2 mt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
            <CardFooter className="p-5 pt-0 mt-auto border-0">
              <Skeleton className="w-full h-10 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
