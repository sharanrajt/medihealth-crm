"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

// ============ Type Definitions ============

export interface PatientVitals {
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  lastChecked: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  diagnosis: string;
  department: string;
  status: "Admitted" | "Outpatient" | "Discharged" | "Critical";
  admissionDate: string;
  vitals?: PatientVitals;
}

export interface AmbulanceUnit {
  id: string;
  status: "Available" | "Dispatched" | "En Route" | "On Scene" | "Transporting" | "Returning";
  crew: { driver: string; paramedic: string; emt: string };
  vehicle: string;
  location: string;
  destination?: string;
  eta?: string;
  dispatchTime?: string;
  callType?: string;
  triageLevel?: "Red - Immediate" | "Yellow - Delayed" | "Green - Minor" | "Black - Deceased";
  patientInfo?: string;
  radioChannel: string;
  mileage: number;
  coordinate: { x: number; y: number };
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
  { id: "P-1024", name: "John Doe", age: 45, gender: "Male", diagnosis: "Hypertension", department: "Cardiology", status: "Admitted", admissionDate: "2024-03-10", vitals: { heartRate: 88, bloodPressureSystolic: 152, bloodPressureDiastolic: 94, temperature: 37.1, oxygenSaturation: 97, respiratoryRate: 18, lastChecked: "10 min ago" } },
  { id: "P-1025", name: "Jane Smith", age: 32, gender: "Female", diagnosis: "Migraine", department: "Neurology", status: "Outpatient", admissionDate: "2024-03-12", vitals: { heartRate: 72, bloodPressureSystolic: 118, bloodPressureDiastolic: 76, temperature: 36.8, oxygenSaturation: 99, respiratoryRate: 16, lastChecked: "1 hr ago" } },
  { id: "P-1026", name: "Robert Chase", age: 28, gender: "Male", diagnosis: "Fractured Tibia", department: "Orthopedics", status: "Admitted", admissionDate: "2024-03-14", vitals: { heartRate: 78, bloodPressureSystolic: 122, bloodPressureDiastolic: 80, temperature: 37.3, oxygenSaturation: 98, respiratoryRate: 17, lastChecked: "25 min ago" } },
  { id: "P-1027", name: "Emily Rose", age: 67, gender: "Female", diagnosis: "Pneumonia", department: "Pulmonology", status: "Critical", vitals: { heartRate: 112, bloodPressureSystolic: 98, bloodPressureDiastolic: 62, temperature: 39.2, oxygenSaturation: 89, respiratoryRate: 28, lastChecked: "2 min ago" }, admissionDate: "2024-03-15" },
  { id: "P-1028", name: "Michael Scott", age: 50, gender: "Male", diagnosis: "Gastritis", department: "Gastroenterology", status: "Discharged", admissionDate: "2024-03-01", vitals: { heartRate: 70, bloodPressureSystolic: 120, bloodPressureDiastolic: 78, temperature: 36.6, oxygenSaturation: 98, respiratoryRate: 15, lastChecked: "At discharge" } },
];

const initialAmbulances: AmbulanceUnit[] = [
  {
    id: "MEDIC-7",
    status: "En Route",
    crew: { driver: "Tom Bradley", paramedic: "Sarah Chen", emt: "James Ortiz" },
    vehicle: "Type III - Ford E-450",
    location: "I-95 Southbound, Mile Marker 42",
    destination: "MediHealth General - ER Bay 3",
    eta: "4 min",
    dispatchTime: "19:02",
    callType: "10-52 — Cardiac Emergency",
    triageLevel: "Red - Immediate",
    patientInfo: "62M, chest pain, diaphoresis, STEMI alert activated",
    radioChannel: "TAC-2",
    mileage: 48230,
    coordinate: { x: 35, y: 30 },
  },
  {
    id: "MEDIC-3",
    status: "On Scene",
    crew: { driver: "Maria Gonzalez", paramedic: "David Park", emt: "Lisa Thompson" },
    vehicle: "Type I - Freightliner M2",
    location: "1847 Oakwood Dr, Apt 4B",
    destination: "MediHealth General - Trauma Center",
    eta: "-",
    dispatchTime: "18:47",
    callType: "10-50 — Motor Vehicle Accident",
    triageLevel: "Yellow - Delayed",
    patientInfo: "34F, GCS 13, suspected C-spine injury, immobilized",
    radioChannel: "TAC-1",
    mileage: 51890,
    coordinate: { x: 65, y: 25 },
  },
  {
    id: "MEDIC-12",
    status: "Transporting",
    crew: { driver: "Kevin Wright", paramedic: "Angela Morris", emt: "Ryan Patel" },
    vehicle: "Type II - Ram ProMaster",
    location: "Route 9 Eastbound",
    destination: "MediHealth General - ER Bay 1",
    eta: "8 min",
    dispatchTime: "18:31",
    callType: "10-56 — Respiratory Distress",
    triageLevel: "Red - Immediate",
    patientInfo: "71F, SpO2 82%, severe dyspnea, COPD history, on 15L NRB",
    radioChannel: "TAC-3",
    mileage: 39450,
    coordinate: { x: 80, y: 60 },
  },
  {
    id: "MEDIC-5",
    status: "Returning",
    crew: { driver: "Chris Nakamura", paramedic: "Priya Sharma", emt: "Derek Collins" },
    vehicle: "Type III - Ford E-450",
    location: "Highway 101 Northbound",
    destination: "Station 5 - Downtown",
    eta: "11 min",
    dispatchTime: "17:55",
    callType: "10-45 — Patient Transfer",
    triageLevel: "Green - Minor",
    patientInfo: "Transfer complete — 45M stable post-appendectomy",
    radioChannel: "TAC-1",
    mileage: 62100,
    coordinate: { x: 20, y: 75 },
  },
  {
    id: "MEDIC-9",
    status: "Available",
    crew: { driver: "Marcus Johnson", paramedic: "Emily Watson", emt: "Alex Rivera" },
    vehicle: "Type I - International TerraStar",
    location: "Station 2 - Westside",
    radioChannel: "TAC-2",
    mileage: 44780,
    coordinate: { x: 50, y: 50 },
  },
  {
    id: "MEDIC-1",
    status: "Dispatched",
    crew: { driver: "Robert Kim", paramedic: "Natasha Volkov", emt: "Samuel Osei" },
    vehicle: "Type III - Chevrolet G4500",
    location: "Station 1 - Central",
    destination: "2291 Pine Street — Residential",
    eta: "6 min",
    dispatchTime: "19:06",
    callType: "10-54 — Possible Stroke",
    triageLevel: "Red - Immediate",
    patientInfo: "58F, sudden onset slurred speech, left-side weakness, FAST positive",
    radioChannel: "TAC-4",
    mileage: 55320,
    coordinate: { x: 45, y: 15 },
  },
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

  // Ambulances
  ambulances: AmbulanceUnit[];
  updateAmbulance: (id: string, updates: Partial<AmbulanceUnit>) => void;
  setAmbulances: React.Dispatch<React.SetStateAction<AmbulanceUnit[]>>;
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
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>(initialAmbulances);

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

  // Ambulance operations
  const updateAmbulance = useCallback((id: string, updates: Partial<AmbulanceUnit>) => {
    setAmbulances((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
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
    ambulances, updateAmbulance, setAmbulances,
  };
  return (
    <CrmDataContext.Provider value={value}>
      {children}
    </CrmDataContext.Provider>
  );
}
