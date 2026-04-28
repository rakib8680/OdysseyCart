import { ProtectedRoute } from "@/components/ProtectedRoute";

export const metadata = { title: "Add Item | OdysseyCart" };

export default function AddItemPage() {
  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 min-h-screen">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">
          Add New Product
        </h1>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g., Ergonomic Chair"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Short Description (1-2 lines)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Brief summary for the product card"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Detailed product description..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Select Category</option>
                  <option value="furniture">Furniture</option>
                  <option value="tech">Tech</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-4">
              <button
                type="button"
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors shadow-lg hover:shadow-emerald-600/20"
              >
                Publish Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
