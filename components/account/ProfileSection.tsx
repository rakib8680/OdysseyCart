"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  DisplayNameSchema,
  type TDisplayNameForm,
} from "@/lib/validations/profile";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useUploadThing } from "@/hooks/useUploadThing";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { Camera } from "lucide-react";

// ==========================================
// PROFILE SECTION — avatar + display name
// ==========================================
export function ProfileSection() {
  const { user, dbUser, updateName, updateAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("avatarUploader", {
    onUploadError: (error) => {
      setIsUploading(false);
      toast.error(error.message || "Upload failed.");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TDisplayNameForm>({
    resolver: zodResolver(DisplayNameSchema),
    defaultValues: { name: user?.displayName || dbUser?.name || "" },
  });

  // Avatar upload via hidden file input
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const res = await startUpload([file]);

    if (res?.[0]) {
      const result = await updateAvatar(res[0].ufsUrl);
      if (result.success) {
        toast.success("Avatar updated!");
      } else {
        toast.error(result.error || "Failed to save avatar.");
      }
    }

    setIsUploading(false);
    // Reset input so re-selecting the same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Update name
  const onSubmit = async (data: TDisplayNameForm) => {
    const result = await updateName(data.name);
    if (result.success) {
      toast.success("Display name updated!");
    } else {
      toast.error(result.error || "Failed to update name.");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <h2 className="text-sm font-semibold text-slate-900 mb-5">Profile</h2>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar with click-to-upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="relative group flex-shrink-0 cursor-pointer disabled:cursor-wait"
        >
          <UserAvatar
            photoURL={dbUser?.avatar || user?.photoURL}
            displayName={user?.displayName}
            email={user?.email}
            size="lg"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            {isUploading ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </button>

        {/* Name form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 w-full">
          <div className="max-w-sm">
            <FormInput
              id="display-name"
              label="Display Name"
              placeholder="Your name"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            size="sm"
            className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-9 px-4 gap-1.5"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-3.5 h-3.5" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Click your avatar to upload a new photo. Max 4MB, image files only.
      </p>
    </div>
  );
}
