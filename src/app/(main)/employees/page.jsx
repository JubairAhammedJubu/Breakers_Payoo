"use client";

import React, {useEffect, useState} from "react";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  DollarSign,
  X,
  Star,
} from "lucide-react";
import {toast} from "react-toastify";

export default function EmployeeList() {
  const [employeeList, setEmployeeList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [modalMode, setModalMode] = useState("view");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/employees.json")
      .then((res) => res.json())
      .then((data) => setEmployeeList(data))
      .catch((err) => console.error(err));
  }, []);

  const departments = [...new Set(employeeList.map((emp) => emp.department))];

  const positions = [
    "Manager",
    "Developer",
    "Designer",
    "HR",
    "Accountant",
    "Marketing Executive",
  ];

  const religions = [
    {value: "islam", label: "Islam"},
    {value: "christian", label: "Christian"},
    {value: "hindu", label: "Hindu"},
    {value: "buddhist", label: "Buddhist"},
  ];

  const filteredEmployees = employeeList.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      !selectedDepartment || employee.department === selectedDepartment;

    const matchesStatus = !selectedStatus || employee.status === selectedStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleAddEmployee = () => {
    setSelectedEmployee({
      id: "",
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      baseSalary: 0,
      bankAccount: "",
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
      overtimeRate: 0,
      religion: "islam",
      isManagement: false,
    });

    setModalMode("add");
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalMode === "add") {
      const newEmployee = {
        ...selectedEmployee,
        id: `EMP${String(employeeList.length + 1).padStart(3, "0")}`,
      };

      setEmployeeList([...employeeList, newEmployee]);
      toast.success("Employee added successfully!");
    } else {
      setEmployeeList(
        employeeList.map((emp) =>
          emp.id === selectedEmployee.id ? selectedEmployee : emp,
        ),
      );
      toast.success("Info Updated successfully!");
    }
    setShowModal(false);
  };

  const handleDeleteEmployee = (id) => {
    setEmployeeList(employeeList.filter((emp) => emp.id !== id));
    toast.error("Employee deleted");
    setShowModal(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Employee Management
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-lg mt-2">
            Manage your team of {employeeList.length} employees
          </p>
        </div>

        <button
          onClick={handleAddEmployee}
          className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-white"
            />
          </div>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-white"
          >
            <option value="">All Departments</option>

            {departments.map((dept) => (
              <option key={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex items-center">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredEmployees.length} employees
            </span>
          </div>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-slate-600 to-slate-800 p-3 rounded-xl text-white font-bold">
                  {employee.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {employee.name}
                  </h3>

                  <p className="text-sm text-slate-500">{employee.id}</p>
                </div>
              </div>

              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  employee.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {employee.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6 text-slate-700 dark:text-white">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-slate-400" />

                <div>
                  <p className="font-medium">{employee.position}</p>

                  <p className="text-xs text-slate-500">
                    {employee.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-slate-400" />

                <div>
                  <p className="font-medium">
                    {formatCurrency(employee.baseSalary)}
                  </p>

                  <p className="text-xs text-slate-500">Base Salary</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />

                <p>{formatDate(employee.joinDate)}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />

                <p className="truncate text-sm">{employee.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />

                <p className="text-sm">{employee.phone}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <span className="inline-flex items-center px-2 py-1 text-xs bg-violet-100 text-violet-700 rounded-full">
                  <Star className="h-3 w-3 mr-1" />
                  {employee.position}
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-white">
                <button
                  onClick={() => handleViewEmployee(employee)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <Eye className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  <Edit className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {modalMode === "add"
                  ? "Add Employee"
                  : modalMode === "edit"
                    ? "Edit Employee"
                    : "Employee Details"}
              </h2>

              <button onClick={() => setShowModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] text-slate-900 dark:text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
                {/* Left */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Full Name
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.name}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEmployee.name}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>

                    {/* Position */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Position
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.position}</p>
                      ) : (
                        <select
                          value={selectedEmployee.position}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              position: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border bg-white dark:bg-slate-800 rounded-xl"
                        >
                          <option value="">Select Position</option>

                          {positions.map((pos) => (
                            <option key={pos}>{pos}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Department
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.department}</p>
                      ) : (
                        <select
                          value={selectedEmployee.department}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border bg-white dark:bg-slate-800 rounded-xl"
                        >
                          <option value="">All Departments</option>

                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Religion */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Religion
                      </label>

                      {modalMode === "view" ? (
                        <p className="capitalize">
                          {selectedEmployee.religion}
                        </p>
                      ) : (
                        <select
                          value={selectedEmployee.religion}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              religion: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border bg-white dark:bg-slate-800 rounded-xl"
                        >
                          {religions.map((religion) => (
                            <option key={religion.value} value={religion.value}>
                              {religion.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Email
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.email}</p>
                      ) : (
                        <input
                          type="email"
                          value={selectedEmployee.email}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Phone
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.phone}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEmployee.phone}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Employment & Salary</h3>

                  <div className="space-y-4">
                    {/* Join Date */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Join Date
                      </label>

                      {modalMode === "view" ? (
                        <p>{formatDate(selectedEmployee.joinDate)}</p>
                      ) : (
                        <input
                          type="date"
                          value={selectedEmployee.joinDate}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              joinDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>

                    {/* Salary */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Base Salary
                      </label>

                      {modalMode === "view" ? (
                        <p>{formatCurrency(selectedEmployee.baseSalary)}</p>
                      ) : (
                        <input
                          type="number"
                          value={selectedEmployee.baseSalary}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              baseSalary: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>

                    {/* Bank Account */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Bank Account
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.bankAccount}</p>
                      ) : (
                        <input
                          type="text"
                          value={selectedEmployee.bankAccount}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              bankAccount: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>

                    {/* Overtime */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Overtime Rate
                      </label>

                      {modalMode === "view" ? (
                        <p>{formatCurrency(selectedEmployee.overtimeRate)}</p>
                      ) : (
                        <input
                          type="number"
                          value={selectedEmployee.overtimeRate}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              overtimeRate: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        />
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block mb-2 text-sm font-medium">
                        Status
                      </label>

                      {modalMode === "view" ? (
                        <p>{selectedEmployee.status}</p>
                      ) : (
                        <select
                          value={selectedEmployee.status}
                          onChange={(e) =>
                            setSelectedEmployee({
                              ...selectedEmployee,
                              status: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border rounded-xl"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      )}
                    </div>

                    {/* Management */}
                    {modalMode !== "view" && (
                      <div>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedEmployee.isManagement}
                            onChange={(e) =>
                              setSelectedEmployee({
                                ...selectedEmployee,
                                isManagement: e.target.checked,
                              })
                            }
                          />

                          <span>Management Position</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-8">
                {modalMode !== "view" && (
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-slate-700 text-white rounded-xl cursor-pointer"
                  >
                    Save Employee
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
