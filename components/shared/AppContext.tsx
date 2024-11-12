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
  deleteFeedItem: (itemId: number) => void;
  resetToInitialFeed: () => void;  // New function
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Initialize interested items state with localStorage if available
  const [interestedItems, setInterestedItems] = useState<FeedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('interestedItems');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Initialize feed items state with localStorage or initial mock data
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feedItems');
      // Only use saved items if they exist AND array is not empty
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : initialFeedItems;
    }
    return initialFeedItems;
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('interestedItems', JSON.stringify(interestedItems));
      localStorage.setItem('feedItems', JSON.stringify(feedItems));
    }
  }, [interestedItems, feedItems]);

  const addInterestedItem = (item: FeedItem) => {
    setInterestedItems((prev) => {
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeInterestedItem = (itemId: number) => {
    setInterestedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const addFeedItem = (item: Omit<FeedItem, 'id'>) => {
    const newItem: FeedItem = {
      ...item,
      id: Date.now(),
    };
    console.log('Adding new item:', newItem);
    setFeedItems((prev) => {
      const newItems = [newItem, ...prev];
      console.log('New feed state:', newItems);
      return newItems;
    });
  };

  const deleteFeedItem = (itemId: number) => {
    setFeedItems((prev) => prev.filter(item => item.id !== itemId));
    setInterestedItems((prev) => prev.filter(item => item.id !== itemId));
  };

  // New function to reset feed to initial mock data
  const resetToInitialFeed = () => {
    setFeedItems(initialFeedItems);
    localStorage.removeItem('feedItems'); // Clear localStorage
    console.log('Feed reset to initial data');
  };

  const contextValue = {
    interestedItems,
    addInterestedItem,
    removeInterestedItem,
    feedItems,
    addFeedItem,
    deleteFeedItem,
    resetToInitialFeed,  // Add to context value
  };

  return (
    <AppContext.Provider value={contextValue}>
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