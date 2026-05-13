"use client";

import {useState, useEffect} from "react";
import {usePathname} from "next/navigation";

import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import { ThemeProvider } from "@/context/ThemeContext";
import {ToastContainer} from "react-toastify";

export default function MainLayout({children}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // derive active tab from URL
  const activeTab = pathname.split("/")[1] || "dashboard";


  return (
    <ThemeProvider>
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
            fixed lg:sticky top-0 left-0 z-50 h-screen
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
        >
          <Sidebar activeTab={activeTab} />
        </div>

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Navbar */}
          <div className="sticky top-0 z-30 lg:static">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>
          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
