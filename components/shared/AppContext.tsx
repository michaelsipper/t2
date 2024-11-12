"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FeedItem } from "@/lib/types";
import { feedItems as initialFeedItems } from "@/lib/mock-data";

// Define the shape of our context
interface AppContextType {
  interestedItems: FeedItem[];
  addInterestedItem: (item: FeedItem) => void;
  removeInterestedItem: (itemId: number) => void;
  feedItems: FeedItem[];
  addFeedItem: (item: Omit<FeedItem, 'id'>) => void;
  deleteFeedItem: (itemId: number) => void;
}

// Create the context
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

  // Initialize feed items state with localStorage if available, otherwise use initial mock data
  const [feedItems, setFeedItems] = useState<FeedItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('feedItems');
      return saved ? JSON.parse(saved) : initialFeedItems;
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

  // Add an item to interested items
  const addInterestedItem = (item: FeedItem) => {
    setInterestedItems((prev) => {
      // Check if item already exists to avoid duplicates
      if (prev.some(existingItem => existingItem.id === item.id)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  // Remove an item from interested items
  const removeInterestedItem = (itemId: number) => {
    setInterestedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Add a new item to the feed
  const addFeedItem = (item: Omit<FeedItem, 'id'>) => {
    const newItem: FeedItem = {
      ...item,
      id: Date.now(), // Generate a unique ID
    };
    console.log('Adding new item:', newItem);
    setFeedItems((prev) => {
      const newItems = [newItem, ...prev]; // Add to beginning of feed
      console.log('New feed state:', newItems);
      return newItems;
    });
  };

  // Delete an item from both feed and interested items
  const deleteFeedItem = (itemId: number) => {
    // Remove from feed items
    setFeedItems((prev) => prev.filter(item => item.id !== itemId));
    
    // Also remove from interested items if it exists there
    setInterestedItems((prev) => prev.filter(item => item.id !== itemId));
  };

  // Create the context value object
  const contextValue = {
    interestedItems,
    addInterestedItem,
    removeInterestedItem,
    feedItems,
    addFeedItem,
    deleteFeedItem,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}