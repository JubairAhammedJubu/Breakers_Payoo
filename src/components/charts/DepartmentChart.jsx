import React from "react";

export default function DepartmentChart({data}) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 dark:text-slate-400">
        <p>No department data available</p>
      </div>
    );
  }

  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);

  const colors = [
    {bg: "bg-slate-600"},
    {bg: "bg-emerald-600"},
    {bg: "bg-blue-600"},
    {bg: "bg-violet-600"},
    {bg: "bg-amber-600"},
    {bg: "bg-red-600"},
    {bg: "bg-pink-600"},
    {bg: "bg-indigo-600"},
    {bg: "bg-teal-600"},
    {bg: "bg-orange-600"},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Distribution by Department
        </h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {total} total employees
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-4">
        {sortedData.map(([department, count], index) => {
          const percentage = (count / total) * 100;
          const color = colors[index % colors.length].bg;

          return (
            <div key={department}>
              {/* Label */}
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {department}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {count} ({percentage.toFixed(1)}%)
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-3 ${color} transition-all duration-500`}
                  style={{width: `${percentage}%`}}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {sortedData[0]?.[1] || 0}
          </div>
          <div className="text-xs text-slate-500">Largest Dept</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {sortedData[0]?.[0] || "N/A"}
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-slate-900 dark:text-white">
            {Object.keys(data).length}
          </div>
          <div className="text-xs text-slate-500">Departments</div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Active
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between">
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Total Employees
        </span>
        <span className="text-lg font-bold text-slate-900 dark:text-white">
          {total}
        </span>
      </div>
    </div>
  );
}
