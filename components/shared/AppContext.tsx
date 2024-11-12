"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
  // Load interestedItems from localStorage if it exists, or start with an empty array
  const [interestedItems, setInterestedItems] = useState<FeedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('interestedItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Load feedItems from localStorage if it exists, or default to initialFeedItems
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feedItems');
      return saved ? JSON.parse(saved) : initialFeedItems;
    }
    return initialFeedItems;
  });

  // Save interestedItems and feedItems to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('interestedItems', JSON.stringify(interestedItems));
      localStorage.setItem('feedItems', JSON.stringify(feedItems));
    }
  }, [interestedItems, feedItems]);

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
    console.log('Adding new item:', newItem);
    setFeedItems((prev) => {
      const newItems = [newItem, ...prev];
      console.log('New feed state:', newItems);
      return newItems;
    });
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
