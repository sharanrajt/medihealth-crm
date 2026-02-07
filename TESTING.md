# 🧪 MediHealthCRM — Testing Prompts Guide

A comprehensive collection of prompts to test every AI-powered feature in MediHealthCRM. Use these in the chat panel on the right side of the application.

---

## 📋 Table of Contents

1. [Add Patient (CRM Tool)](#1--add-patient)
2. [Add Lab Result (CRM Tool)](#2--add-lab-result)
3. [Add Staff Member (CRM Tool)](#3--add-staff-member)
4. [Add Inventory Item (CRM Tool)](#4--add-inventory-item)
5. [Patient Summary Card (Component)](#5--patient-summary-card)
6. [Vitals Display (Component)](#6--vitals-display)
7. [Prescription Card (Component)](#7--prescription-card)
8. [Appointment Card (Component)](#8--appointment-card)
9. [Lab Result Card (Component)](#9--lab-result-card)
10. [Bed Availability (Component)](#10--bed-availability)
11. [Calendar Control (Tool)](#11--calendar-control)
12. [Combined / Multi-Step Scenarios](#12--combined--multi-step-scenarios)
13. [Edge Cases & Error Handling](#13--edge-cases--error-handling)

---

## 1. 🏥 Add Patient

These prompts test the `addPatient` tool. After each prompt, navigate to the **Records** page to verify the patient appears.

### Basic Prompts

```
Add a new patient named John Doe, age 45, male, diagnosed with Type 2 Diabetes, in the Endocrinology department, status Admitted, admission date 2026-02-07
```

```
Register patient Sarah Johnson, 32 years old, female, with pneumonia in the Pulmonology department as an outpatient, admitted on 2026-02-05
```

```
Add a critical patient: Raj Patel, male, age 67, diagnosed with acute myocardial infarction, Cardiology department, admitted today
```

### Natural Language Prompts

```
I need to add a new patient. Her name is Emily Chen, she's 28, female, came in with a fractured tibia. She's in Orthopedics and was admitted on February 3rd, 2026.
```

```
We just received a new patient — Michael Brown, 55, male. He's been diagnosed with chronic kidney disease stage 3. Put him in Nephrology as an outpatient. Admission date is today.
```

```
Please register a discharged patient: Anna Williams, 41, female, was treated for appendicitis in General Surgery, discharged. She was admitted on 2026-01-20.
```

### Stress Test Prompts

```
Add patient Maria Garcia, age 8, female, diagnosed with acute lymphoblastic leukemia, Pediatric Oncology department, critical status, admitted 2026-02-01
```

```
Register a new patient: Dr. James Wilson (yes, he's a patient now), 52, male, hypertension and type 2 diabetes comorbidity, Internal Medicine, outpatient, admission date 2026-02-06
```

---

## 2. 🧪 Add Lab Result

These prompts test the `addLabResult` tool. After each prompt, navigate to the **Lab Results** page to verify.

### Basic Prompts

```
Add a lab result: Complete Blood Count for patient Sarah Johnson, ordered by Dr. Smith, date 2026-02-07, status Completed, routine priority, result summary shows normal values
```

```
Order a new lab test: Liver Function Test for patient John Doe, ordered by Dr. Patel, date 2026-02-07, status Pending, high priority, result summary pending
```

```
Add a critical lab result: Troponin I test for Raj Patel, ordered by Dr. Kumar, date 2026-02-07, completed, critical priority, result summary shows elevated troponin levels indicating MI
```

### Natural Language Prompts

```
I need to order a blood glucose test for Emily Chen. Dr. Williams is ordering it. It's routine priority and the status is processing. Date is today.
```

```
We got lab results back for Michael Brown — it's a Comprehensive Metabolic Panel ordered by Dr. Anderson. Completed today, high priority. Summary: elevated creatinine and BUN levels consistent with CKD stage 3.
```

```
Please add a urinalysis test for Anna Williams, ordered by Dr. Lee, pending status, routine priority, dated February 7th 2026. No results yet.
```

### Batch Testing

```
Order a lipid panel for John Doe, ordered by Dr. Smith, routine priority, processing status, dated today. Result summary is pending.
```

```
Add a completed HbA1c test for John Doe, ordered by Dr. Patel, date 2026-02-07, routine priority. Result summary: HbA1c at 7.2% indicating fair glycemic control.
```

---

## 3. 👨‍⚕️ Add Staff Member

These prompts test the `addStaffMember` tool. After each prompt, navigate to the **Staff** page to verify.

### Basic Prompts

```
Add a new doctor: Dr. Priya Sharma, Cardiologist, Cardiology department, email priya.sharma@medihealth.com, phone 555-0101
```

```
Register a new nurse: James Rodriguez, Nurse, Emergency department, email james.rodriguez@medihealth.com, phone 555-0202
```

```
Add staff member: Lisa Park, Pharmacist, Pharmacy department, email lisa.park@medihealth.com, phone 555-0303
```

### Natural Language Prompts

```
We just hired a new technician named Alex Turner for the Radiology department. His email is alex.turner@medihealth.com and phone is 555-0404.
```

```
Please add Dr. Fatima Al-Hassan as a Specialist in the Neurology department. Her contact is fatima.alhassan@medihealth.com, phone 555-0505.
```

```
Register a new admin staff member: David Kim, Admin role, Hospital Administration department, david.kim@medihealth.com, 555-0606
```

### Different Roles

```
Add a new doctor: Dr. Robert Chen, Doctor, Orthopedics department, robert.chen@medihealth.com, 555-0701
```

```
Add a new nurse: Maria Santos, Nurse, ICU department, maria.santos@medihealth.com, 555-0702
```

```
Add a new technician: Tom Baker, Technician, Laboratory department, tom.baker@medihealth.com, 555-0703
```

---

## 4. 📦 Add Inventory Item

These prompts test the `addInventoryItem` tool. After each prompt, navigate to the **Inventory** page to verify.

### Basic Prompts

```
Add inventory item: Surgical Masks, category General, quantity 5000, location Warehouse A, status In Stock
```

```
Add to inventory: Amoxicillin 500mg, Pharmaceuticals category, 200 units, Pharmacy Storage Room B, In Stock, expires 2027-06-15
```

```
Add a new medical device: Portable ECG Monitor, Medical Device category, 3 units, ICU Equipment Room, In Stock
```

### Natural Language Prompts

```
We need to add surgical gloves to inventory. We have 10000 pairs in Warehouse A. They're general supplies and in stock. Expiry date is December 2027.
```

```
Please add 50 units of Morphine Sulfate 10mg to the inventory. It's a pharmaceutical, stored in Pharmacy Controlled Substances Cabinet, in stock, expires March 2027.
```

```
We're running low on IV cannulas — add them to inventory: Surgical category, only 15 left in the ER Supply Room, mark as Low Stock
```

### Stock Status Testing

```
Add inventory: Ventilator Filters, Medical Device, 0 units, ICU Storage, Out of Stock
```

```
Add to inventory: Sterile Bandages, General category, 25 units, ER Supply Room, Low Stock, expires 2027-12-31
```

```
Add inventory item: Defibrillator Pads, Medical Device, 150 units, Emergency Equipment Room, In Stock, expires 2028-01-15
```

---

## 5. 🩺 Patient Summary Card

These prompts test the `PatientSummaryCard` generative UI component rendered in chat.

### Basic Prompts

```
Show me the patient summary for John Doe, age 45, male, diagnosed with Type 2 Diabetes, Endocrinology department, Admitted status, admitted on 2026-01-15, blood type A+, allergies to Penicillin and Sulfa drugs, attending doctor is Dr. Patel
```

```
Display patient info: Sarah Johnson, 32, female, pneumonia, Pulmonology, Outpatient, admitted 2026-02-05, blood type O-, no known allergies, attending Dr. Williams
```

```
Show me a patient card for a critical patient: Raj Patel, 67, male, acute myocardial infarction, Cardiology, Critical, admitted 2026-02-07, blood type B+, allergic to Aspirin and Iodine, attending Dr. Kumar
```

### Minimal Info Prompt

```
Show patient summary: Emily Chen, 28, female, fractured tibia, Orthopedics, Admitted, admitted 2026-02-03
```

---

## 6. 💓 Vitals Display

These prompts test the `VitalsDisplay` generative UI component.

### Normal Vitals

```
Show vitals for patient John Doe: heart rate 72 bpm, blood pressure 120/80, temperature 36.8°C, oxygen saturation 98%, respiratory rate 16 per minute, measured just now
```

### Abnormal Vitals

```
Display vitals for Raj Patel: heart rate 110 bpm, blood pressure 90/60, temperature 38.5°C, oxygen saturation 91%, respiratory rate 24 per minute. Notes: Patient showing signs of cardiogenic shock, continuous monitoring required.
```

### Critical Vitals

```
Show vitals for critical patient Maria Garcia: heart rate 145 bpm, blood pressure 80/50, temperature 39.2°C, oxygen saturation 85%, respiratory rate 32 per minute. Notes: Septic shock suspected, immediate intervention required.
```

### Post-Surgery Vitals

```
Display post-operative vitals for Emily Chen: heart rate 88 bpm, blood pressure 115/75, temperature 37.1°C, oxygen saturation 96%, respiratory rate 18 per minute, measured at 2:30 PM. Notes: Stable post-surgery, pain managed with IV analgesics.
```

---

## 7. 💊 Prescription Card

These prompts test the `PrescriptionCard` generative UI component.

### Single Medication

```
Show a prescription for John Doe from Dr. Patel, dated 2026-02-07, diagnosis Type 2 Diabetes. Medication: Metformin 500mg, twice daily, for 90 days, take with meals. Notes: Monitor blood glucose weekly.
```

### Multiple Medications

```
Display prescription for Raj Patel from Dr. Kumar, dated 2026-02-07, diagnosis acute myocardial infarction. Medications: 1) Aspirin 81mg, once daily, 30 days, take in the morning; 2) Atorvastatin 40mg, once daily at bedtime, 90 days; 3) Metoprolol 25mg, twice daily, 30 days, do not stop abruptly; 4) Clopidogrel 75mg, once daily, 12 months, take with food. Notes: Follow up in 2 weeks, cardiac rehab recommended.
```

### Pediatric Prescription

```
Show prescription for Maria Garcia from Dr. Lopez, dated 2026-02-07, diagnosis acute lymphoblastic leukemia. Medications: 1) Vincristine 1.5mg/m², IV weekly, 4 weeks, administer in clinic; 2) Prednisone 40mg/m², daily, 28 days, taper as directed; 3) Ondansetron 4mg, as needed, 28 days, for nausea. Notes: Monitor CBC weekly, report fever immediately.
```

---

## 8. 📅 Appointment Card

These prompts test the `AppointmentCard` generative UI component.

### Standard Appointment

```
Show an appointment card: Patient John Doe with Dr. Patel, Endocrinology department, date 2026-02-14, time 10:00 AM, type Follow-up, status Scheduled, room 305. Notes: Review HbA1c results and adjust medication.
```

### Surgery Appointment

```
Display appointment: Emily Chen with Dr. Roberts, Orthopedics, date 2026-02-10, time 7:30 AM, type Surgery, status Scheduled, room OR-2. Notes: Tibial fracture ORIF, NPO after midnight.
```

### Emergency Appointment

```
Show appointment card: Raj Patel with Dr. Kumar, Cardiology, date 2026-02-07, time 3:00 PM, type Emergency, status In Progress, room CCU-4. Notes: Emergency cardiac catheterization.
```

### Cancelled Appointment

```
Display appointment: Michael Brown with Dr. Anderson, Nephrology, date 2026-02-12, time 2:00 PM, type Consultation, status Cancelled, room 210. Notes: Patient rescheduled to next week.
```

---

## 9. 🔬 Lab Result Card

These prompts test the `LabResultCard` generative UI component (detailed with individual test values).

### Complete Blood Count

```
Show lab results for Sarah Johnson: Complete Blood Count, dated 2026-02-07, ordered by Dr. Williams, routine priority, completed. Results: WBC 7.5 x10^9/L (4.0-11.0, Normal), RBC 4.8 x10^12/L (4.0-5.5, Normal), Hemoglobin 13.5 g/dL (12.0-16.0, Normal), Hematocrit 40% (36-46, Normal), Platelets 250 x10^9/L (150-400, Normal). Summary: All values within normal limits.
```

### Abnormal Results

```
Display lab results for Michael Brown: Comprehensive Metabolic Panel, dated 2026-02-07, ordered by Dr. Anderson, high priority, completed. Results: Creatinine 3.2 mg/dL (0.7-1.3, Critical), BUN 45 mg/dL (7-20, Abnormal), eGFR 35 mL/min (>60, Abnormal), Sodium 138 mEq/L (136-145, Normal), Potassium 5.1 mEq/L (3.5-5.0, Abnormal), Glucose 110 mg/dL (70-100, Abnormal). Summary: Elevated creatinine and BUN consistent with CKD stage 3b, hyperkalemia noted.
```

### Pending Results

```
Show lab results for Emily Chen: Pre-operative Panel, dated 2026-02-08, ordered by Dr. Roberts, high priority, processing. Results: PT 12.5 seconds (11-13.5, Normal), INR 1.0 (0.8-1.2, Normal), aPTT pending seconds (25-35, Normal), CBC pending (-, Normal), BMP pending (-, Normal). Summary: Coagulation studies normal, awaiting remaining results.
```

---

## 10. 🛏️ Bed Availability

These prompts test the `BedAvailability` generative UI component.

### Full Hospital Overview

```
Show bed availability for MediHealth General Hospital: 500 total beds, 445 occupied. Wards: ICU - 50 total, 48 occupied, Critical Care department; General Ward A - 100 total, 92 occupied, Internal Medicine; General Ward B - 100 total, 88 occupied, General Surgery; Pediatric Ward - 60 total, 45 occupied, Pediatrics; Maternity Ward - 40 total, 35 occupied, Obstetrics; Cardiac Ward - 50 total, 47 occupied, Cardiology; Orthopedic Ward - 50 total, 42 occupied, Orthopedics; Emergency Beds - 50 total, 48 occupied, Emergency. Last updated: 2026-02-07 5:00 PM.
```

### Low Availability Alert

```
Display bed availability: 200 total beds, 195 occupied. Wards: ICU - 20 total, 20 occupied, Critical Care; ER Beds - 30 total, 29 occupied, Emergency; General Ward - 80 total, 78 occupied, Internal Medicine; Surgical Ward - 70 total, 68 occupied, Surgery. Last updated now.
```

### Ward-Specific Query

```
Show bed availability for the hospital: 300 total beds, 210 occupied. Wards: Cardiology Ward - 40 total, 38 occupied, Cardiology; Neurology Ward - 35 total, 20 occupied, Neurology; Oncology Ward - 45 total, 40 occupied, Oncology; Rehabilitation - 30 total, 15 occupied, Physical Therapy; Psychiatric Ward - 25 total, 22 occupied, Psychiatry. Last updated: February 7, 2026 at 3:30 PM.
```

---

## 11. 📅 Calendar Control

These prompts test the `calendarControl` tool. Watch the **Calendar** page for changes.

### Add Events

```
Add a meeting to the calendar on 2026-02-14 at 10:00 AM called "Department Heads Meeting" with blue color
```

```
Schedule a surgery for February 20th, 2026 at 7:30 AM — "ORIF Surgery - Emily Chen" with red color
```

```
Add a calendar event: "Staff Training - New Equipment" on 2026-02-25 at 2:00 PM, green color
```

### Navigate Calendar

```
Navigate the calendar to March 2026
```

```
Go to today's date on the calendar
```

```
Show me December 2026 on the calendar
```

### Highlight Dates

```
Highlight these dates on the calendar: 2026-02-10, 2026-02-14, 2026-02-20, 2026-02-25
```

### Select Date

```
Select February 14th, 2026 on the calendar and show me the events
```

### Remove Events

```
Remove the event "Department Heads Meeting" from February 14th, 2026
```

### Multiple Operations

```
Navigate to February 2026, add an event "Board Review" on 2026-02-28 at 9:00 AM with purple color, and highlight February 14th and 28th
```

---

## 12. 🔄 Combined / Multi-Step Scenarios

These prompts test multiple features in sequence. Run them one after another.

### Scenario A: New Patient Admission Flow

```
Step 1: Add a new patient named Thomas Anderson, age 50, male, diagnosed with pneumothorax, Emergency department, Critical status, admitted today
```
```
Step 2: Show vitals for Thomas Anderson: heart rate 105, blood pressure 100/65, temperature 37.4°C, oxygen 89%, respiratory rate 28. Notes: Right-sided pneumothorax, chest tube insertion planned.
```
```
Step 3: Order a chest X-ray lab test for Thomas Anderson, ordered by Dr. Martinez, critical priority, processing status, dated today. Result summary pending.
```
```
Step 4: Show an appointment card for Thomas Anderson with Dr. Martinez, Emergency department, today at 4:00 PM, type Emergency, status In Progress, room ER-3. Notes: Chest tube insertion procedure.
```
```
Step 5: Write a prescription for Thomas Anderson from Dr. Martinez, dated today, diagnosis pneumothorax. Medications: 1) Morphine 4mg IV, every 4 hours as needed, 3 days, for pain management; 2) Cefazolin 1g IV, every 8 hours, 5 days, prophylactic antibiotic. Notes: Monitor chest tube output, repeat CXR in 24 hours.
```

### Scenario B: Staff Onboarding + Inventory Check

```
Step 1: Add a new specialist: Dr. Nina Patel, Specialist, Pulmonology department, nina.patel@medihealth.com, 555-0901
```
```
Step 2: Add 100 units of Chest Drainage Kits to inventory, Surgical category, stored in ER Supply Room, In Stock, expires 2027-08-15
```
```
Step 3: Show bed availability: 500 total beds, 430 occupied. Wards: ICU - 50 total, 46 occupied, Critical Care; Pulmonology Ward - 40 total, 35 occupied, Pulmonology; ER Beds - 30 total, 28 occupied, Emergency.
```

### Scenario C: Full Day Operations

```
Step 1: Add a calendar event "Morning Rounds" on 2026-02-10 at 8:00 AM, blue color
```
```
Step 2: Add patient Lisa Wong, 38, female, diagnosed with gestational diabetes, Obstetrics department, Admitted, admitted 2026-02-10
```
```
Step 3: Order a glucose tolerance test for Lisa Wong, ordered by Dr. Chen, routine priority, pending status, dated 2026-02-10. Result summary pending.
```
```
Step 4: Add 500 units of Insulin Glargine to inventory, Pharmaceuticals, Pharmacy Cold Storage, In Stock, expires 2027-03-01
```
```
Step 5: Schedule a follow-up: appointment for Lisa Wong with Dr. Chen, Obstetrics, 2026-02-17 at 11:00 AM, Follow-up, Scheduled, room 412. Notes: Review glucose tolerance test results.
```

---

## 13. ⚠️ Edge Cases & Error Handling

### Minimal Information

```
Add a patient named Test User, age 25, male, headache, General, Outpatient, admitted today
```

### Long Text Fields

```
Add a patient named Alexandra Elizabeth Montgomery-Richardson, age 34, female, diagnosed with systemic lupus erythematosus with secondary antiphospholipid syndrome and lupus nephritis class IV, Rheumatology and Nephrology department, Admitted, admitted 2026-02-07
```

### Special Characters

```
Add staff member: Dr. María José García-López, Doctor, Internal Medicine department, maria.garcia-lopez@medihealth.com, +1-555-0808
```

### Zero Quantity Inventory

```
Add inventory item: N95 Respirators, General category, 0 units, Warehouse B, Out of Stock
```

### Future Date Testing

```
Add a lab result: MRI Brain for patient John Doe, ordered by Dr. Smith, date 2026-03-15, status Pending, routine priority, result summary awaiting scan
```

### Rapid Sequential Additions

Run these quickly one after another:
```
Add patient Patient A, 30, male, flu, ER, Outpatient, admitted today
```
```
Add patient Patient B, 45, female, migraine, Neurology, Outpatient, admitted today
```
```
Add patient Patient C, 60, male, chest pain, Cardiology, Admitted, admitted today
```

---

## ✅ Verification Checklist

After running the test prompts, verify the following:

| Check | How to Verify |
|-------|---------------|
| ✅ Patient added via chat appears in Records page | Click Records tab in the floating dock |
| ✅ Lab result added via chat appears in Lab Results page | Click Lab Results tab |
| ✅ Staff member added via chat appears in Staff page | Click Staff tab |
| ✅ Inventory item added via chat appears in Inventory page | Click Inventory tab |
| ✅ Calendar events appear on the Calendar page | Click Calendar tab |
| ✅ Patient Summary Card renders in chat | Check chat panel for rendered card |
| ✅ Vitals Display renders with color-coded indicators | Check chat panel |
| ✅ Prescription Card renders with medication list | Check chat panel |
| ✅ Appointment Card renders with correct status badge | Check chat panel |
| ✅ Lab Result Card renders with reference ranges | Check chat panel |
| ✅ Bed Availability renders with occupancy bar | Check chat panel |
| ✅ Search/filter works on newly added data | Use search bars on CRM pages |
| ✅ Data persists across tab switches | Switch between CRM tabs |
| ✅ Multiple items can be added in sequence | Run batch tests |

---

## 📝 Notes

- **Data Persistence**: Data added via chat is stored in React state (in-memory). It will reset on page refresh.
- **Real-Time Sync**: Data added via chat should appear immediately on the corresponding CRM page without needing to refresh.
- **Tab Switching**: After adding data via chat, switch to the relevant CRM tab using the floating dock at the bottom to verify.
- **Generative UI**: Components like PatientSummaryCard, VitalsDisplay, etc. are rendered directly in the chat panel — they don't add data to CRM pages, they just display information.
- **Tools vs Components**: Tools (addPatient, addLabResult, etc.) modify CRM data. Components (PatientSummaryCard, VitalsDisplay, etc.) only render UI in chat.
