# 🏥 MediHealthCRM — AI-Powered Healthcare Management System

<div align="center">

**A comprehensive hospital CRM with an integrated AI assistant powered by [Tambo AI](https://tambo.co), delivering intelligent healthcare management through generative UI/UX.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tambo AI](https://img.shields.io/badge/Tambo_AI-Powered-10B981)](https://tambo.co/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 🚀 Problem Statement

Hospital management systems are often fragmented, unintuitive, and lack intelligent assistance. Healthcare professionals juggle between multiple disconnected tools for patient records, lab results, staff scheduling, inventory tracking, and emergency dispatch — wasting critical time that could be spent on patient care. There is no unified platform that brings all these workflows together with real-time AI guidance.

## 💡 Solution

**MediHealthCRM** is a unified healthcare management platform that combines six essential hospital modules with an always-available AI assistant. Powered by Tambo AI's generative UI engine, the assistant doesn't just answer questions — it dynamically renders interactive components, executes tools, and provides context-aware help directly within the CRM workflow.

The AI chat panel lives alongside the CRM interface, enabling staff to:
- **Add data via chat** — e.g., *"Add patient John Doe, age 45, with diabetes"* instantly creates a record visible in the Patient Records page
- Ask natural language questions about patients, inventory, or schedules
- Trigger actions like looking up medical terms, searching images, or managing calendar events
- Receive AI-generated UI components rendered in real-time within the chat

---

## ✨ Key Features

### 🏠 Dashboard — Hospital Overview at a Glance
- **Live Stat Cards**: Total Patients (1,245), Doctors on Duty (48), Bed Occupancy (89%), Average Wait Time (14 min) — each card is clickable for drill-down details
- **Recent Activity Feed**: Real-time feed of hospital events with color-coded alert types (🔴 Critical, 🟢 Success, 🔵 Info)
- **Department Schedule**: Upcoming events across departments with time and location
- **Report Generation**: One-click report generation with animated progress modal showing step-by-step completion
- **Settings Panel**: Configure refresh intervals, toggle notifications, and enable auto-refresh

### 📋 Patient Records — Complete Medical Records Management
- **Searchable Patient Table**: Columns for Patient ID, Name, Age/Sex, Diagnosis, Department, Status, Admission Date, and Actions
- **Advanced Filtering**: Search by name, ID, department, or diagnosis; filter by status (Admitted, Outpatient, Critical, Discharged)
- **Full CRUD Operations**: Add new patients, edit existing records, view detailed patient profiles, and delete with confirmation dialogs
- **Status Badges**: Color-coded status indicators — 🟢 Admitted, 🔵 Outpatient, 🔴 Critical, ⚫ Discharged
- **New Patient Form**: Comprehensive intake form with name, age, gender, status, diagnosis, department, and admission date fields

### 👨‍⚕️ Staff Directory — Healthcare Personnel Management
- **Card Grid Layout**: Staff cards with gradient avatar circles (initials), name, role, and department
- **Direct Contact Links**: One-click email and phone links for each staff member
- **Role-Based Filtering**: Filter by Doctor, Nurse, Admin, Pharmacist, Technician, or Specialist
- **Search Functionality**: Search across name, role, and department fields
- **Staff Management**: Add new staff, edit profiles, view detailed information, and remove personnel
- **Detailed Profile Modal**: Full staff profile with contact information, department, and role details

### 📦 Inventory — Medical Supplies & Equipment Tracking
- **Visual Card Grid**: Each item displays category icon, name, category, quantity, location, and expiry date
- **Smart Status Badges**: Auto-calculated stock status — 🟢 In Stock, 🟡 Low Stock, 🔴 Out of Stock — based on quantity thresholds
- **Category Filtering**: Filter by Medical Device, Pharmaceuticals, Surgical, or General categories
- **Expiry Tracking**: Visual expiry date display for time-sensitive medical supplies
- **Full Inventory Management**: Add, edit, and delete inventory items with real-time status recalculation

### 🧪 Lab Results — Diagnostics & Test Management
- **Priority-Coded Results List**: Each result displays with priority-colored icons and status badges
- **Comprehensive Test Details**: Test type, patient name, result summary, ordering doctor, and date
- **Status Tracking**: Filter by Completed, Processing, or Pending status
- **New Test Orders**: Create test orders with patient info, test type, priority level (Normal, Urgent, Critical), and ordering doctor
- **Detailed Result View**: Expandable modal with full result information and reference ranges
- **Report Download**: One-click download functionality for completed lab reports

### 🚑 Ambulance Dispatch — Emergency Response Management
- **Split-Panel Interface**: Left panel shows ambulance unit cards; right panel displays a GPS tracking map with animated markers
- **Real-Time Unit Status**: Color-coded status indicators — 🔴 En Route/Dispatched, 🟠 On Scene, 🔵 Returning to Base
- **Unit Detail Cards**: Each ambulance shows unit ID, current status, location, ETA, patient condition, and crew members
- **Interactive Map**: Animated ambulance markers plotted at GPS coordinates with pulsing location indicators
- **Dispatch New Unit**: Modal to dispatch ambulances with destination, priority level, and patient condition
- **Unit Details & Navigation**: Click any ambulance for detailed view with navigation option

### 🤖 Tambo AI Chat Assistant — Intelligent CRM Companion
- **Always-On Chat Panel**: 400px-wide AI chat interface docked to the right side of the CRM
- **Generative UI Rendering**: AI dynamically generates and renders interactive UI components within the chat
- **Real-Time Streaming**: Live content streaming as the AI generates responses
- **Shared CRM Data Store**: Chat-driven actions (e.g., adding a patient) instantly update the CRM pages via a centralized React Context
- **Integrated Tools**:
  - 🏥 **Add Patient** — Add new patient records via natural language (e.g., *"Add patient John Doe, age 45, diagnosed with diabetes"*)
  - 🧪 **Add Lab Result** — Create lab test entries with patient info, test type, priority, and results
  - 👨‍⚕️ **Add Staff Member** — Register new healthcare personnel with role, department, and contact details
  - 📦 **Add Inventory Item** — Add medical supplies with category, quantity, location, and expiry tracking
  - 📖 **Dictionary Search** — Look up medical terms and definitions with phonetics and examples
  - 📅 **Calendar Control** — Add events, highlight dates, and manage schedules via natural language
  - 🖼️ **Image Search** — Search and display images from Unsplash directly in chat
- **MCP (Model Context Protocol) Support**: Connect external tool providers to extend AI capabilities
- **Generation Stage Indicators**: Visual feedback showing AI processing stages (Choosing Component → Fetching Context → Hydrating → Streaming → Complete)

---

## 🎯 Impact

- **Unified Workflow**: Eliminates the need to switch between multiple disconnected hospital tools
- **AI-Augmented Decision Making**: Instant access to an intelligent assistant that understands healthcare context
- **Reduced Administrative Burden**: Natural language interactions replace complex form navigation
- **Real-Time Visibility**: Live dashboards, activity feeds, and ambulance tracking keep staff informed
- **Extensible Architecture**: MCP support allows connecting to any external service (EHR systems, lab APIs, pharmacy databases)
- **Developer Template**: Serves as a reference implementation for building AI-powered CRM applications with Tambo AI

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** version 18 or higher
- **npm**, **yarn**, or **pnpm** package manager
- **Tambo AI API Key** — get one at [tambo.co/cli-auth](https://tambo.co/cli-auth)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/MediHealthCRM.git
   cd MediHealthCRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp example.env.local .env.local
   ```

4. **Add your Tambo API key**

   **Option A** — Use the Tambo CLI:
   ```bash
   npm run init
   ```

   **Option B** — Manual setup:
   - Visit [tambo.co/cli-auth](https://tambo.co/cli-auth) to get your API key
   - Add it to `.env.local`:
     ```env
     NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
     ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser** at [http://localhost:3000](http://localhost:3000)

---

## 🎮 Usage

### Navigating the CRM

The interface features a **floating dock** at the bottom of the screen for switching between modules:

| Icon | Module | Description |
|------|--------|-------------|
| 📊 | Dashboard | Hospital overview with stats, activity feed, and reports |
| 📋 | Records | Patient records table with search, filter, and CRUD |
| 👨‍⚕️ | Staff | Staff directory with role-based filtering |
| 📦 | Inventory | Medical supplies tracking with stock status |
| 🧪 | Lab Results | Diagnostics management with test ordering |
| 🚑 | Ambulance | Emergency dispatch with GPS tracking map |
| 📅 | Calendar | AI-controlled event calendar |

### Using the AI Assistant

The AI chat panel is always available on the right side of the screen:

1. **Type a message** in the chat input at the bottom
2. **Add CRM data** — e.g., *"Add patient John Doe, age 45, diagnosed with diabetes in Cardiology"* → Patient appears instantly in the Records page
3. **Add lab results** — e.g., *"Add a blood test for patient Sarah, ordered by Dr. Smith, priority urgent"* → Result appears in Lab Results page
4. **Add staff** — e.g., *"Add Dr. Emily Chen as a Cardiologist in the Cardiology department"* → Staff member appears in Staff Directory
5. **Add inventory** — e.g., *"Add 500 units of Amoxicillin in Pharmacy, expires 2026-12-01"* → Item appears in Inventory page
6. **Ask questions** — e.g., *"What does hypertension mean?"* → AI renders a Dictionary component
7. **Manage calendar** — e.g., *"Add a meeting tomorrow at 3pm"* → AI controls the Calendar
8. **Search for images** — e.g., *"Show me images of hospital equipment"* → AI renders an Image Gallery
9. **Watch generative UI** — The AI dynamically creates appropriate components based on your request

### Tambo AI Integration Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                       MediHealthCRM                          │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              CrmDataProvider (React Context)            │ │
│  │   Shared state: patients, labResults, staff, inventory  │ │
│  ├──────────────────────┬──────────────────────────────────┤ │
│  │   CRM Modules        │   AI Chat Panel                  │ │
│  │                      │                                  │ │
│  │  ┌────────────────┐  │  TamboProvider                   │ │
│  │  │ Dashboard      │  │    ├─ CRM Tools                  │ │
│  │  │ Records ◄──────┼──┼────┤  ├─ addPatient              │ │
│  │  │ Staff   ◄──────┼──┼────┤  ├─ addLabResult            │ │
│  │  │ Inventory◄─────┼──┼────┤  ├─ addStaffMember          │ │
│  │  │ Lab Results◄───┼──┼────┤  └─ addInventoryItem        │ │
│  │  │ Ambulance      │  │    ├─ Utility Tools              │ │
│  │  └────────────────┘  │    │  ├─ Dictionary              │ │
│  │                      │    │  ├─ Calendar                 │ │
│  │  FloatingDock Nav    │    │  └─ ImageSearch              │ │
│  │                      │    ├─ Components                  │ │
│  │                      │    │  ├─ Dictionary               │ │
│  │                      │    │  └─ ImageGallery             │ │
│  │                      │    └─ MCP Servers                 │ │
│  │                      │       └─ External                 │ │
│  └──────────────────────┴──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘

Data Flow: Chat Tool → Window Global → CrmDataProvider → CRM Page (re-render)
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 with React 19 |
| **AI Engine** | Tambo AI (`@tambo-ai/react` + `@tambo-ai/typescript-sdk`) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **UI Primitives** | Radix UI |
| **Icons** | Tabler Icons (`@tabler/icons-react`) |
| **Protocol** | Model Context Protocol (MCP) |

---

## 📁 Project Structure

```
MediHealthCRM/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Main layout: CRM + AI Chat side-by-side
│   │   ├── layout.tsx            # Root layout with metadata
│   │   └── globals.css           # Global styles & Tailwind imports
│   ├── components/
│   │   ├── tambo/                # Tambo AI chat components
│   │   │   ├── message-thread-full.tsx   # Full-screen chat thread
│   │   │   ├── message-input.tsx         # Chat input with suggestions
│   │   │   ├── message.tsx               # Individual message renderer
│   │   │   ├── mcp-config-modal.tsx      # MCP server configuration
│   │   │   └── ...
│   │   └── ui/
│   │       ├── ComputerDisplay.tsx       # Tab router for CRM modules
│   │       ├── floating-dock.tsx         # Bottom navigation dock
│   │       ├── Calendar.tsx              # AI-controlled calendar
│   │       ├── Dictionary.tsx            # Word definition component
│   │       ├── ImageGallery.tsx          # Image search results
│   │       └── crm/                      # Healthcare CRM modules
│   │           ├── Dashboard.tsx         # Hospital overview & stats
│   │           ├── Records.tsx           # Patient records management
│   │           ├── Staff.tsx             # Staff directory
│   │           ├── Inventory.tsx         # Medical inventory tracking
│   │           ├── LabResults.tsx        # Lab results & diagnostics
│   │           └── Ambulance.tsx         # Emergency dispatch & GPS
│   ├── lib/
│   │   ├── tambo.ts              # Tambo config: tools & component registry
│   │   ├── crm-data-store.tsx    # ★ Centralized CRM state (React Context provider)
│   │   ├── thread-hooks.ts       # Custom thread management hooks
│   │   └── utils.ts              # Utility functions
│   └── services/
│       ├── crm-tools.ts          # ★ Tambo tool definitions for CRM CRUD operations
│       ├── calendar-control.ts   # Calendar tool implementation
│       ├── dictionary-search.ts  # Dictionary API service
│       └── image-search.ts       # Unsplash image search service
├── public/                       # Static assets (logos, icons)
├── example.env.local             # Environment variable template
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies & scripts
```

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Auto-fix ESLint errors |
| `npm run init` | Initialize Tambo API key via CLI |

---

## 🔧 Configuration

### Tambo AI Setup (`src/lib/tambo.ts`)

```typescript
// Registered AI Tools
export const tools: TamboTool[] = [
  // CRM Data Tools (chat → CRM page sync)
  addPatientTool,         // Add patient records via chat
  addLabResultTool,       // Add lab test results via chat
  addStaffMemberTool,     // Add staff members via chat
  addInventoryItemTool,   // Add inventory items via chat
  // Utility Tools
  dictionarySearchTool,   // Look up word definitions
  calendarControlTool,    // Manage calendar events
  imageSearch,            // Search Unsplash images
];

// Registered UI Components (rendered by AI in chat)
export const components: TamboComponent[] = [
  { name: "Dictionary", component: Dictionary, ... },
  { name: "ImageGallery", component: ImageGallery, ... },
];
```

### CRM Data Store (`src/lib/crm-data-store.tsx`)

The centralized data store uses React Context to share state between the AI chat and CRM pages:

```typescript
// Wrap your app with CrmDataProvider
<CrmDataProvider>
  <TamboProvider ...>
    <TamboMcpProvider ...>
      {/* CRM pages + Chat panel */}
    </TamboMcpProvider>
  </TamboProvider>
</CrmDataProvider>

// Access shared data in any CRM component
const { patients, labResults, staff, inventory, addPatient, ... } = useCrmData();
```

**How it works:** Tambo AI tools call window global functions (e.g., `window.handleAddPatient`) which are bound to the `CrmDataProvider`'s state setters. This bridges the Tambo tool execution context with React's state management, ensuring data added via chat instantly appears in the corresponding CRM page.

### MCP Server Configuration

Extend the AI's capabilities by connecting external MCP servers:

```typescript
<TamboProvider apiKey={apiKey} components={components} tools={tools}>
  <TamboMcpProvider mcpServers={["https://your-mcp-server.com/sse"]}>
    {children}
  </TamboMcpProvider>
</TamboProvider>
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **API key not working** | Verify `.env.local` contains `NEXT_PUBLIC_TAMBO_API_KEY` and the key is valid |
| **Chat panel not loading** | Check browser console for errors; ensure internet connectivity |
| **Chat data not appearing in CRM pages** | Ensure `CrmDataProvider` wraps both the chat panel and CRM modules in `page.tsx`. Check browser console for window global function errors. |
| **Build failures** | Run `rm -rf .next node_modules && npm install` then `npm run build` |
| **Node version errors** | Ensure Node.js 18+ with `node --version` |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m 'Add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Guidelines
- Use TypeScript with strict typing
- Follow existing code patterns and component structure
- Add Framer Motion animations for new UI elements
- Register new AI-renderable components in `src/lib/tambo.ts`
- For new CRM entities, add types and state to `src/lib/crm-data-store.tsx` and create corresponding Tambo tools in `src/services/crm-tools.ts`

---

## 📚 Learn More

- [Tambo AI Documentation](https://tambo.co/docs) — AI chat integration guides
- [Next.js Documentation](https://nextjs.org/docs) — Framework reference
- [Model Context Protocol](https://modelcontextprotocol.io) — MCP specification
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [Tailwind CSS](https://tailwindcss.com/docs) — Utility-first CSS

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using [Tambo AI](https://tambo.co)**

*Empowering healthcare with intelligent, AI-driven interfaces*

</div>
