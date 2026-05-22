"use client";

import { User } from "firebase/auth";
import { Mail, Calendar, Shield } from "lucide-react";

interface AccountInfoCardProps {
  user: User | null;
  dbUser: any | null;
}

/** Displays user info — email, member since, role badge */
export function AccountInfoCard({ user, dbUser }: AccountInfoCardProps) {
  const memberSince = dbUser?.createdAt
    ? new Date(dbUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-900 mb-4">
        Account Information
      </h2>

      <div className="grid sm:grid-cols-3 gap-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-slate-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Email</p>
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.email || "—"}
            </p>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Member Since</p>
            <p className="text-sm font-medium text-slate-900">{memberSince}</p>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-slate-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500">Role</p>
            <span
              className={`inline-block mt-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                dbUser?.role === "admin"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {dbUser?.role === "admin" ? "Admin" : "Customer"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
