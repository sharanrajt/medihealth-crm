// CRM interactive action tools for Tambo AI integration
// These compound tools navigate to the correct page AND perform the action
// Uses the same window global pattern as calendar-control.ts

import type { PatientRecord, LabResult, StaffMember, InventoryItem } from "@/lib/crm-data-store";

type CrmActionWindow = Window &
  typeof globalThis & {
    handleNavigateTo?: (tab: string) => void;
    handleHighlightItem?: (id: string) => void;
    handleShowToast?: (message: string, type?: string, action?: string) => void;
    handleAddPatient?: (patient: Omit<PatientRecord, "id">) => PatientRecord;
    handleAddLabResult?: (result: Omit<LabResult, "id">) => LabResult;
    handleAddStaffMember?: (member: Omit<StaffMember, "id">) => StaffMember;
    handleAddInventoryItem?: (item: Omit<InventoryItem, "id">) => InventoryItem;
    handleDeletePatient?: (id: string) => boolean;
    handleUpdatePatient?: (id: string, updates: Partial<PatientRecord>) => boolean;
    handleDeleteStaffMember?: (id: string) => boolean;
  };

function getWin(): CrmActionWindow {
  return window as CrmActionWindow;
}

function navigate(tab: string) {
  const win = getWin();
  if (typeof win.handleNavigateTo === "function") {
    win.handleNavigateTo(tab);
  }
}

function highlight(id: string) {
  const win = getWin();
  if (typeof win.handleHighlightItem === "function") {
    win.handleHighlightItem(id);
  }
}

function toast(message: string, type: string = "success", action?: string) {
  const win = getWin();
  if (typeof win.handleShowToast === "function") {
    win.handleShowToast(message, type, action);
  }
}

// ============ ACTION 1: Navigate & Add Staff Member ============
export async function navigateAndAddStaffTool({
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
  const win = getWin();
  
  // Step 1: Navigate to Staff page
  navigate("staff");
  
  // Step 2: Small delay for navigation animation
  await new Promise((r) => setTimeout(r, 300));
  
  // Step 3: Add the staff member
  if (typeof win.handleAddStaffMember === "function") {
    const newMember = win.handleAddStaffMember({ name, role, department, email, phone });
    
    // Step 4: Highlight the new item
    highlight(newMember.id);
    
    // Step 5: Show toast
    toast(`${name} added to staff directory as ${role}`, "success", "Staff Added");
    
    return {
      success: true,
      message: `✅ Navigated to Staff page and added ${name} (${role}) to ${department} department. The new staff card is highlighted on the page.`,
      staffMember: newMember,
    };
  }
  return { success: false, error: "Staff data store not mounted." };
}

// ============ ACTION 2: Navigate & Add Patient ============
export async function navigateAndAddPatientTool({
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
  const win = getWin();
  
  navigate("records");
  await new Promise((r) => setTimeout(r, 300));
  
  if (typeof win.handleAddPatient === "function") {
    const newPatient = win.handleAddPatient({ name, age, gender, diagnosis, department, status, admissionDate });
    
    highlight(newPatient.id);
    toast(`Patient ${name} registered — ${status}`, "success", "Patient Added");
    
    return {
      success: true,
      message: `✅ Navigated to Records page and registered ${name} (${age}/${gender.charAt(0)}) with ${diagnosis} in ${department}. Status: ${status}. The row is highlighted in the table.`,
      patient: newPatient,
    };
  }
  return { success: false, error: "Patient data store not mounted." };
}

// ============ ACTION 3: Navigate & Add Inventory Item ============
export async function navigateAndAddInventoryTool({
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
  const win = getWin();
  
  navigate("inventory");
  await new Promise((r) => setTimeout(r, 300));
  
  if (typeof win.handleAddInventoryItem === "function") {
    const newItem = win.handleAddInventoryItem({ name, category, quantity, location, status, expiryDate });
    
    highlight(newItem.id);
    toast(`${name} (×${quantity}) added to inventory`, "success", "Inventory Updated");
    
    return {
      success: true,
      message: `✅ Navigated to Inventory page and added ${name} (${category}, qty: ${quantity}) at ${location}. Status: ${status}. The item is highlighted.`,
      inventoryItem: newItem,
    };
  }
  return { success: false, error: "Inventory data store not mounted." };
}

// ============ ACTION 4: Navigate & Add Lab Result ============
export async function navigateAndAddLabResultTool({
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
  const win = getWin();
  
  navigate("lab");
  await new Promise((r) => setTimeout(r, 300));
  
  if (typeof win.handleAddLabResult === "function") {
    const newResult = win.handleAddLabResult({ patientName, testType, date, status, doctor, priority, resultSummary });
    
    highlight(newResult.id);
    toast(`${testType} ordered for ${patientName}`, "success", "Lab Order Created");
    
    return {
      success: true,
      message: `✅ Navigated to Lab Results page and created ${testType} order for ${patientName}. Priority: ${priority}, Status: ${status}. The result is highlighted.`,
      labResult: newResult,
    };
  }
  return { success: false, error: "Lab data store not mounted." };
}

// ============ ACTION 5: Navigate & Delete Patient ============
export async function navigateAndDeletePatientTool({
  patientId,
  patientName,
}: {
  patientId: string;
  patientName?: string;
}) {
  const win = getWin();
  
  navigate("records");
  await new Promise((r) => setTimeout(r, 300));
  
  // First highlight the row being deleted
  highlight(patientId);
  await new Promise((r) => setTimeout(r, 800));
  
  if (typeof win.handleDeletePatient === "function") {
    const success = win.handleDeletePatient(patientId);
    if (success) {
      toast(`Patient ${patientName || patientId} removed from records`, "warning", "Patient Deleted");
      return {
        success: true,
        message: `✅ Navigated to Records page and deleted patient record ${patientName || patientId} (${patientId}).`,
      };
    }
    return { success: false, error: `Patient with ID ${patientId} not found.` };
  }
  return { success: false, error: "Patient data store not mounted." };
}

// ============ ACTION 6: Navigate & Update Patient Status ============
export async function navigateAndUpdatePatientTool({
  patientId,
  patientName,
  status,
  diagnosis,
  department,
}: {
  patientId: string;
  patientName?: string;
  status?: "Admitted" | "Outpatient" | "Discharged" | "Critical";
  diagnosis?: string;
  department?: string;
}) {
  const win = getWin();
  
  navigate("records");
  await new Promise((r) => setTimeout(r, 300));
  
  if (typeof win.handleUpdatePatient === "function") {
    const updates: Partial<PatientRecord> = {};
    if (status) updates.status = status;
    if (diagnosis) updates.diagnosis = diagnosis;
    if (department) updates.department = department;
    
    const success = win.handleUpdatePatient(patientId, updates);
    if (success) {
      highlight(patientId);
      
      const changeDesc = [
        status && `status → ${status}`,
        diagnosis && `diagnosis → ${diagnosis}`,
        department && `department → ${department}`,
      ].filter(Boolean).join(", ");
      
      toast(`${patientName || patientId} updated: ${changeDesc}`, "info", "Patient Updated");
      
      return {
        success: true,
        message: `✅ Navigated to Records page and updated patient ${patientName || patientId}. Changes: ${changeDesc}. The updated row is highlighted.`,
      };
    }
    return { success: false, error: `Patient with ID ${patientId} not found.` };
  }
  return { success: false, error: "Patient data store not mounted." };
}
