import Link from 'next/link';

export const metadata = { title: 'Login | OdysseyCart' };

export default function LoginPage() {
  return (
    <div className="flex-1 flex flex-col justify-center py-24 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Or{' '}
          <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <button className="w-full inline-flex justify-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors">
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12.48 10.92v3.28h7.84c-.24 1.84-1.1s-2.84 4.22-7.84 4.22-9-3.8-9-9 3.8-9 9-9c2.3 0 4.28.84 5.76 2.24l2.58-2.58C18.66 2.06 15.62 0 12.06 0 5.4 0 0 5.4 0 12s5.4 12 12 12c6.92 0 12.06-4.9 12.06-12.26 0-.82-.08-1.6-.2-2.34h-11.38z" />
                </svg>
                <span className="ml-2 font-semibold">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
