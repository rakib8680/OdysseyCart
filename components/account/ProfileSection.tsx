"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import {
  DisplayNameSchema,
  type TDisplayNameForm,
} from "@/lib/validations/profile";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { UploadButton } from "@/lib/utils/uploadthing";
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
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TDisplayNameForm>({
    resolver: zodResolver(DisplayNameSchema),
    defaultValues: { name: user?.displayName || dbUser?.name || "" },
  });

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
        {/* Avatar with upload */}
        <div className="relative group flex-shrink-0">
          <UserAvatar
            photoURL={dbUser?.avatar || user?.photoURL}
            displayName={user?.displayName}
            email={user?.email}
            size="lg"
          />

          {/* Upload overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            {isUploading ? (
              <Spinner className="w-5 h-5 text-white" />
            ) : (
              <Camera className="w-5 h-5 text-white" />
            )}
          </div>

          {/* Invisible UploadButton overlay */}
          <div className="absolute inset-0 rounded-full overflow-hidden opacity-0">
            <UploadButton
              endpoint="avatarUploader"
              onUploadBegin={() => setIsUploading(true)}
              onClientUploadComplete={async (res) => {
                setIsUploading(false);
                if (res?.[0]) {
                  const result = await updateAvatar(res[0].ufsUrl);
                  if (result.success) {
                    toast.success("Avatar updated!");
                  } else {
                    toast.error(result.error || "Failed to save avatar.");
                  }
                }
              }}
              onUploadError={(error) => {
                setIsUploading(false);
                toast.error(error.message || "Upload failed.");
              }}
            />
          </div>
        </div>

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
        Hover over your avatar to upload a new photo. Max 4MB, image files only.
      </p>
    </div>
  );
}
