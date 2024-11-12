// components/shared/AppContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FeedItem } from "@/lib/types";
import { feedItems as initialFeedItems } from "@/lib/mock-data";

interface AppContextType {
  interestedItems: FeedItem[];
  addInterestedItem: (item: FeedItem) => void;
  removeInterestedItem: (itemId: number) => void;
  feedItems: FeedItem[];
  addFeedItem: (item: Omit<FeedItem, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [interestedItems, setInterestedItems] = useState<FeedItem[]>([]);
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);

  const addInterestedItem = (item: FeedItem) => {
    setInterestedItems((prev) => [...prev, item]);
  };

  const removeInterestedItem = (itemId: number) => {
    setInterestedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const addFeedItem = (item: Omit<FeedItem, 'id'>) => {
    const newItem: FeedItem = {
      ...item,
      id: Date.now(), // Generate a unique ID
    };
    setFeedItems((prev) => [newItem, ...prev]); // Add to the beginning of the feed
  };

  return (
    <AppContext.Provider 
      value={{ 
        interestedItems, 
        addInterestedItem, 
        removeInterestedItem,
        feedItems,
        addFeedItem
      }}
    >
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