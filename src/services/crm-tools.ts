// CRM tool functions for Tambo AI integration
// These use the same window global pattern as calendar-control.ts

import type { PatientRecord, LabResult, StaffMember, InventoryItem } from "@/lib/crm-data-store";

type CrmWindow = Window &
  typeof globalThis & {
    handleAddPatient?: (patient: Omit<PatientRecord, "id">) => PatientRecord;
    handleAddLabResult?: (result: Omit<LabResult, "id">) => LabResult;
    handleAddStaffMember?: (member: Omit<StaffMember, "id">) => StaffMember;
    handleAddInventoryItem?: (item: Omit<InventoryItem, "id">) => InventoryItem;
  };

export async function addPatientTool({
  name,
  age,
  gender,
  diagnosis,
  department,
  status,
  admissionDate,
}: {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  diagnosis: string;
  department: string;
  status: "Admitted" | "Outpatient" | "Discharged" | "Critical";
  admissionDate: string;
}) {
  const win = window as CrmWindow;
  if (typeof window !== "undefined" && typeof win.handleAddPatient === "function") {
    const newPatient = win.handleAddPatient({ name, age, gender, diagnosis, department, status, admissionDate });
    return { success: true, patient: newPatient };
  }
  return { success: false, error: "CRM data store not mounted." };
}

export async function addLabResultTool({
  patientName,
  testType,
  date,
  status,
  doctor,
  priority,
  resultSummary,
}: {
  patientName: string;
  testType: string;
  date: string;
  status: "Completed" | "Pending" | "Processing";
  doctor: string;
  priority: "Routine" | "High" | "Critical";
  resultSummary: string;
}) {
  const win = window as CrmWindow;
  if (typeof window !== "undefined" && typeof win.handleAddLabResult === "function") {
    const newResult = win.handleAddLabResult({ patientName, testType, date, status, doctor, priority, resultSummary });
    return { success: true, labResult: newResult };
  }
  return { success: false, error: "CRM data store not mounted." };
}

export async function addStaffMemberTool({
  name,
  role,
  department,
  email,
  phone,
}: {
  name: string;
  role: "Doctor" | "Nurse" | "Admin" | "Pharmacist" | "Technician" | "Specialist";
  department: string;
  email: string;
  phone: string;
}) {
  const win = window as CrmWindow;
  if (typeof window !== "undefined" && typeof win.handleAddStaffMember === "function") {
    const newMember = win.handleAddStaffMember({ name, role, department, email, phone });
    return { success: true, staffMember: newMember };
  }
  return { success: false, error: "CRM data store not mounted." };
}

export async function addInventoryItemTool({
  name,
  category,
  quantity,
  location,
  status,
  expiryDate,
}: {
  name: string;
  category: "Medical Device" | "Pharmaceuticals" | "Surgical" | "General";
  quantity: number;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  expiryDate?: string;
}) {
  const win = window as CrmWindow;
  if (typeof window !== "undefined" && typeof win.handleAddInventoryItem === "function") {
    const newItem = win.handleAddInventoryItem({ name, category, quantity, location, status, expiryDate });
    return { success: true, inventoryItem: newItem };
  }
  return { success: false, error: "CRM data store not mounted." };
}
