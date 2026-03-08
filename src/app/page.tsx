"use client";

import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import React, { useEffect } from "react";
import { ComputerDisplay } from "@/components/ui/ComputerDisplay";
import { CrmDataProvider } from "@/lib/crm-data-store";
import { NavigationProvider, useNavigation } from "@/lib/navigation-context";
import { ToastProvider, useToast } from "@/lib/toast-context";

// Bridge component that exposes toast to window for Tambo tools
function ToastBridge() {
  const { showToast } = useToast();

  useEffect(() => {
    type ToastWindow = Window & typeof globalThis & {
      handleShowToast?: (message: string, type?: string, action?: string) => void;
    };
    const win = window as ToastWindow;
    win.handleShowToast = (message: string, type?: string, action?: string) => {
      showToast(message, (type as "success" | "error" | "warning" | "info") || "success", action);
    };
    return () => {
      delete win.handleShowToast;
    };
  }, [showToast]);

  return null;
}

function AppContent() {
  const mcpServers = useMcpServers();
  const { activeTab, navigateTo } = useNavigation();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <TamboMcpProvider>
        <CrmDataProvider>
          <ToastBridge />
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
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              AI Assistant Active
            </div>
          </div>

          <div className="flex-1 w-full flex overflow-hidden">
            <div className="flex-1 min-w-[380px] h-full flex flex-col transition-all duration-300 ease-in-out">
              <ComputerDisplay
                activeTab={activeTab}
                setActiveTab={navigateTo}
              />
            </div>

            <div className="w-[420px] border-l border-gray-200 dark:border-gray-800 h-full bg-white dark:bg-gray-900 shadow-xl z-10 hidden lg:flex flex-col">
              {/* Chat header */}
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">MediHealth Assistant</p>
                  <p className="text-blue-200 text-[11px]">Ask me anything about the CRM</p>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <MessageThreadFull className="w-full h-full" />
              </div>
            </div>
          </div>
        </CrmDataProvider>
      </TamboMcpProvider>
    </TamboProvider>
  );
}

export default function Page() {
  return (
    <NavigationProvider>
      <ToastProvider>
        <div className="h-screen flex flex-col overflow-hidden relative bg-gray-50 dark:bg-gray-900">
          <AppContent />
        </div>
      </ToastProvider>
    </NavigationProvider>
  );
}
