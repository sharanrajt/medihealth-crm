"use client";

// Central configuration file for Tambo components and tools
// Healthcare CRM components for MediHealthCRM
// Read more about Tambo at https://tambo.co/docs

import { TamboComponent, TamboTool } from "@tambo-ai/react";

import { calendarControlTool } from "@/services/calendar-control";
import { PatientSummaryCard } from "@/components/tambo/patient-summary-card";
import { VitalsDisplay } from "@/components/tambo/vitals-display";
import { PrescriptionCard } from "@/components/tambo/prescription-card";
import { AppointmentCard } from "@/components/tambo/appointment-card";
import { LabResultCard } from "@/components/tambo/lab-result-card";
import { BedAvailability } from "@/components/tambo/bed-availability";


export const tools: TamboTool[] = [
  {
    name: "calendarControl",
    description:
      "Control the calendar UI. Navigate to a specific month/year, highlight dates, select a date, add or remove events, or navigate to today. Use this when the user asks about calendar operations, scheduling, adding/removing events, or navigating dates.",
    tool: calendarControlTool,
    inputSchema: {
      type: "object",
      properties: {
        year: {
          type: "number",
          description: "Year to navigate to (e.g. 2026)",
        },
        month: {
          type: "number",
          description: "Month to navigate to (0-indexed: 0=January, 11=December)",
        },
        highlightDates: {
          type: "array",
          items: { type: "string" },
          description: "Array of date strings (YYYY-MM-DD) to highlight on the calendar",
        },
        selectDate: {
          type: "string",
          description: "Date string (YYYY-MM-DD) to select and show events for",
        },
        addEvent: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date string (YYYY-MM-DD) for the event" },
            event: { type: "string", description: "Event description/title" },
            time: { type: "string", description: "Optional time for the event (HH:MM format)" },
            color: {
              type: "string",
              enum: ["blue", "green", "red", "purple", "orange", "teal"],
              description: "Optional color for the event indicator",
            },
          },
          required: ["date", "event"],
          description: "Add an event to a specific date",
        },
        removeEvent: {
          type: "object",
          properties: {
            date: { type: "string", description: "Date string (YYYY-MM-DD) of the event to remove" },
            event: { type: "string", description: "Exact event description/title to remove" },
          },
          required: ["date", "event"],
          description: "Remove an event from a specific date",
        },
        navigateToToday: {
          type: "boolean",
          description: "If true, navigate the calendar to today's date",
        },
      },
    },
    outputSchema: {
      type: "object",
      properties: {
        success: { type: "boolean", description: "Whether the operation succeeded" },
        error: { type: "string", description: "Error message if the operation failed" },
      },
      required: ["success"],
    },
  },
];


export const components: TamboComponent[] = [
  {
    name: "PatientSummaryCard",
    description:
      "Display a patient summary card with name, age, gender, diagnosis, department, status, admission date, blood type, allergies, and attending doctor. Use this when the user asks about a specific patient's information or record.",
    component: PatientSummaryCard,
    propsSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Patient full name" },
        age: { type: "number", description: "Patient age in years" },
        gender: { type: "string", description: "Patient gender" },
        diagnosis: { type: "string", description: "Primary diagnosis" },
        department: { type: "string", description: "Hospital department" },
        status: {
          type: "string",
          enum: ["Admitted", "Outpatient", "Discharged", "Critical"],
          description: "Current patient status",
        },
        admissionDate: { type: "string", description: "Date of admission (e.g. 2025-01-15)" },
        bloodType: { type: "string", description: "Blood type (e.g. A+, O-)" },
        allergies: {
          type: "array",
          items: { type: "string" },
          description: "List of known allergies",
        },
        attendingDoctor: { type: "string", description: "Name of attending doctor" },
      },
      required: ["name", "age", "gender", "diagnosis", "department", "status", "admissionDate"],
    },
  },

  {
    name: "VitalsDisplay",
    description:
      "Display a patient's vital signs including heart rate, blood pressure, temperature, oxygen saturation, and respiratory rate with color-coded status indicators. Use this when the user asks about a patient's vitals or health metrics.",
    component: VitalsDisplay,
    propsSchema: {
      type: "object",
      properties: {
        patientName: { type: "string", description: "Patient name" },
        heartRate: { type: "number", description: "Heart rate in bpm" },
        bloodPressureSystolic: { type: "number", description: "Systolic blood pressure in mmHg" },
        bloodPressureDiastolic: { type: "number", description: "Diastolic blood pressure in mmHg" },
        temperature: { type: "number", description: "Body temperature in °C" },
        oxygenSaturation: { type: "number", description: "SpO2 percentage" },
        respiratoryRate: { type: "number", description: "Respiratory rate per minute" },
        timestamp: { type: "string", description: "Time of measurement" },
        notes: { type: "string", description: "Additional clinical notes" },
      },
      required: [
        "patientName",
        "heartRate",
        "bloodPressureSystolic",
        "bloodPressureDiastolic",
        "temperature",
        "oxygenSaturation",
        "respiratoryRate",
      ],
    },
  },

  {
    name: "PrescriptionCard",
    description:
      "Display a prescription with patient name, doctor, date, diagnosis, medications (name, dosage, frequency, duration, instructions), and notes. Use this when the user asks about prescriptions or medications.",
    component: PrescriptionCard,
    propsSchema: {
      type: "object",
      properties: {
        patientName: { type: "string", description: "Patient name" },
        doctorName: { type: "string", description: "Prescribing doctor name" },
        date: { type: "string", description: "Prescription date" },
        diagnosis: { type: "string", description: "Diagnosis for this prescription" },
        medications: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Medication name" },
              dosage: { type: "string", description: "Dosage (e.g. 500mg)" },
              frequency: { type: "string", description: "Frequency (e.g. Twice daily)" },
              duration: { type: "string", description: "Duration (e.g. 7 days)" },
              instructions: { type: "string", description: "Special instructions" },
            },
            required: ["name", "dosage", "frequency", "duration"],
          },
          description: "List of prescribed medications",
        },
        notes: { type: "string", description: "Doctor's additional notes" },
      },
      required: ["patientName", "doctorName", "date", "diagnosis", "medications"],
    },
  },

  {
    name: "AppointmentCard",
    description:
      "Display an appointment card with patient, doctor, department, date, time, type, status, room number, and notes. Use this when the user asks about scheduling, appointments, or consultations.",
    component: AppointmentCard,
    propsSchema: {
      type: "object",
      properties: {
        patientName: { type: "string", description: "Patient name" },
        doctorName: { type: "string", description: "Doctor name" },
        department: { type: "string", description: "Department name" },
        date: { type: "string", description: "Appointment date" },
        time: { type: "string", description: "Appointment time" },
        type: {
          type: "string",
          enum: ["Consultation", "Follow-up", "Surgery", "Lab Test", "Emergency", "Therapy"],
          description: "Type of appointment",
        },
        status: {
          type: "string",
          enum: ["Scheduled", "In Progress", "Completed", "Cancelled", "No Show"],
          description: "Appointment status",
        },
        roomNumber: { type: "string", description: "Room or ward number" },
        notes: { type: "string", description: "Additional notes" },
      },
      required: ["patientName", "doctorName", "department", "date", "time", "type", "status"],
    },
  },

  {
    name: "LabResultCard",
    description:
      "Display lab test results with patient info, test type, priority, status, individual test values with reference ranges and status indicators, and a summary. Use this when the user asks about lab results, blood tests, or diagnostics.",
    component: LabResultCard,
    propsSchema: {
      type: "object",
      properties: {
        patientName: { type: "string", description: "Patient name" },
        testType: { type: "string", description: "Type of lab test (e.g. Complete Blood Count)" },
        date: { type: "string", description: "Test date" },
        doctor: { type: "string", description: "Ordering doctor" },
        priority: {
          type: "string",
          enum: ["Routine", "High", "Critical"],
          description: "Test priority level",
        },
        status: {
          type: "string",
          enum: ["Completed", "Pending", "Processing"],
          description: "Test status",
        },
        results: {
          type: "array",
          items: {
            type: "object",
            properties: {
              testName: { type: "string", description: "Individual test name" },
              value: { type: "string", description: "Test result value" },
              unit: { type: "string", description: "Unit of measurement" },
              referenceRange: { type: "string", description: "Normal reference range" },
              status: {
                type: "string",
                enum: ["Normal", "Abnormal", "Critical"],
                description: "Result status",
              },
            },
            required: ["testName", "value", "unit", "referenceRange", "status"],
          },
          description: "Individual test results",
        },
        resultSummary: { type: "string", description: "Overall result summary" },
      },
      required: ["patientName", "testType", "date", "doctor", "priority", "status", "results"],
    },
  },

  {
    name: "BedAvailability",
    description:
      "Display hospital bed availability with total/occupied/available counts, occupancy rate bar, and ward-by-ward breakdown. Use this when the user asks about bed availability, occupancy, or ward capacity.",
    component: BedAvailability,
    propsSchema: {
      type: "object",
      properties: {
        hospitalName: { type: "string", description: "Hospital name" },
        totalBeds: { type: "number", description: "Total number of beds" },
        occupiedBeds: { type: "number", description: "Number of occupied beds" },
        wards: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string", description: "Ward name" },
              totalBeds: { type: "number", description: "Total beds in ward" },
              occupiedBeds: { type: "number", description: "Occupied beds in ward" },
              department: { type: "string", description: "Department the ward belongs to" },
            },
            required: ["name", "totalBeds", "occupiedBeds", "department"],
          },
          description: "Ward-level bed breakdown",
        },
        lastUpdated: { type: "string", description: "Last update timestamp" },
      },
      required: ["totalBeds", "occupiedBeds", "wards"],
    },
  },
];
