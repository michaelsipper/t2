'use client';
import { useState } from "react";
import { Search } from "lucide-react";
import { FeedCard } from "@/components/shared/feed-card";
import { feedItems } from "@/lib/mock-data";

type TimeFilter = "all" | "now" | "later";
type ConnectionType = "friends" | "mutuals" | "community";

export function Feed() {
  const [activeTab, setActiveTab] = useState<ConnectionType>("friends");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [interestedItems, setInterestedItems] = useState<Set<number>>(new Set());
  const [repostedItems, setRepostedItems] = useState<Set<number>>(new Set());

  const tabs: ConnectionType[] = ["friends", "mutuals", "community"];

  const toggleInterest = (itemId: number) => {
    setInterestedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleRepost = (itemId: number) => {
    setRepostedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getFilteredItems = () => {
    let filtered = feedItems;

    switch (activeTab) {
      case "friends":
        filtered = filtered.filter((item) => item.poster.connection === "1st");
        break;
      case "mutuals":
        filtered = filtered.filter((item) => item.poster.connection === "2nd");
        break;
      case "community":
        filtered = filtered.filter((item) => item.poster.connection === "3rd");
        break;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.event.title.toLowerCase().includes(query) ||
          item.event.description.toLowerCase().includes(query) ||
          item.event.location.toLowerCase().includes(query) ||
          item.poster.name.toLowerCase().includes(query)
      );
    }

    switch (timeFilter) {
      case "now":
        filtered = filtered.filter((item) => item.type === "realtime");
        break;
      case "later":
        filtered = filtered.filter((item) => item.type === "scheduled");
        break;
    }

    return filtered;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Logo */}
          <h1 className="text-xl font-bold mb-4">
            Tap'd<span className="text-blue-500">In</span>
          </h1>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search plans, people, places..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-full text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3">
            {/* Connection Tabs */}
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium flex-1
                    transition-colors duration-200
                    ${
                      activeTab === tab
                        ? "bg-black text-white"
                        : "bg-transparent text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Time Filter */}
            <div className="flex justify-end">
              <div className="inline-flex rounded-full bg-gray-100 p-1">
                {["all", "now", "later"].map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeFilter(time as TimeFilter)}
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium 
                      transition-colors duration-200
                      ${
                        timeFilter === time
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }
                    `}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {getFilteredItems().map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onInterestToggle={toggleInterest}
              onRepostToggle={toggleRepost}
              isInterested={interestedItems.has(item.id)}
              isReposted={repostedItems.has(item.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}