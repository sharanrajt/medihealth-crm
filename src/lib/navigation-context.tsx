"use client";
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface NavigationContextType {
  activeTab: string;
  navigateTo: (tab: string) => void;
  highlightedItemId: string | null;
  setHighlightedItemId: (id: string | null) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  activeTab: "dashboard",
  navigateTo: () => { },
  highlightedItemId: null,
  setHighlightedItemId: () => { },
});

export const NavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);

  const navigateTo = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  // Auto-clear highlight after 5 seconds
  useEffect(() => {
    if (highlightedItemId) {
      const timer = setTimeout(() => {
        setHighlightedItemId(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedItemId]);

  // Expose navigateTo and highlight on window for Tambo tools
  useEffect(() => {
    type NavWindow = Window & typeof globalThis & {
      handleNavigateTo?: (tab: string) => void;
      handleHighlightItem?: (id: string) => void;
    };
    const win = window as NavWindow;
    win.handleNavigateTo = navigateTo;
    win.handleHighlightItem = setHighlightedItemId;

    return () => {
      delete win.handleNavigateTo;
      delete win.handleHighlightItem;
    };
  }, [navigateTo]);

  return (
    <NavigationContext.Provider value={{ activeTab, navigateTo, highlightedItemId, setHighlightedItemId }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
