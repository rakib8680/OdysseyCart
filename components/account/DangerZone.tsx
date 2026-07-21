"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { deleteAccount } from "@/app/actions/profile";
import { DELETE_CONFIRMATION_PHRASE } from "@/lib/validations/profile";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

// ==========================================
// DANGER ZONE — account deletion with typed confirmation
// ==========================================
export function DangerZone() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const isConfirmed = confirmation === DELETE_CONFIRMATION_PHRASE;

  const handleDelete = async () => {
    if (!user || !isConfirmed) return;

    setIsDeleting(true);
    try {
      // 1. Server-side: soft-delete + anonymize in MongoDB
      const result = await deleteAccount(user.uid);
      if (!result.success) {
        toast.error(result.error || "Failed to delete account.");
        setIsDeleting(false);
        return;
      }

      // 2. Client-side: delete Firebase Auth user
      try {
        await deleteUser(auth.currentUser!);
      } catch {
        // If Firebase deletion fails (needs reauthentication), just sign out.
        // The MongoDB document is already anonymized — the account is effectively dead.
        await logout();
      }

      toast.success("Your account has been deleted.");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/30 p-6">
      <h2 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Danger Zone
      </h2>
      <p className="text-sm text-slate-600 mb-4">
        Permanently delete your account and anonymize all personal data. Your
        order history will be preserved for legal compliance, but your name and
        email will be removed.
      </p>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-semibold h-9 px-4"
            />
          }
        >
          Delete Account
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your personal data will be
              permanently anonymized and your account will be disabled.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-2">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Type{" "}
              <span className="font-bold text-red-600">
                {DELETE_CONFIRMATION_PHRASE}
              </span>{" "}
              to confirm
            </label>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={DELETE_CONFIRMATION_PHRASE}
              className="text-sm"
              autoComplete="off"
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmation("");
                setOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={!isConfirmed || isDeleting}
              variant="destructive"
              size="sm"
              className="gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Spinner className="w-3.5 h-3.5" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
