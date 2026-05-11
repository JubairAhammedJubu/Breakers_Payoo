import {useState, useEffect} from "react";
import {calculatePayroll, getCurrentPeriod} from "@/utils/payroll";

export const useDashboardData = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateStats = async () => {
      try {
        const res = await fetch("/employees.json");
        const employees = await res.json();

        const activeEmployees = employees.filter(
          (emp) => emp.status === "active",
        ).length;

        // =====================
        // Total Payroll (current month)
        // =====================
        const totalPayroll = employees.reduce((sum, emp) => {
          const payslip = calculatePayroll(emp, getCurrentPeriod());
          return sum + payslip.netSalary;
        }, 0);

        // =====================
        // Department stats
        // =====================
        const departmentStats = employees.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
          return acc;
        }, {});

        // =====================
        // Monthly trend (12 months)
        // =====================
        const monthlyTrend = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const period = `${date.getMonth() + 1}/${date.getFullYear()}`;

          let monthlyPayroll = 0;

          employees.forEach((emp) => {
            const payslip = calculatePayroll(emp, period);
            monthlyPayroll += payslip.netSalary;
          });

          // small realistic variation
          monthlyPayroll *= 1 + (Math.random() - 0.5) * 0.08;

          monthlyTrend.push({
            month: date.toLocaleDateString("en-BD", {
              month: "short",
              year: "2-digit",
            }),
            amount: Math.round(monthlyPayroll),
            employees: activeEmployees,
          });
        }

        // =====================
        // Payroll history (6 months)
        // =====================
        const payrollHistory = [];

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const period = `${date.getMonth() + 1}/${date.getFullYear()}`;

          const total = employees.reduce((sum, emp) => {
            const payslip = calculatePayroll(emp, period);
            return sum + payslip.netSalary;
          }, 0);

          payrollHistory.push({
            period,
            totalAmount: Math.round(total),
            employeeCount: activeEmployees,
            processedAt: new Date(
              date.getFullYear(),
              date.getMonth(),
              25,
            ).toISOString(),
          });
        }

        // =====================
        // Final state
        // =====================
        setStats({
          totalEmployees: employees.length,
          activeEmployees,
          totalPayroll: Math.round(totalPayroll),
          departmentStats,
          monthlyTrend,
          payrollHistory,
        });
      } catch (err) {
        console.error("Failed to load employee data:", err);
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, []);

  return {stats, loading};
};
