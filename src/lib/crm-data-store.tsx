"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// ============ Type Definitions ============

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  diagnosis: string;
  department: string;
  status: "Admitted" | "Outpatient" | "Discharged" | "Critical";
  admissionDate: string;
}

export interface LabResult {
  id: string;
  patientName: string;
  testType: string;
  date: string;
  status: "Completed" | "Pending" | "Processing";
  doctor: string;
  priority: "Routine" | "High" | "Critical";
  resultSummary: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: "Doctor" | "Nurse" | "Admin" | "Pharmacist" | "Technician" | "Specialist";
  department: string;
  email: string;
  phone: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: "Medical Device" | "Pharmaceuticals" | "Surgical" | "General";
  quantity: number;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  expiryDate?: string;
}

// ============ Initial Data ============

const initialPatients: PatientRecord[] = [
  { id: "P-1024", name: "John Doe", age: 45, gender: "Male", diagnosis: "Hypertension", department: "Cardiology", status: "Admitted", admissionDate: "2024-03-10" },
  { id: "P-1025", name: "Jane Smith", age: 32, gender: "Female", diagnosis: "Migraine", department: "Neurology", status: "Outpatient", admissionDate: "2024-03-12" },
  { id: "P-1026", name: "Robert Chase", age: 28, gender: "Male", diagnosis: "Fractured Tibia", department: "Orthopedics", status: "Admitted", admissionDate: "2024-03-14" },
  { id: "P-1027", name: "Emily Rose", age: 67, gender: "Female", diagnosis: "Pneumonia", department: "Pulmonology", status: "Critical", admissionDate: "2024-03-15" },
  { id: "P-1028", name: "Michael Scott", age: 50, gender: "Male", diagnosis: "Gastritis", department: "Gastroenterology", status: "Discharged", admissionDate: "2024-03-01" },
];

const initialLabResults: LabResult[] = [
  { id: "LAB-2024-001", patientName: "John Doe", testType: "Complete Blood Count (CBC)", date: "2024-03-15", status: "Completed", doctor: "Dr. Gregory House", priority: "Routine", resultSummary: "Normal" },
  { id: "LAB-2024-002", patientName: "Jane Smith", testType: "Lipid Panel", date: "2024-03-14", status: "Pending", doctor: "Dr. Lisa Cuddy", priority: "High", resultSummary: "-" },
  { id: "LAB-2024-003", patientName: "Robert Chase", testType: "MRI - Brain", date: "2024-03-14", status: "Completed", doctor: "Dr. James Wilson", priority: "Critical", resultSummary: "Abnormalities Detected" },
  { id: "LAB-2024-004", patientName: "Allison Cameron", testType: "Urinalysis", date: "2024-03-13", status: "Processing", doctor: "Dr. Eric Foreman", priority: "Routine", resultSummary: "-" },
  { id: "LAB-2024-005", patientName: "Chris Taub", testType: "Liver Function Test", date: "2024-03-12", status: "Completed", doctor: "Dr. Remy Hadley", priority: "Routine", resultSummary: "Elevated Enzymes" },
];

const initialStaff: StaffMember[] = [
  { id: "S001", name: "Dr. Gregory House", role: "Doctor", department: "Diagnostics", email: "g.house@hospital.com", phone: "555-0101" },
  { id: "S002", name: "Dr. Lisa Cuddy", role: "Admin", department: "Administration", email: "l.cuddy@hospital.com", phone: "555-0102" },
  { id: "S003", name: "Nurse Ratched", role: "Nurse", department: "Psychiatry", email: "m.ratched@hospital.com", phone: "555-0103" },
  { id: "S004", name: "Dr. James Wilson", role: "Specialist", department: "Oncology", email: "j.wilson@hospital.com", phone: "555-0104" },
  { id: "S005", name: "Dr. Strange", role: "Doctor", department: "Surgery", email: "s.strange@hospital.com", phone: "555-0105" },
  { id: "S006", name: "Nurse Joy", role: "Nurse", department: "Emergency", email: "joy@hospital.com", phone: "555-0106" },
];

const initialInventory: InventoryItem[] = [
  { id: "INV-001", name: "MRI Machine (Philips)", category: "Medical Device", quantity: 2, location: "Radiology", status: "In Stock" },
  { id: "INV-002", name: "Amoxicillin 500mg", category: "Pharmaceuticals", quantity: 500, location: "Pharmacy A", status: "In Stock", expiryDate: "2025-12-01" },
  { id: "INV-003", name: "Surgical Scalpel #10", category: "Surgical", quantity: 50, location: "OR Supply", status: "Low Stock" },
  { id: "INV-004", name: "Paracetamol", category: "Pharmaceuticals", quantity: 1000, location: "Pharmacy B", status: "In Stock", expiryDate: "2026-01-15" },
  { id: "INV-005", name: "Defibrillator", category: "Medical Device", quantity: 10, location: "Emergency", status: "In Stock" },
  { id: "INV-006", name: "Sterile Gloves (Box)", category: "General", quantity: 0, location: "Storage 2", status: "Out of Stock" },
];

// ============ Context ============

interface CrmDataContextType {
  // Patient Records
  patients: PatientRecord[];
  addPatient: (patient: Omit<PatientRecord, "id">) => PatientRecord;
  updatePatient: (id: string, patient: Partial<PatientRecord>) => void;
  deletePatient: (id: string) => void;
  setPatients: React.Dispatch<React.SetStateAction<PatientRecord[]>>;

  // Lab Results
  labResults: LabResult[];
  addLabResult: (result: Omit<LabResult, "id">) => LabResult;
  updateLabResult: (id: string, result: Partial<LabResult>) => void;
  deleteLabResult: (id: string) => void;
  setLabResults: React.Dispatch<React.SetStateAction<LabResult[]>>;

  // Staff
  staff: StaffMember[];
  addStaffMember: (member: Omit<StaffMember, "id">) => StaffMember;
  updateStaffMember: (id: string, member: Partial<StaffMember>) => void;
  deleteStaffMember: (id: string) => void;
  setStaff: React.Dispatch<React.SetStateAction<StaffMember[]>>;

  // Inventory
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, "id">) => InventoryItem;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const CrmDataContext = createContext<CrmDataContextType | null>(null);

export function useCrmData() {
  const context = useContext(CrmDataContext);
  if (!context) {
    throw new Error("useCrmData must be used within a CrmDataProvider");
  }
  return context;
}

// ============ Provider ============

export function CrmDataProvider({ children }: { children: React.ReactNode }) {
  const [patients, setPatients] = useState<PatientRecord[]>(initialPatients);
  const [labResults, setLabResults] = useState<LabResult[]>(initialLabResults);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  // Patient operations
  const addPatient = useCallback((patient: Omit<PatientRecord, "id">) => {
    const newPatient: PatientRecord = {
      ...patient,
      id: `P-${1000 + Date.now() % 10000}`,
    };
    setPatients((prev) => [...prev, newPatient]);
    return newPatient;
  }, []);

  const updatePatient = useCallback((id: string, updates: Partial<PatientRecord>) => {
    setPatients((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const deletePatient = useCallback((id: string) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Lab Result operations
  const addLabResult = useCallback((result: Omit<LabResult, "id">) => {
    const newResult: LabResult = {
      ...result,
      id: `LAB-${new Date().getFullYear()}-${String(Date.now() % 10000).padStart(3, "0")}`,
    };
    setLabResults((prev) => [...prev, newResult]);
    return newResult;
  }, []);

  const updateLabResult = useCallback((id: string, updates: Partial<LabResult>) => {
    setLabResults((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }, []);

  const deleteLabResult = useCallback((id: string) => {
    setLabResults((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // Staff operations
  const addStaffMember = useCallback((member: Omit<StaffMember, "id">) => {
    const newMember: StaffMember = {
      ...member,
      id: `S${String(Date.now() % 10000).padStart(3, "0")}`,
    };
    setStaff((prev) => [...prev, newMember]);
    return newMember;
  }, []);

  const updateStaffMember = useCallback((id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const deleteStaffMember = useCallback((id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Inventory operations
  const addInventoryItem = useCallback((item: Omit<InventoryItem, "id">) => {
    const newItem: InventoryItem = {
      ...item,
      id: `INV-${String(Date.now() % 10000).padStart(3, "0")}`,
    };
    setInventory((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const updateInventoryItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, []);

  const deleteInventoryItem = useCallback((id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // Expose global functions for Tambo tools (same pattern as calendar-control.ts)
  useEffect(() => {
    type CrmWindow = Window & typeof globalThis & {
      handleAddPatient?: (patient: Omit<PatientRecord, "id">) => PatientRecord;
      handleAddLabResult?: (result: Omit<LabResult, "id">) => LabResult;
      handleAddStaffMember?: (member: Omit<StaffMember, "id">) => StaffMember;
      handleAddInventoryItem?: (item: Omit<InventoryItem, "id">) => InventoryItem;
    };
    const win = window as CrmWindow;
    win.handleAddPatient = addPatient;
    win.handleAddLabResult = addLabResult;
    win.handleAddStaffMember = addStaffMember;
    win.handleAddInventoryItem = addInventoryItem;

    return () => {
      delete win.handleAddPatient;
      delete win.handleAddLabResult;
      delete win.handleAddStaffMember;
      delete win.handleAddInventoryItem;
    };
  }, [addPatient, addLabResult, addStaffMember, addInventoryItem]);

  const value: CrmDataContextType = {
    patients, addPatient, updatePatient, deletePatient, setPatients,
    labResults, addLabResult, updateLabResult, deleteLabResult, setLabResults,
    staff, addStaffMember, updateStaffMember, deleteStaffMember, setStaff,
    inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem, setInventory,
  };

  return (
    <CrmDataContext.Provider value={value}>
      {children}
    </CrmDataContext.Provider>
  );
}
