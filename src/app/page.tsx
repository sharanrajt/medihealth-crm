"use client";

import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import React, { useState } from "react";
import { ComputerDisplay } from "@/components/ui/ComputerDisplay";

export default function Page() {
  const mcpServers = useMcpServers();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messageThreadKey, setMessageThreadKey] = useState(0);

  React.useEffect(() => {
    setMessageThreadKey((prev) => prev + 1);
  }, [activeTab]);

  return (
    <div className="h-screen flex flex-col overflow-hidden relative bg-gray-50 dark:bg-gray-900">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        components={components}
        tools={tools}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
        mcpServers={mcpServers}
      >
        <TamboMcpProvider>
          {/* Header bar */}
          <div className="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 bg-white dark:bg-gray-800 shadow-sm z-20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                H
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight">
                MediHealth CRM
              </h3>
            </div>

          </div>

          <div className="flex-1 w-full flex overflow-hidden">
            <div className="flex-1 min-w-[380px] h-full flex flex-col transition-all duration-300 ease-in-out">
              <ComputerDisplay
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              >
              </ComputerDisplay>
            </div>

            <div className="w-[400px] border-l border-gray-200 dark:border-gray-800 h-full bg-white dark:bg-gray-900 shadow-xl z-10 hidden lg:block">
              <div className="h-full flex flex-col">
                <MessageThreadFull
                  key={messageThreadKey}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </TamboMcpProvider>
      </TamboProvider>
    </div>
  );
}
