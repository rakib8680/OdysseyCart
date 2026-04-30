import { ReactNode } from "react";

interface AuthFormWrapperProps {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
}

export function AuthFormWrapper({
  title,
  subtitle,
  children,
}: AuthFormWrapperProps) {
  return (
    <div className="flex-1 flex flex-col justify-center py-20 md:pt-0  pb-24 px-6 bg-slate-50 md:min-h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">{subtitle}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow rounded-2xl sm:px-10 border border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}
