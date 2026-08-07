"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { VariantOptionForm, VariantForm } from "./types";
import { FormInput } from "@/components/form/FormInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface VariantSectionProps {
  options: VariantOptionForm[];
  setOptions: React.Dispatch<React.SetStateAction<VariantOptionForm[]>>;
  variants: VariantForm[];
  setVariants: React.Dispatch<React.SetStateAction<VariantForm[]>>;
}

export default function VariantSection({
  options,
  setOptions,
  variants,
  setVariants,
}: VariantSectionProps) {
  const [optionName, setOptionName] = useState("");
  const [optionValues, setOptionValues] = useState("");

  // Add a new variant option (e.g. Size: S, M, L)
  const handleAddOption = () => {
    if (!optionName.trim() || !optionValues.trim()) return;

    const values = optionValues
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);

    if (values.length === 0) return;

    const newOption: VariantOptionForm = {
      name: optionName.trim(),
      values,
    };

    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    setOptionName("");
    setOptionValues("");

    // Auto-generate variants matrix from updated options
    generateVariantMatrix(updatedOptions);
  };

  // Remove an option
  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    generateVariantMatrix(updatedOptions);
  };

  // Generate Cartesian product matrix of variants from options
  const generateVariantMatrix = (opts: VariantOptionForm[]) => {
    if (opts.length === 0) {
      setVariants([]);
      return;
    }

    // Helper to generate Cartesian product
    const cartesian = (
      acc: Record<string, string>[],
      option: VariantOptionForm
    ) => {
      if (acc.length === 0) {
        return option.values.map((v) => ({ [option.name]: v }));
      }
      const res: Record<string, string>[] = [];
      acc.forEach((existing) => {
        option.values.forEach((v) => {
          res.push({ ...existing, [option.name]: v });
        });
      });
      return res;
    };

    let combinations: Record<string, string>[] = [];
    opts.forEach((opt) => {
      combinations = cartesian(combinations, opt);
    });

    // Preserve existing stock/price values where possible
    const existingMap = new Map(variants.map((v) => [v.sku, v]));

    const newVariants: VariantForm[] = combinations.map((comb) => {
      const parts = Object.entries(comb).map(([k, v]) => `${k}-${v}`);
      const sku = parts.join("_").toUpperCase().replace(/\s+/g, "");
      const title = Object.values(comb).join(" / ");

      const existing = existingMap.get(sku);

      return {
        sku,
        title,
        options: comb,
        price: existing?.price,
        stockQuantity: existing?.stockQuantity || 0,
        imageIndex: existing?.imageIndex || 0,
      };
    });

    setVariants(newVariants);
  };

  // Update a single variant field in the matrix
  const handleUpdateVariant = (
    index: number,
    field: keyof VariantForm,
    value: any
  ) => {
    const updated = [...variants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setVariants(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
          5
        </span>
        Product Variants (Optional)
      </h2>

      {/* Option Creator Form — using FormInput & Button UI components */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Add Variant Option (e.g., Color, Size)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <FormInput
              label="Option Name"
              placeholder="e.g. Size"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
            />
          </div>
          <div className="sm:col-span-6">
            <FormInput
              label="Values (comma separated)"
              placeholder="e.g. Small, Medium, Large"
              value={optionValues}
              onChange={(e) => setOptionValues(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="button"
              onClick={handleAddOption}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer h-9"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* Active Options Chips — using Badge component */}
      {options.length > 0 && (
        <div className="space-y-2">
          <span className="block text-sm font-medium text-slate-700">
            Configured Options
          </span>
          <div className="flex flex-wrap gap-2">
            {options.map((opt, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="bg-white border-slate-200 text-slate-800 px-3 py-1 text-sm flex items-center gap-2 shadow-xs"
              >
                <span className="font-semibold">{opt.name}:</span>
                <span className="text-slate-600">{opt.values.join(", ")}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Generated Variant Matrix — using Input UI component */}
      {variants.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="block text-sm font-medium text-slate-700">
              Generated Variants Matrix ({variants.length})
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Auto-synced
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs bg-white">
            <Table className="text-xs">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="p-3 text-slate-700 font-semibold">Variant</TableHead>
                  <TableHead className="p-3 text-slate-700 font-semibold">SKU</TableHead>
                  <TableHead className="p-3 w-28 text-slate-700 font-semibold">Custom Price ($)</TableHead>
                  <TableHead className="p-3 w-24 text-slate-700 font-semibold">Stock</TableHead>
                  <TableHead className="p-3 w-24 text-slate-700 font-semibold">Img Index</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((v, idx) => (
                  <TableRow key={v.sku} className="hover:bg-slate-50/50">
                    <TableCell className="p-3 font-medium text-slate-900">
                      {v.title}
                    </TableCell>
                    <TableCell className="p-3 font-mono text-[11px] text-slate-500">
                      {v.sku}
                    </TableCell>
                    <TableCell className="p-3">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Default"
                        value={v.price ?? ""}
                        onChange={(e) =>
                          handleUpdateVariant(
                            idx,
                            "price",
                            e.target.value
                              ? Number(e.target.value)
                              : undefined
                          )
                        }
                        className="h-7 text-xs"
                      />
                    </TableCell>
                    <TableCell className="p-3">
                      <Input
                        type="number"
                        value={v.stockQuantity}
                        onChange={(e) =>
                          handleUpdateVariant(
                            idx,
                            "stockQuantity",
                            Number(e.target.value)
                          )
                        }
                        className="h-7 text-xs"
                      />
                    </TableCell>
                    <TableCell className="p-3">
                      <Input
                        type="number"
                        min="0"
                        value={v.imageIndex}
                        onChange={(e) =>
                          handleUpdateVariant(
                            idx,
                            "imageIndex",
                            Number(e.target.value)
                          )
                        }
                        className="h-7 text-xs"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
