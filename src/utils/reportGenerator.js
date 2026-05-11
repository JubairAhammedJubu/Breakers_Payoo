import jsPDF from "jspdf";

/**
 * Format BDT Currency
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * Format Date
 */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Generate PDF (Modern Clean Design)
 */
export const generateReportPDF = async (reportData) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const colors = {
      primary: [15, 23, 42],
      accent: [56, 189, 248],
      soft: [241, 245, 249],
      green: [34, 197, 94],
      purple: [168, 85, 247],
      gray: [100, 116, 139],
    };

    let y = 18;

    /**
     * =====================================
     * HEADER (Light & Clean + Logo)
     * =====================================
     */

    // Light header background
    pdf.setFillColor(241, 245, 249);
    pdf.rect(0, 0, pageWidth, 45, "F");

    // LOGO CIRCLE
    pdf.setFillColor(56, 189, 248);
    pdf.circle(18, 20, 7, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("ED", 18, 22, {align: "center"});

    // Company Name
    pdf.setTextColor(...colors.primary);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text("Enjoy Dive", 30, 20);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text("Payroll Management Report", 30, 26);

    // Right side info
    pdf.setFontSize(10);
    pdf.setTextColor(...colors.gray);

    pdf.text(`Period: ${reportData.period}`, pageWidth - 15, 18, {
      align: "right",
    });

    pdf.text(
      `Generated: ${formatDate(reportData.generatedAt)}`,
      pageWidth - 15,
      24,
      {align: "right"},
    );

    pdf.text(`${reportData.type.toUpperCase()} REPORT`, pageWidth - 15, 30, {
      align: "right",
    });

    y = 55;

    /**
     * =====================================
     * SUMMARY CARDS (Soft Design)
     * =====================================
     */

    const cards = [
      {
        label: "Total Payroll",
        value: formatCurrency(reportData.totalPayroll),
        bg: [220, 252, 231], // light green
        text: [22, 101, 52], // green text
      },
      {
        label: "Employees",
        value: reportData.totalEmployees,
        bg: [219, 234, 254], // light blue
        text: [30, 64, 175], // blue text
      },
      {
        label: "Avg Salary",
        value: formatCurrency(
          reportData.totalPayroll / (reportData.totalEmployees || 1),
        ),
        bg: [243, 232, 255], // light purple
        text: [107, 33, 168], // purple text
      },
    ];

    const cardW = (pageWidth - 50) / 3;

    cards.forEach((c, i) => {
      const x = 15 + i * (cardW + 7);

      // soft background
      pdf.setFillColor(...c.bg);
      pdf.roundedRect(x, y, cardW, 28, 4, 4, "F");

      // label
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text(c.label, x + 5, y + 8);

      // value
      pdf.setTextColor(...c.text);
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text(String(c.value), x + 5, y + 18);
    });

    y += 45;

    /**
     * =====================================
     * SALARY DISTRIBUTION (BEAUTIFUL BARS)
     * =====================================
     */

    pdf.setFontSize(14);
    pdf.setTextColor(...colors.primary);
    pdf.setFont("helvetica", "bold");
    pdf.text("Salary Distribution", 15, y);

    y += 10;

    (reportData.salaryDistribution || []).forEach((item) => {
      const barMaxWidth = 110;
      const barWidth = (item.percentage / 100) * barMaxWidth;

      // Label
      pdf.setFontSize(9);
      pdf.setTextColor(...colors.gray);
      pdf.text(item.range, 15, y + 3);

      // Background bar (light)
      pdf.setFillColor(226, 232, 240);
      pdf.roundedRect(60, y, barMaxWidth, 5, 2, 2, "F");

      // Filled bar
      pdf.setFillColor(...colors.accent);
      pdf.roundedRect(60, y, barWidth, 5, 2, 2, "F");

      // Right text
      pdf.setTextColor(...colors.primary);
      pdf.text(
        `${item.count} (${item.percentage.toFixed(1)}%)`,
        pageWidth - 15,
        y + 3,
        {align: "right"},
      );

      y += 10;
    });

    y += 8;

    /**
     * =====================================
     * DEPARTMENT TABLE (CLEAN STYLE)
     * =====================================
     */

    pdf.setFontSize(14);
    pdf.setTextColor(...colors.primary);
    pdf.text("Department Breakdown", 15, y);

    y += 15;

    (reportData.departmentBreakdown || []).forEach((d, i) => {
      if (y > pageHeight - 30) {
        pdf.addPage();
        y = 20;
      }

      if (i % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(15, y - 4, pageWidth - 30, 8, "F");
      }

      pdf.setTextColor(...colors.primary);
      pdf.setFontSize(9);

      pdf.text(d.department, 15, y + 2);

      pdf.text(String(d.employeeCount), 100, y + 2, {align: "right"});

      pdf.text(formatCurrency(d.totalSalary), 150, y + 2, {align: "right"});

      pdf.text(formatCurrency(d.averageSalary), 195, y + 2, {align: "right"});

      y += 8;
    });

    /**
     * =====================================
     * FOOTER
     * =====================================
     */

    const footer = pageHeight - 10;

    pdf.setDrawColor(226, 232, 240);
    pdf.line(15, footer - 5, pageWidth - 15, footer - 5);

    pdf.setTextColor(...colors.gray);
    pdf.setFontSize(8);

    pdf.text("Confidential Payroll Report - Enjoy Dive", 15, footer);

    pdf.text(`Page ${pdf.getNumberOfPages()}`, pageWidth - 15, footer, {
      align: "right",
    });

    /**
     * SAVE
     */
    pdf.save(`payroll-report-${reportData.period.replace(/\//g, "-")}.pdf`);
  } catch (err) {
    console.error("PDF Error:", err);
  }
};
