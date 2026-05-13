"use client";

import React, {useState} from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Waves,
  MapPin,
  Phone,
  Mail,
  Download,
  Target,
  Building,
  Briefcase,
  FileText,
} from "lucide-react";

import {useRouter} from "next/navigation";

import {useDashboardData} from "@/hooks/useDashboardData";
import {formatCurrency, getCurrentPeriod} from "@/utils/payroll";

import DepartmentChart from "@/components/charts/DepartmentChart";
import ReportsModal from "@/components/modals/ReportsModal";

const Dashboard = () => {
  const router = useRouter();

  const {stats, loading} = useDashboardData();

  const [showReports, setShowReports] = useState(false);

  const handleQuickAction = (action) => {
    switch (action) {
      case "payroll":
        router.push("/payroll");
        break;

      case "employees":
        router.push("/employees");
        break;

      case "reports":
        setShowReports(true);
        break;

      case "payslips":
        router.push("/payslips");
        break;

      default:
        break;
    }
  };

  if (loading || !stats) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-6 lg:space-y-8">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="bg-slate-200 dark:bg-slate-700 rounded-2xl lg:rounded-3xl h-32 sm:h-40 lg:h-48 mb-6 lg:mb-8"></div>

          {/* Cards skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-200 dark:bg-slate-700 rounded-xl lg:rounded-2xl h-24 sm:h-28 lg:h-32"
              ></div>
            ))}
          </div>

          {/* Charts skeleton */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            <div className="xl:col-span-2 bg-slate-200 dark:bg-slate-700 rounded-xl lg:rounded-2xl h-64 lg:h-80"></div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-xl lg:rounded-2xl h-64 lg:h-80"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentPeriod = getCurrentPeriod();


  const avgSalary = Math.round(stats.totalPayroll / stats.activeEmployees);

  const largestDepartment = Object.entries(stats.departmentStats).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
  );


  return (
    <div className="p-4 sm:p-6 lg:p-8 xl:p-12 space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10 xl:p-12 text-white shadow-2xl">
        <div className="flex flex-col space-y-6 lg:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-6 sm:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
                <div className="flex item-center">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-15 w-15 lg:h-22 lg:w-22 object-contain rounded-xl"
                  />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
                    Breakers Payoo
                  </h1>

                  <p className="text-slate-300 text-base sm:text-lg lg:text-xl mt-1">
                    Premier Payrollment IT Center
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 text-sm sm:text-base">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-slate-300" />
                  <span className="text-slate-200 truncate">
                    Uttara, Dhaka, Bangladesh
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-slate-300" />
                  <span className="text-slate-200">+088 1361 288 829</span>
                </div>

                <div className="flex items-center space-x-3 md:col-span-2 xl:col-span-1">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-slate-300" />
                  <span className="text-slate-200 truncate">
                    info@breakerspayoo.com
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="text-center sm:text-right">
                <p className="text-slate-300 text-sm">Payroll Period</p>

                <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
                  {currentPeriod}
                </p>
              </div>

              <button
                onClick={() => setShowReports(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Download className="h-5 w-5" />

                <span className="font-medium">Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
        {/* Total Employees Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                  Total Employees
                </p>
              </div>

              <div className="bg-slate-100 dark:bg-slate-700 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Users className="h-6 w-6 lg:h-8 lg:w-8 text-slate-600 dark:text-slate-400" />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-3xl lg:text-4xl font-bold text-slate-600 dark:text-white leading-none">
                {stats.totalEmployees}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <span className="text-emerald-600 text-sm font-semibold">
                {stats.activeEmployees} Active
              </span>

              <span className="text-slate-400 text-sm">
                (
                {Math.round(
                  (stats.activeEmployees / stats.totalEmployees) * 100,
                )}
                %)
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Payroll Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group ">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                  Monthly Payroll
                </p>
              </div>

              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-white leading-none wrap-break-word">
                {formatCurrency(stats.totalPayroll)}
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <span className="text-emerald-600 text-sm font-semibold">
                For {stats.activeEmployees} Employees
              </span>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                  Departments
                </p>
              </div>

              <div className="bg-violet-100 dark:bg-violet-900/30 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <Building className="h-6 w-6 lg:h-8 lg:w-8 text-violet-600 dark:text-violet-400" />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-3xl lg:text-4xl font-bold text-slate-600 dark:text-white leading-none">
                {Object.keys(stats.departmentStats).length}
              </p>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                Largest: {largestDepartment[0]} ({largestDepartment[1]})
              </span>
            </div>
          </div>
        </div>

        {/* Average Salary Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 group">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2">
                  Avg. Salary
                </p>
              </div>

              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 lg:p-4 rounded-xl group-hover:scale-110 transition-transform duration-300 shrink-0">
                <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-2xl lg:text-3xl font-bold text-slate-600 dark:text-white leading-none wrap-break-word">
                {formatCurrency(avgSalary).replace("Rp", "Rp ")}
              </p>
            </div>

            <div className="pt-2">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                Per employee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Department Chart and Quick Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        <div className="xl:col-span-2 bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 dark:text-white">
              Department Distribution
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Employee allocation across departments
            </p>
          </div>
          <DepartmentChart data={stats.departmentStats} />
        </div>

        {/* Quick Stats Panel */}
        <div className="space-y-6">
          {/* Payroll Summary */}
          <div className="bg-linear-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl lg:rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-emerald-800 dark:text-emerald-400">
                Payroll Summary
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-emerald-700 dark:text-emerald-300 text-sm">
                  Current Period
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-200">
                  {currentPeriod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-700 dark:text-emerald-300 text-sm">
                  Total Amount
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-200">
                  {formatCurrency(stats.totalPayroll).replace("Rp", "Rp ")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-700 dark:text-emerald-300 text-sm">
                  Per Employee
                </span>
                <span className="font-bold text-emerald-800 dark:text-emerald-200">
                  {formatCurrency(avgSalary).replace("Rp", "Rp ")}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl lg:rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-blue-800 dark:text-blue-400">
                Performance
              </h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-300 text-sm">
                  Employee Retention
                </span>
                <span className="font-bold text-blue-800 dark:text-blue-200">
                  98%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-300 text-sm">
                  Payroll Accuracy
                </span>
                <span className="font-bold text-blue-800 dark:text-blue-200">
                  100%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-300 text-sm">
                  On-time Processing
                </span>
                <span className="font-bold text-blue-800 dark:text-blue-200">
                  100%
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
              <Briefcase className="h-5 w-5" />
              <span>Quick Actions</span>
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => handleQuickAction("payroll")}
                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-3 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Process Payroll
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction("employees")}
                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-3 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Manage Employees
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction("payslips")}
                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-3 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Generate Pay Slips
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleQuickAction("reports")}
                className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-3 rounded-lg text-left transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Download className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    Generate Reports
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 dark:text-white mb-6 sm:mb-8">
          Department Overview
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {Object.entries(stats.departmentStats).map(([department, count]) => (
            <div
              key={department}
              className="text-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 group cursor-pointer"
              onClick={() => handleQuickAction("employees")}
            >
              <p className="text-2xl sm:text-3xl font-bold text-slate-600 dark:text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                {count}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-tight font-medium">
                {department}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showReports && (
        <ReportsModal
          isOpen={showReports}
          onClose={() => setShowReports(false)}
          dashboardStats={stats}
        />
      )}
    </div>
  );
};

export default Dashboard;
