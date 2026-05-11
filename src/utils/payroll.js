export const holidayCalendar = [
  // ===== 2026 =====

  {
    id: "bengali_new_year_2026",
    name: "Bengali New Year 2026",
    date: "2026-04-14",
    type: "pohela_boishakh",
    description: "Pohela Boishakh",
    allowanceMultiplier: 0.3,
    isActive: true,
    eligibleReligions: ["islam", "hindu", "christian", "buddhist", "other"],
  },
  {
    id: "eid_ul_fitr_2026",
    name: "Eid ul-Fitr 2026",
    date: "2026-03-21",
    type: "eid_ul_fitr",
    description: "Eid ul-Fitr (Islamic Holiday)",
    allowanceMultiplier: 1.0,
    isActive: true,
    eligibleReligions: ["islam"],
  },
  {
    id: "eid_ul_adha_2026",
    name: "Eid ul-Adha 2026",
    date: "2026-05-28",
    type: "eid_ul_adha",
    description: "Eid ul-Adha (Islamic Holiday)",
    allowanceMultiplier: 1.0,
    isActive: true,

  },

  // ===== 2027 =====
  {
    id: "bengali_new_year_2027",
    name: "Bengali New Year 2027",
    date: "2027-04-14",
    type: "pohela_boishakh",
    description: "Pohela Boishakh",
    allowanceMultiplier: 0.3,
    isActive: true,
    eligibleReligions: ["islam", "hindu", "christian", "buddhist", "other"],
  },
  {
    id: "eid_ul_fitr_2027",
    name: "Eid ul-Fitr 2027",
    date: "2027-03-10",
    type: "eid_ul_fitr",
    description: "Eid ul-Fitr (Islamic Holiday)",
    allowanceMultiplier: 1.0,
    isActive: true,
    eligibleReligions: ["islam"],
  },
  {
    id: "eid_ul_adha_2027",
    name: "Eid ul-Adha 2027",
    date: "2027-05-17",
    type: "eid_ul_adha",
    description: "Eid ul-Adha (Islamic Holiday)",
    isActive: true,
  },
  {
    id: "durga_puja_2026",
    name: "Durga Puja 2026",
    date: "2026-10-21",
    type: "durga_puja",
    description: "Durga Puja (Hindu Festival)",
    isActive: true,
  },

  {
    id: "durga_puja_2027",
    name: "Durga Puja 2027",
    date: "2027-10-10",
    type: "durga_puja",
    description: "Durga Puja (Hindu Festival)",
    isActive: true,
  },
];

// =============================
// Get active holiday for period
// =============================
export const getActiveHolidayForPeriod = (period) => {
  const [month, year] = period.split("/").map(Number);

  const activeHoliday = holidayCalendar.find((holiday) => {
    if (!holiday.isActive) return false;

    const holidayDate = new Date(holiday.date);

    return (
      holidayDate.getFullYear() === year && holidayDate.getMonth() === month - 1
    );
  });

  return activeHoliday || null;
};

// =============================
// Holiday allowance calculation
// =============================
export const calculateHolidayAllowance = (employee, period) => {
  const activeHoliday = getActiveHolidayForPeriod(period);

  if (!activeHoliday) {
    return {
      amount: 0,
      type: null,
    };
  }

  // Eid bonus
  if (
    activeHoliday.type === "eid_ul_fitr" ||
    activeHoliday.type === "eid_ul_adha" ||
    activeHoliday.type === "durga_puja"
  ) {
    return {
      amount: 3000,
      type: activeHoliday.type,
    };
  }

  // Other holiday bonus
  return {
    amount: 1000,
    type: activeHoliday.type,
  };
};

// =============================
// Payroll calculation
// =============================
export const calculatePayroll = (
  employee,
  period,
  overtimeHours = 0,
  absentDays = 0,
) => {
  const overtimePay = overtimeHours * (employee.overtimeRate || 0);
  const dailyDeductionRate = 1500;
  const absentDeduction = absentDays * dailyDeductionRate;

  const {amount: holidayAllowanceAmount, type: holidayType} =
    calculateHolidayAllowance(employee, period);

  const allowancesTotal =
    (employee.allowances.transport || 0) +
    (employee.allowances.meal || 0) +
    (employee.allowances.bonus || 0) +
    holidayAllowanceAmount +
    overtimePay;

  const grossSalaryBeforeTax = employee.baseSalary + allowancesTotal;

  const tax = grossSalaryBeforeTax * 0.05;

const deductionsTotal =
  (employee.deductions.tax || 0) +
  (employee.deductions.insurance || 0) +
  (employee.deductions.other || 0) +
  (employee.deductions.cooperativeFund || 0) +
  (employee.deductions.healthInsurance || 0) +
  (employee.deductions.loanDeduction || 0) +
  tax +
  absentDeduction;

  const netSalary = grossSalaryBeforeTax - deductionsTotal;

  return {
    id: `PS-${employee.id}-${period.replace("/", "")}`,
    employeeId: employee.id,
    employee,
    period,
    baseSalary: employee.baseSalary,

    allowances: {
      transport: employee.allowances.transport,
      meal: employee.allowances.meal,
      bonus: employee.allowances.bonus,
      overtime: overtimePay,
      holidayAllowance: holidayAllowanceAmount,
      total: allowancesTotal,
    },

    deductions: {
      tax,
      insurance: employee.deductions.insurance,
      other: employee.deductions.other,
      cooperativeFund: employee.deductions.cooperativeFund,
      healthInsurance: employee.deductions.healthInsurance,
      loanDeduction: employee.deductions.loanDeduction,
      absent: absentDeduction,
      total: deductionsTotal,
    },

    grossSalary: grossSalaryBeforeTax,
    netSalary,
    generatedAt: new Date().toISOString(),
    overtimeHours,
    holidayType,
  };
};

// =============================
// Utilities
// =============================
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getCurrentPeriod = () => {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getFullYear()}`;
};

export const getHolidayName = (type) => {
  const names = {
    eid_ul_fitr: "Eid Bonus",
    eid_ul_adha: "Eid Bonus",
    durga_puja: "Puja Bonus",
    pohela_boishakh: "Festival Bonus",
  };

  return names[type] || "Holiday Bonus";
};
