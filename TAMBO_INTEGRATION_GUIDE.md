# Tambo AI Integration Guide

This document explains how Tambo AI is integrated into the MediHealthCRM project to create an intelligent healthcare management system.

## 🤖 What is Tambo AI?

Tambo AI is a platform that enables developers to build AI-powered applications with generative UI/UX capabilities. It allows AI models to dynamically render interactive components, execute tools, and provide context-aware assistance within web applications.

## 🏥 How Tambo is Used in MediHealthCRM

### 1. **AI Chat Assistant Integration**

The application features a **dual-panel interface**:
- **Left Panel**: Main CRM interface with healthcare modules
- **Right Panel**: Always-available Tambo AI chat assistant (400px wide)

The AI assistant is powered by Tambo's `@tambo-ai/react` library and provides intelligent healthcare management capabilities.

### 2. **Core Architecture**

```typescript
// Main layout structure (src/app/page.tsx)
<TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}>
  <TamboMcpProvider>
    <CrmDataProvider>
      {/* CRM Modules + AI Chat Side-by-Side */}
    </CrmDataProvider>
  </TamboMcpProvider>
</TamboProvider>
```

**Key Components:**
- **TamboProvider**: Core AI integration with API key and tool/component registration
- **TamboMcpProvider**: Model Context Protocol support for external tool providers
- **CrmDataProvider**: Centralized state management for CRM data

### 3. **AI Tools for Healthcare Management**

#### **CRM Data Management Tools**

The AI assistant can perform real-time CRM operations through natural language:

```typescript
// src/services/crm-tools.ts
export const tools: TamboTool[] = [
  {
    name: "addPatient",
    description: "Add a new patient record to the CRM",
    tool: addPatientTool,
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Patient full name" },
        age: { type: "number", description: "Patient age in years" },
        gender: { type: "string", enum: ["Male", "Female", "Other"] },
        diagnosis: { type: "string", description: "Primary diagnosis" },
        department: { type: "string", description: "Hospital department" },
        status: { type: "string", enum: ["Admitted", "Outpatient", "Discharged", "Critical"] },
        admissionDate: { type: "string", description: "Admission date in YYYY-MM-DD format" },
      },
      required: ["name", "age", "gender", "diagnosis", "department", "status", "admissionDate"],
    },
  },
  // Similar tools for: addLabResult, addStaffMember, addInventoryItem
];
```

**Example Usage:**
- User: *"Add patient John Doe, age 45, diagnosed with diabetes in Cardiology department"*
- AI: Executes `addPatient` tool → Patient appears instantly in Records page
- User: *"Add a blood test for patient Sarah, ordered by Dr. Smith, priority urgent"*
- AI: Executes `addLabResult` tool → Result appears in Lab Results page

#### **Utility Tools**

```typescript
// Calendar Control
{
  name: "calendarControl",
  description: "Control the calendar UI - navigate, highlight dates, add/remove events",
  tool: calendarControlTool,
}

// Dictionary Search
{
  name: "dictionarySearch",
  description: "Look up medical terms and definitions",
  tool: dictionarySearchTool,
}

// Image Search
{
  name: "imageSearch",
  description: "Search and display images from Unsplash",
  tool: imageSearch,
}
```

### 4. **Generative UI Components**

The AI can dynamically render interactive healthcare components:

```typescript
// src/lib/tambo.ts
export const components: TamboComponent[] = [
  {
    name: "PatientSummaryCard",
    description: "Display patient summary with vitals, diagnosis, and status",
    component: PatientSummaryCard,
    propsSchema: {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        vitals: { /* heart rate, BP, temp, etc. */ },
        diagnosis: { type: "string" },
        // ... more properties
      },
    },
  },
  {
    name: "VitalsDisplay",
    description: "Display patient vital signs with color-coded status indicators",
    component: VitalsDisplay,
  },
  {
    name: "PrescriptionCard",
    description: "Display prescription details with medications and instructions",
    component: PrescriptionCard,
  },
  {
    name: "LabResultCard",
    description: "Display lab test results with reference ranges and status",
    component: LabResultCard,
  },
  {
    name: "BedAvailability",
    description: "Display hospital bed availability and occupancy rates",
    component: BedAvailability,
  },
];
```

**How it works:**
1. User asks: *"Show me John Doe's latest lab results"*
2. AI calls `getLabResults` tool to fetch data
3. AI renders `LabResultCard` component with the data
4. Component appears in the chat interface with interactive elements

### 5. **Real-Time Data Synchronization**

#### **Window Global Bridge Pattern**

The AI tools communicate with React state using a window global bridge:

```typescript
// src/lib/crm-data-store.tsx
useEffect(() => {
  type CrmWindow = Window & typeof globalThis & {
    handleAddPatient?: (patient: Omit<PatientRecord, "id">) => PatientRecord;
    handleAddLabResult?: (result: Omit<LabResult, "id">) => LabResult;
    // ... other handlers
  };
  
  const win = window as CrmWindow;
  win.handleAddPatient = addPatient;
  win.handleAddLabResult = addLabResult;
  // ... bind other functions
  
  return () => {
    delete win.handleAddPatient;
    delete win.handleAddLabResult;
    // ... cleanup
  };
}, [addPatient, addLabResult, /* other functions */]);
```

#### **Tambo Tool Implementation**

```typescript
// src/services/crm-tools.ts
export async function addPatientTool({
  name, age, gender, diagnosis, department, status, admissionDate,
}) {
  const win = window as CrmWindow;
  if (typeof win.handleAddPatient === "function") {
    const newPatient = win.handleAddPatient({ 
      name, age, gender, diagnosis, department, status, admissionDate 
    });
    return { success: true, patient: newPatient };
  }
  return { success: false, error: "CRM data store not mounted." };
}
```

**Data Flow:**
```
User Input → Tambo AI → Tool Execution → Window Global → React State → UI Update
```

### 6. **Model Context Protocol (MCP) Support**

The application supports external tool providers through MCP:

```typescript
<TamboProvider apiKey={apiKey} components={components} tools={tools}>
  <TamboMcpProvider mcpServers={["https://your-mcp-server.com/sse"]}>
    {children}
  </TamboMcpProvider>
</TamboProvider>
```

**Benefits:**
- Connect to external EHR systems
- Integrate with lab APIs
- Access pharmacy databases
- Extend AI capabilities with specialized healthcare tools

### 7. **AI Generation Stages**

The AI provides visual feedback during processing:

```typescript
// Generation stages shown to users:
- IDLE: No active generation
- CHOOSING_COMPONENT: Selecting response component
- FETCHING_CONTEXT: Gathering context via tools
- HYDRATING_COMPONENT: Generating component props
- STREAMING_RESPONSE: Actively streaming content
- COMPLETE: Generation finished
- ERROR: Error occurred
```

### 8. **Real-World Healthcare Scenarios**

#### **Scenario 1: Patient Admission**
```
User: "Add patient John Smith, 55, male, admitted with chest pain to Cardiology"
AI: 
1. Executes addPatient tool
2. Creates patient record
3. Patient appears in Records page
4. AI can immediately show patient summary card
```

#### **Scenario 2: Lab Test Management**
```
User: "Add a Complete Blood Count test for patient Sarah Johnson, ordered by Dr. Wilson, priority high"
AI:
1. Executes addLabResult tool
2. Creates lab test record
3. Test appears in Lab Results page
4. AI can display test details and reference ranges
```

#### **Scenario 3: Medical Information**
```
User: "What does hypertension mean?"
AI:
1. Executes dictionarySearch tool
2. Fetches medical definition
3. Renders Dictionary component with definition, symptoms, treatment
4. Provides interactive medical information
```

#### **Scenario 4: Visual References**
```
User: "Show me images of hospital equipment"
AI:
1. Executes imageSearch tool
2. Fetches relevant images from Unsplash
3. Renders ImageGallery component
4. Displays visual references for staff training or patient education
```

### 9. **Benefits of Tambo Integration**

#### **For Healthcare Staff:**
- **Natural Language Interface**: No need to learn complex form navigation
- **Real-Time Data Sync**: Changes made via chat appear instantly in CRM
- **Contextual Assistance**: AI understands healthcare workflows and terminology
- **Reduced Administrative Burden**: Voice/text commands replace manual data entry

#### **For Patient Care:**
- **Faster Data Entry**: Quick patient registration and updates
- **Better Documentation**: AI ensures complete and accurate records
- **Immediate Access**: Instant access to patient information and medical references
- **Improved Communication**: Clear explanations of medical terms and procedures

#### **For System Administrators:**
- **Extensible Architecture**: Easy to add new tools and components
- **MCP Integration**: Connect to existing healthcare systems
- **Real-Time Monitoring**: Track AI usage and system performance
- **Secure Implementation**: Proper environment variable management and API key security

### 10. **Technical Implementation Details**

#### **Component Registration**
```typescript
// All components must be registered in src/lib/tambo.ts
export const components: TamboComponent[] = [
  { name: "PatientSummaryCard", component: PatientSummaryCard, propsSchema: {...} },
  { name: "VitalsDisplay", component: VitalsDisplay, propsSchema: {...} },
  // ... more components
];
```

#### **Tool Schema Definition**
```typescript
// Tools must have proper input/output schemas
{
  name: "addPatient",
  description: "Add a new patient record",
  tool: addPatientTool,
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      age: { type: "number" },
      // ... required properties
    },
    required: ["name", "age", "gender", "diagnosis", "department", "status", "admissionDate"],
  },
  outputSchema: {
    type: "object",
    properties: {
      success: { type: "boolean" },
      patient: { type: "object" },
      error: { type: "string" },
    },
    required: ["success"],
  },
}
```

#### **State Management Integration**
```typescript
// CRM data store provides centralized state
export function useCrmData() {
  const context = useContext(CrmDataContext);
  if (!context) throw new Error("useCrmData must be used within a CrmDataProvider");
  return context;
}
```

### 11. **Future Extensions**

The Tambo integration provides a foundation for advanced healthcare AI features:

- **Voice Recognition**: Integrate with speech-to-text for hands-free operation
- **Predictive Analytics**: AI suggestions for patient care based on historical data
- **Automated Reporting**: Generate medical reports and summaries
- **Integration with Medical Devices**: Real-time data from IoT medical devices
- **Multilingual Support**: AI-powered translation for diverse patient populations
- **Compliance Monitoring**: Automated HIPAA compliance checks and audit trails

## 🎯 Summary

Tambo AI transforms MediHealthCRM from a static healthcare management system into an intelligent, conversational platform. The integration enables:

1. **Natural Language Data Entry**: Staff can add patients, lab results, and inventory via chat
2. **Dynamic UI Generation**: AI renders appropriate components based on user requests
3. **Real-Time Synchronization**: Chat-driven changes appear instantly in the CRM interface
4. **Extensible Architecture**: Easy to add new tools and integrate with external healthcare systems
5. **Contextual Intelligence**: AI understands healthcare workflows and provides relevant assistance

This creates a more efficient, user-friendly healthcare management experience that reduces administrative burden and improves patient care.