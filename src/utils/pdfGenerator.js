import jsPDF from "jspdf";

// =====================
// Helpers
// =====================
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB");
}

function formatCurrency(amount) {
  return (amount || 0).toLocaleString("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// =====================
// Safe getters
// =====================
function safe(obj) {
  return obj || {};
}

// =====================
// Page helper
// =====================
function checkPage(pdf, y, pageWidth) {
  if (y > 260) {
    pdf.addPage();
    return 20;
  }
  return y;
}

// =====================
// PDF Generator
// =====================
export const generatePDF = async (payslip, company) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Colors
    const headerGray = [229, 231, 235];
    const purpleLight = [233, 213, 255];
    const lightBlue = [219, 234, 254];
    const lightRed = [254, 226, 226];
    const lightGreen = [220, 252, 231];
    const textDark = [15, 23, 42];
    const grayText = [107, 114, 128];

    const radius = 4;

    const a = safe(payslip.allowances);
    const d = safe(payslip.deductions);

    // =====================
    // HEADER
    // =====================

    pdf.setFillColor(...headerGray);
    pdf.rect(0, 0, pageWidth, 45, "F");

    pdf.setTextColor(...textDark);

    // LEFT SIDE
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("Breakers Payoo", 15, 18);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Premier Payrollment IT Center", 15, 27);

    // RIGHT SIDE
    pdf.setFontSize(15);
    pdf.setFont("helvetica", "bold");
    pdf.text("MONTHLY SALARY REPORT", pageWidth - 15, 18, {align: "right"});

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Period: ${payslip.period}`, pageWidth - 15, 26, {
      align: "right",
    });

    pdf.text(`Generated: ${formatDate(new Date())}`, pageWidth - 15, 33, {
      align: "right",
    });

    // =====================
    // EMPLOYEE INFO
    // =====================
    let y = 55;

    pdf.setFillColor(...purpleLight);
    pdf.roundedRect(10, y, pageWidth - 20, 40, radius, radius, "F");

    pdf.setTextColor(...textDark);
    pdf.setFontSize(14);
    pdf.text("Employee Information", 15, y + 8);

    y += 16;

    const employeeInfo = [
      ["ID", payslip.employee.id],
      ["Name", payslip.employee.name],
      ["Position", payslip.employee.position],
      ["Department", payslip.employee.department],
    ];

    employeeInfo.forEach(([label, value]) => {
      y = checkPage(pdf, y, pageWidth);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(`${label}:`, 15, y);
      pdf.text(String(value || ""), pageWidth - 15, y, {
        align: "right",
      });

      y += 6;
    });

    // =====================
    // SALARY BREAKDOWN
    // =====================
    y += 3;
    y = checkPage(pdf, y, pageWidth);

    pdf.setFillColor(...lightBlue);
    pdf.roundedRect(10, y, pageWidth - 20, 65, radius, radius, "F");

    pdf.setFontSize(14);
    pdf.text("Salary Breakdown", 15, y + 8);

    let y2 = y + 16;

    const earnings = [
      ["Base Salary", payslip.baseSalary],
      ["Transport", a.transport],
      ["Meal", a.meal],
      ["Bonus", a.bonus],
      ["Overtime", a.overtime],
      ["Tips", a.tips],
      ["Holiday Bonus", a.holidayAllowance],
    ];

    earnings.forEach(([label, amount]) => {
      y2 = checkPage(pdf, y2, pageWidth);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");

      pdf.text(label, 15, y2);
      pdf.text(formatCurrency(amount), pageWidth - 15, y2, {
        align: "right",
      });

      y2 += 6;
    });

    pdf.setFont("helvetica", "bold");
    pdf.text("Gross Salary", 15, y2);
    pdf.text(formatCurrency(payslip.grossSalary), pageWidth - 15, y2, {
      align: "right",
    });


    // =====================
    // DEDUCTIONS
    // =====================
    y = y2 + 10;
    y = checkPage(pdf, y, pageWidth);

    pdf.setFillColor(...lightRed);
    pdf.roundedRect(10, y, pageWidth - 20, 60, radius, radius, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.text("Deductions", 15, y + 8);

    let y3 = y + 16;

    const deductions = [
      ["Tax", d.tax],
      ["Insurance", d.insurance],
      ["Cooperative Fund", d.cooperativeFund],
      ["Health Insurance", d.healthInsurance],
      ["Absent", d.absentDeduction],
      ["Other", d.other],
    ];

    deductions.forEach(([label, amount]) => {
      y3 = checkPage(pdf, y3, pageWidth);

      pdf.setFontSize(10);
      pdf.text(label, 15, y3);
      pdf.text(formatCurrency(amount), pageWidth - 15, y3, {
        align: "right",
      });

      y3 += 6;
    });

    // TOTAL DEDUCTIONS
    y3 += 2;
    pdf.setFont("helvetica", "bold");
    pdf.text("Total Deductions", 15, y3);
    pdf.text(formatCurrency(d.totalDeductions), pageWidth - 15, y3, {
      align: "right",
    });

    // =====================
    // NET SALARY
    // =====================
    y = y3 + 10;
    y = checkPage(pdf, y, pageWidth);

    pdf.setFillColor(...lightGreen);
    pdf.roundedRect(10, y, pageWidth - 20, 22, radius, radius, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text("Net Salary", 15, y + 12);

    pdf.setFontSize(18);
    pdf.text(formatCurrency(payslip.netSalary), pageWidth - 15, y + 12, {
      align: "right",
    });

    // =====================
    // FOOTER (dynamic)
    // =====================
    pdf.setTextColor(...grayText);
    pdf.setFontSize(9);

    pdf.text(
      "Computer generated salary slip - no signature required",
      pageWidth / 2,
      pageHeight - 10,
      {align: "center"},
    );

    // =====================
    // SAVE
    // =====================
    pdf.save(`salary-slip-${payslip.employee.name}-${payslip.period}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
};
