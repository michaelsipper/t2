// AppContext.tsx

"use client"; // Add this line

import { createContext, useContext, useState, ReactNode } from "react";
import { FeedItem } from "@/lib/types";

interface AppContextType {
  interestedItems: FeedItem[];
  addInterestedItem: (item: FeedItem) => void;
  removeInterestedItem: (itemId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [interestedItems, setInterestedItems] = useState<FeedItem[]>([]);

  const addInterestedItem = (item: FeedItem) => {
    setInterestedItems((prev) => [...prev, item]);
  };

  const removeInterestedItem = (itemId: number) => {
    setInterestedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <AppContext.Provider value={{ interestedItems, addInterestedItem, removeInterestedItem }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
