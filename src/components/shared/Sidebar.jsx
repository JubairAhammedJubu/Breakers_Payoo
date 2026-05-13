"use client";

import {
  LayoutDashboard,
  Users,
  Calculator,
  FileText,
  Waves,
  User,
} from "lucide-react";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {authClient} from "@/lib/auth-client";
import Image from "next/image";

const Sidebar = ({onTabChange}) => {
  const pathname = usePathname();

  // Session
  const {data: session} = authClient.useSession();
  const user = session?.user;

  // Menu Items
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "employees",
      label: "Employees",
      icon: Users,
      href: "/employees",
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: Calculator,
      href: "/payroll",
    },
    {
      id: "payslips",
      label: "Pay Slips",
      icon: FileText,
      href: "/payslips",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 w-64 lg:w-72 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 sm:p-6 lg:p-6.5 border-b border-slate-200 dark:border-slate-700 shadow">
        <div className="flex items-center space-x-3 lg:space-x-4">
          <div className="bg-gradient-to-br from-slate-700 to-slate-900 p-1 rounded-xl">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain rounded-xl"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Link href="/dashboard">
              <h1 className="text-lg lg:text-[22px] font-bold bg-linear-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-pink-500 bg-clip-text text-transparent truncate cursor-pointer">
                Breakers Payoo
              </h1>
            </Link>

            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 truncate">
              Payroll System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 sm:p-4 lg:p-6">
        <ul className="space-y-2 lg:space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;

            // Active state
            const isActive = pathname === item.href;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 lg:space-x-4 px-3 lg:px-4 py-3 lg:py-4 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-linear-to-r from-indigo-500 to-purple-600 dark:bg-slate-700 dark:from-transparent dark:to-transparent text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />

                  <span className="font-medium text-sm lg:text-base truncate">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info */}
      <div className="p-3 sm:p-4 lg:p-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative h-15 w-15 rounded-lg overflow-hidden">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gradient-to-br from-slate-600 to-slate-800 h-full w-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name
                    ?.split(" ")
                    ?.map((n) => n[0])
                    ?.join("")
                    ?.slice(0, 2) || "U"}
                </span>
              </div>
            )}
          </div>

          {/* User Details */}
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-600 dark:text-white text-sm lg:text-base truncate">
              {user?.name || "Guest User"}
            </p>

            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 truncate">
              {user?.email || "No Email"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
