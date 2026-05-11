"use client";

import {useEffect, useMemo, useState} from "react";
import {
  X,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react";

import {formatCurrency, formatDate, calculatePayroll} from "@/utils/payroll";

import {generateReportPDF} from "@/utils/reportGenerator";
import Loading from "@/app/loading";

export default function ReportsModal({isOpen, onClose, dashboardStats}) {
  const now = new Date();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState("monthly");

  const [selectedPeriod, setSelectedPeriod] = useState(
    `${now.getMonth() + 1}/${now.getFullYear()}`,
  );

  const [isGenerating, setIsGenerating] = useState(false);

  // =========================
  // Fetch employees
  // =========================
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/employees.json");
        const data = await response.json();

        setEmployees(data);
      } catch (error) {
        console.error("Failed to load employees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // =========================
  // Handle report type
  // =========================
  const handleReportTypeChange = (type) => {
    setReportType(type);

    if (type === "monthly") {
      setSelectedPeriod(`${now.getMonth() + 1}/${now.getFullYear()}`);
    } else {
      setSelectedPeriod(now.getFullYear().toString());
    }
  };

  // =========================
  // Calculate employee salary
  // =========================
  const getEmployeeSalary = (employee) => {
    // Monthly report
    if (reportType === "monthly") {
      return calculatePayroll(employee, selectedPeriod).netSalary;
    }

    // Annual report
    let yearlySalary = 0;

    for (let month = 1; month <= 12; month++) {
      const payroll = calculatePayroll(employee, `${month}/${selectedPeriod}`);

      yearlySalary += payroll.netSalary;
    }

    return yearlySalary;
  };

  // =========================
  // Report data
  // =========================
  const reportData = useMemo(() => {
    if (!employees.length || !dashboardStats) return null;

    // Department breakdown
    const departmentBreakdown = Object.entries(
      dashboardStats.departmentStats || {},
    )
      .map(([department, employeeCount]) => {
        const deptEmployees = employees.filter(
          (emp) => emp.department === department,
        );

        const totalSalary = deptEmployees.reduce(
          (sum, emp) => sum + getEmployeeSalary(emp),
          0,
        );

        return {
          department,
          employeeCount,
          totalSalary,
          averageSalary: employeeCount > 0 ? totalSalary / employeeCount : 0,
        };
      })
      .sort((a, b) => b.totalSalary - a.totalSalary);

    // Salary distribution
    const salaryRanges = [
      {range: "< 5M", min: 0, max: 5000000},
      {range: "5M - 10M", min: 5000000, max: 10000000},
      {range: "10M - 15M", min: 10000000, max: 15000000},
      {range: "15M - 25M", min: 15000000, max: 25000000},
      {range: "> 25M", min: 25000000, max: Infinity},
    ];

    const salaryDistribution = salaryRanges.map(({range, min, max}) => {
      const count = employees.filter((emp) => {
        const salary = getEmployeeSalary(emp);

        return salary >= min && salary < max;
      }).length;

      return {
        range,
        count,
        percentage: (count / employees.length) * 100,
      };
    });

    // Trends
    const trends = (dashboardStats.monthlyTrend || [])
      .slice(-6)
      .map((item, index, arr) => {
        const growth =
          index > 0
            ? ((item.amount - arr[index - 1].amount) / arr[index - 1].amount) *
              100
            : 0;

        return {
          period: item.month,
          amount: item.amount,
          growth,
        };
      });

    // Total payroll
    const totalPayroll = employees.reduce(
      (sum, emp) => sum + getEmployeeSalary(emp),
      0,
    );

    // =========================
    // Top earners (FIX)
    // =========================
    const topEarners = employees
      .map((emp) => ({
        name: emp.name,
        position: emp.position,
        department: emp.department,
        salary: getEmployeeSalary(emp),
      }))
      .sort((a, b) => b.salary - a.salary)
      .slice(0, 10);

    return {
      period: selectedPeriod,
      type: reportType,
      totalPayroll,
      totalEmployees: dashboardStats.totalEmployees,

      departmentBreakdown,
      salaryDistribution,
      trends,
      topEarners,

      generatedAt: new Date().toISOString(),
    };
  }, [employees, dashboardStats, selectedPeriod, reportType]);

  // =========================
  // Download PDF
  // =========================
  const handleDownloadReport = async () => {
    if (!reportData) return;

    setIsGenerating(true);

    try {
      await generateReportPDF(reportData);
    } catch (error) {
      console.error("PDF Error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getCurrentPeriod = () => {
    const now = new Date();

    return `${now.getMonth() + 1}/${now.getFullYear()}`;
  };

  // =========================
  // Render
  // =========================
  if (!isOpen) return null;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-7xl h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Payroll Reports
            </h2>

            <p className="text-slate-600 dark:text-slate-400 my-2">
              Generate comprehensive payroll analysis
            </p>

            <div className="text-sm text-slate-500">
              Generated at: {formatDate(reportData?.generatedAt)}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col xl:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="xl:w-80 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-8">
            <div className="space-y-8">
              {/* Report Type */}
              <div>
                <label className="block font-semibold mb-4">Report Type</label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleReportTypeChange("monthly")}
                    className={`p-4 rounded-xl font-semibold transition ${
                      reportType === "monthly"
                        ? "bg-slate-700 text-white"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    <Calendar className="w-5 h-5 mx-auto mb-2" />
                    Monthly
                  </button>

                  <button
                    onClick={() => handleReportTypeChange("annual")}
                    className={`p-4 rounded-xl font-semibold transition ${
                      reportType === "annual"
                        ? "bg-slate-700 text-white"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5 mx-auto mb-2" />
                    Annual
                  </button>
                </div>
              </div>

              {/* Period */}
              <div>
                <label className="block font-semibold mb-4">Period</label>

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full px-4 py-4 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {reportType === "monthly" ? (
                    <>
                      <option value="7/2026">7/2026</option>
                      <option value="10/2026">10/2026</option>

                      <option value={getCurrentPeriod()}>
                        {getCurrentPeriod()}
                      </option>

                      <option value="4/2026">4/2026</option>
                      <option value="3/2026">3/2026</option>
                      <option value="2/2026">2/2026</option>
                    </>
                  ) : (
                    <>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </>
                  )}
                </select>
              </div>

              {/* Download */}
              <button
                onClick={handleDownloadReport}
                disabled={isGenerating}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-slate-700 text-white rounded-2xl p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Total Payroll</p>

                    <h3 className="text-2xl font-bold">
                      {formatCurrency(reportData?.totalPayroll || 0)}
                    </h3>
                  </div>

                  <DollarSign className="w-8 h-8 text-slate-300" />
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-emerald-600">Employees</p>

                    <h3 className="text-2xl font-bold text-emerald-700">
                      {reportData?.totalEmployees}
                    </h3>
                  </div>

                  <Users className="w-8 h-8 text-emerald-500" />
                </div>
              </div>

              <div className="bg-violet-100 rounded-2xl p-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-violet-600">Avg Salary</p>

                    <h3 className="text-2xl font-bold text-violet-700">
                      {formatCurrency(
                        Math.round(
                          (reportData?.totalPayroll || 0) /
                            (reportData?.totalEmployees || 1),
                        ),
                      )}
                    </h3>
                  </div>

                  <TrendingUp className="w-8 h-8 text-violet-500" />
                </div>
              </div>
            </div>

            {/* Department Breakdown */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                Department Breakdown
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-700">
                    <tr>
                      <th className="text-left py-4 px-4">Department</th>

                      <th className="text-center py-4 px-4">Employees</th>

                      <th className="text-center py-4 px-4">Total Salary</th>

                      <th className="text-right py-4 px-4">Avg Salary</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reportData?.departmentBreakdown?.map((dept) => (
                      <tr
                        key={dept.department}
                        className="border-t border-slate-200 dark:border-slate-700"
                      >
                        <td className="py-4 px-4 font-semibold">
                          {dept.department}
                        </td>

                        <td className="py-4 px-4 text-center">
                          {dept.employeeCount}
                        </td>

                        <td className="py-4 px-4 text-center font-semibold">
                          {formatCurrency(dept.totalSalary)}
                        </td>

                        <td className="py-4 px-4 text-right">
                          {formatCurrency(dept.averageSalary)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Earners */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6">Top Earners</h3>

              <div className="space-y-4">
                {(reportData?.topEarners || [])
                  .slice(0, 5)
                  .map((employee, index) => (
                    <div
                      key={employee.name}
                      className="flex justify-between items-center bg-slate-50 dark:bg-slate-700 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                          {index + 1}
                        </div>

                        <div>
                          <h4 className="font-semibold">{employee.name}</h4>

                          <p className="text-sm text-slate-500">
                            {employee.position}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <h4 className="font-bold">
                          {formatCurrency(employee.salary)}
                        </h4>

                        <p className="text-sm text-slate-500">
                          {employee.department}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
