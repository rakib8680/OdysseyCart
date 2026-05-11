import { UseFormRegister } from "react-hook-form";
import { ProductFormData } from "./types";

interface SpecsSectionProps {
  register: UseFormRegister<ProductFormData>;
  inputStyles: string;
  labelStyles: string;
}

export default function SpecsSection({
  register,
  inputStyles,
  labelStyles,
}: SpecsSectionProps) {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
          3
        </span>
        Specifications & Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specs */}
        <div className="md:col-span-2">
          <label className={labelStyles}>
            Specifications (one per line, Key: Value)
          </label>
          <textarea
            rows={4}
            className={inputStyles}
            placeholder={`Material: Aluminum\nBattery Life: 20 hours\nConnectivity: Bluetooth 5.3\nWater Resistance: IPX4`}
            {...register("specs")}
          ></textarea>
          <p className="text-slate-400 text-xs mt-1">
            Each line should be in &quot;Key: Value&quot; format. These will
            appear as a specifications table on the detail page.
          </p>
        </div>

        {/* Weight */}
        <div>
          <label className={labelStyles}>Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            className={inputStyles}
            placeholder="0.00"
            {...register("weight", {
              min: { value: 0, message: "Cannot be negative" },
            })}
          />
        </div>

        {/* Dimensions */}
        <div>
          <label className={labelStyles}>Dimensions (cm)</label>
          <div className="grid grid-cols-3 gap-3">
            <input
              type="number"
              step="0.1"
              className={inputStyles}
              placeholder="L"
              {...register("dimensionLength", {
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
            <input
              type="number"
              step="0.1"
              className={inputStyles}
              placeholder="W"
              {...register("dimensionWidth", {
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
            <input
              type="number"
              step="0.1"
              className={inputStyles}
              placeholder="H"
              {...register("dimensionHeight", {
                min: { value: 0, message: "Cannot be negative" },
              })}
            />
          </div>
        </div>

        {/* Warranty */}
        <div>
          <label className={labelStyles}>Warranty</label>
          <input
            type="text"
            className={inputStyles}
            placeholder="e.g., 2 Year Manufacturer Warranty"
            {...register("warranty")}
          />
        </div>

        {/* Shipping Info */}
        <div>
          <label className={labelStyles}>Shipping Info</label>
          <input
            type="text"
            className={inputStyles}
            placeholder="e.g., Ships in 2-3 business days"
            {...register("shippingInfo")}
          />
        </div>
      </div>
    </div>
  );
}
