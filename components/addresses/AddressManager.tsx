"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSavedAddresses,
  saveAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "@/app/actions/address";
import { type TAddressForm } from "@/lib/validations/checkout";
import {
  AddressCard,
  type SavedAddress,
} from "@/components/addresses/AddressCard";
import { AddressFormDialog } from "@/components/addresses/AddressFormDialog";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";

// ==========================================
// COMPONENT
// ==========================================

/**
 * Stateful orchestrator for the address management dashboard.
 * Fetches addresses, manages CRUD operations, and composes
 * AddressCard + AddressFormDialog + DeleteConfirmModal.
 */
export function AddressManager() {
  const { user } = useAuth();

  // ─── State ───
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(
    null,
  );
  const [deletingAddress, setDeletingAddress] = useState<SavedAddress | null>(
    null,
  );

  // ─── Fetch addresses on mount ───
  useEffect(() => {
    async function fetchAddresses() {
      if (!user) return;
      setLoading(true);
      const result = await getSavedAddresses(user.uid);
      if (result.success && result.addresses) {
        setAddresses(result.addresses);
      }
      setLoading(false);
    }
    fetchAddresses();
  }, [user]);

  // ─── Handlers ───

  const handleAdd = () => {
    setEditingAddress(null);
    setFormOpen(true);
  };

  const handleEdit = (address: SavedAddress) => {
    setEditingAddress(address);
    setFormOpen(true);
  };

  const handleSave = async (data: TAddressForm, label: string) => {
    if (!user) return;
    setIsSaving(true);

    try {
      if (editingAddress) {
        // Update existing
        const result = await updateAddress(
          user.uid,
          editingAddress._id,
          data,
          label,
        );
        if (result.success && result.addresses) {
          setAddresses(result.addresses);
          toast.success("Address updated!");
        } else {
          toast.error(result.message || "Failed to update address.");
        }
      } else {
        // Add new
        const result = await saveAddress(user.uid, data, label);
        if (result.success && result.addresses) {
          setAddresses(result.addresses);
          toast.success("Address added!");
        } else {
          toast.error(result.message || "Failed to save address.");
        }
      }
      setFormOpen(false);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !deletingAddress) return;
    setIsDeleting(true);

    try {
      const result = await deleteAddress(user.uid, deletingAddress._id);
      if (result.success && result.addresses) {
        setAddresses(result.addresses);
        toast.success("Address deleted.");
      } else {
        toast.error(result.message || "Failed to delete address.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeletingAddress(null);
    }
  };

  const handleSetDefault = async (address: SavedAddress) => {
    if (!user || address.isDefault) return;

    try {
      const result = await setDefaultAddress(user.uid, address._id);
      if (result.success && result.addresses) {
        setAddresses(result.addresses);
        toast.success(`"${address.label}" set as default.`);
      } else {
        toast.error(result.message || "Failed to set default.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  // ─── Loading state ───
  if (loading) return <AddressManagerSkeleton />;

  // ─── Empty state ───
  if (addresses.length === 0) {
    return (
      <>
        <EmptyState
          icon={MapPin}
          title="No Saved Addresses"
          description="Save a shipping address to speed up your checkout process."
          actionLabel="Add Address"
          actionOnClick={handleAdd}
        />

        <AddressFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          onSave={handleSave}
          isSaving={isSaving}
        />
      </>
    );
  }

  // ─── Main view ───
  return (
    <>
      {/* Header + Add Button */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          {addresses.length} of 5 addresses used
        </p>
        {addresses.length < 5 && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        )}
      </div>

      {/* Address Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr._id}
            address={addr}
            className="border-slate-200 bg-white"
            actions={
              <div className="flex items-center gap-1">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                    title="Set as default"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(addr)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingAddress(addr)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            }
          />
        ))}
      </div>

      {/* Form Dialog (shared for add/edit) */}
      <AddressFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        defaultValues={
          editingAddress
            ? {
                label: editingAddress.label,
                fullName: editingAddress.fullName,
                address: editingAddress.address,
                city: editingAddress.city,
                state: editingAddress.state,
                zipCode: editingAddress.zipCode,
                country: editingAddress.country,
                phone: editingAddress.phone,
              }
            : undefined
        }
        isSaving={isSaving}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deletingAddress}
        onClose={() => setDeletingAddress(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        itemName={`"${deletingAddress?.label}" address`}
        confirmLabel="Delete Address"
        description={`This will permanently remove the "${deletingAddress?.label}" address from your saved addresses.`}
      />
    </>
  );
}

// ==========================================
// LOADING SKELETON
// ==========================================

function AddressManagerSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  );
}
