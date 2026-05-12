"use client";

import {useState} from "react";
import {
  Moon,
  Sun,
  User,
  Menu,
} from "lucide-react";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";
import {useTheme} from "@/context/ThemeContext";
import Image from "next/image";

const Navbar = ({onMenuClick}) => {
  const router = useRouter();

  // Session from authClient
  const {data: session} = authClient.useSession();
  const user = session?.user;

  // Theme Context
  const { theme, toggleTheme } = useTheme();
  console.log(theme);
  

  // Dropdown States
  const [showUserMenu, setShowUserMenu] = useState(false);


  // Logout
  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };


  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Menu className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>

          {/* Logo / Title */}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 dark:text-white truncate cursor-pointer">
              Payroll Management
            </h2>

            <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs sm:text-sm lg:text-base hidden sm:block">
              ByteCode Breakers IT Center
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            {!user ? (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-linear-to-r from-indigo-500 to-purple-600 dark:bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition"
              >
                Login
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 sm:space-x-3 lg:space-x-2 pl-3 sm:pl-4 border-l border-slate-200 dark:border-slate-700"
                >
                  {/* User Image */}
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12">
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        className="rounded-xl object-cover"
                      />
                    ) : (
                      <div className="bg-linear-to-br from-slate-600 to-slate-800 p-2 sm:p-3 rounded-xl">
                        <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="font-semibold text-slate-700 dark:text-white text-sm">
                      {user?.name}
                    </p>

                    <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                      {user?.role}
                    </p>
                  </div>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {user?.image && (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        )}

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {user?.name}
                          </p>

                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {user?.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
