"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { FeedItem, CustomPlaylist } from "@/lib/types";
import { feedItems as initialFeedItems } from "@/lib/mock-data";

interface AppContextType {
  interestedItems: FeedItem[];
  addInterestedItem: (item: FeedItem) => void;
  removeInterestedItem: (itemId: number) => void;
  feedItems: FeedItem[];
  addFeedItem: (item: Omit<FeedItem, 'id'>) => void;
  deleteFeedItem: (itemId: number) => void;
  resetToInitialFeed: () => void;
  customPlaylists: CustomPlaylist[];
  addCustomPlaylist: (playlist: Omit<CustomPlaylist, 'id'>) => void;
  addToPlaylist: (playlistId: number, item: FeedItem) => void;
  removeFromPlaylist: (playlistId: number, itemId: number) => void;
  deletePlaylist: (playlistId: number) => void;
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
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : initialFeedItems;
    }
    return initialFeedItems;
  });

  // Initialize custom playlists
  const [customPlaylists, setCustomPlaylists] = useState<CustomPlaylist[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customPlaylists');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('interestedItems', JSON.stringify(interestedItems));
      localStorage.setItem('feedItems', JSON.stringify(feedItems));
      localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
    }
  }, [interestedItems, feedItems, customPlaylists]);

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
    // Also remove from any playlists
    setCustomPlaylists(prev => 
      prev.map(playlist => ({
        ...playlist,
        items: playlist.items.filter(item => item.id !== itemId)
      }))
    );
  };

  // Playlist functions
  const addCustomPlaylist = (playlist: Omit<CustomPlaylist, 'id'>) => {
    setCustomPlaylists(prev => [...prev, { ...playlist, id: Date.now() }]);
  };

  const addToPlaylist = (playlistId: number, item: FeedItem) => {
    setCustomPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, items: [...playlist.items, item] }
          : playlist
      )
    );
  };

  const removeFromPlaylist = (playlistId: number, itemId: number) => {
    setCustomPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, items: playlist.items.filter(item => item.id !== itemId) }
          : playlist
      )
    );
  };

  const deletePlaylist = (playlistId: number) => {
    setCustomPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
  };

  // Reset should now also clear custom playlists
  const resetToInitialFeed = () => {
    setFeedItems(initialFeedItems);
    setCustomPlaylists([]);
    localStorage.removeItem('feedItems');
    localStorage.removeItem('customPlaylists');
    console.log('Feed and playlists reset to initial data');
  };

  const contextValue = {
    interestedItems,
    addInterestedItem,
    removeInterestedItem,
    feedItems,
    addFeedItem,
    deleteFeedItem,
    resetToInitialFeed,
    customPlaylists,
    addCustomPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    deletePlaylist,
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