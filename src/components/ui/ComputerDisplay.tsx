import React from "react";
import {
  IconLayoutDashboard,
  IconUsers,
  IconId,
  IconBox,
  IconCalendarEvent,
  IconMicroscope,
  IconAmbulance,
} from "@tabler/icons-react";
import Calendar from "@/components/ui/Calendar";
import { FloatingDock } from "@/components/ui/floating-dock";
import Dashboard from "@/components/ui/crm/Dashboard";
import Records from "@/components/ui/crm/Records";
import Staff from "@/components/ui/crm/Staff";
import Inventory from "@/components/ui/crm/Inventory";
import LabResults from "@/components/ui/crm/LabResults";
import Ambulance from "@/components/ui/crm/Ambulance";

export type GlobeResult = {
  lat?: number;
  lng?: number;
  address?: string;
  routePolyline?: string;
};

export const ComputerDisplay: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  globeResult?: GlobeResult;
  children?: React.ReactNode;
}> = ({ activeTab, setActiveTab }) => {

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
      case "home": // Fallback for initial state if it's "home"
        return <Dashboard />;
      case "records":
        return <Records />;
      case "staff":
        return <Staff />;
      case "inventory":
        return <Inventory />;
      case "calendar":
        return <Calendar />;
      case "lab":
        return <LabResults />;
      case "ambulance":
        return <Ambulance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="flex-1 w-full h-full overflow-hidden relative">
        {renderContent()}
      </div>

      <div className="absolute left-1/2 bottom-6 -translate-x-1/2 z-50">
        <FloatingDock
          items={[
            {
              title: "Dashboard",
              icon: (
                <IconLayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#dashboard",
              key: "dashboard",
            },
            {
              title: "Records",
              icon: (
                <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#records",
              key: "records",
            },
            {
              title: "Staff",
              icon: (
                <IconId className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#staff",
              key: "staff",
            },
            {
              title: "Inventory",
              icon: (
                <IconBox className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#inventory",
              key: "inventory",
            },
            {
              title: "Lab Results",
              icon: (
                <IconMicroscope className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#lab",
              key: "lab",
            },
            {
              title: "Ambulance",
              icon: (
                <IconAmbulance className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#ambulance",
              key: "ambulance",
            },
            {
              title: "Calendar",
              icon: (
                <IconCalendarEvent className="h-full w-full text-neutral-500 dark:text-neutral-300" />
              ),
              href: "#calendar",
              key: "calendar",
            },
          ]}
          desktopClassName=""
          mobileClassName=""
          onSelect={setActiveTab}
        />
      </div>
    </div>
  );
};
