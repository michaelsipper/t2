// footprint.tsx

'use client';
import { useState } from "react";
import { useAppContext } from "@/components/shared/AppContext";


type TabType = "been" | "interested" | "wantToGo";

export function Footprint() {
  const { interestedItems } = useAppContext(); // Access interestedItems from context
  const [activeTab, setActiveTab] = useState<TabType>("been");

  const renderContent = () => {
    switch (activeTab) {
      case "been":
        return (
          <div className="space-y-4">
            {/* Placeholder content for the "Been" tab */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white">
              <h3 className="font-medium text-lg">Placeholder - Attended Event</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Example past activity</p>
            </div>
          </div>
        );
      case "interested":
        return (
          <div className="space-y-4">
            {interestedItems.length > 0 ? (
              interestedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white"
                >
                  <h3 className="font-medium text-lg">{item.event.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.event.time} - {item.event.location}</p>
                </div>
              ))
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400">No interested items yet.</p>
            )}
          </div>
        );
      case "wantToGo":
        return (
          <div className="space-y-4">
            {/* Placeholder content for the "Want to Go" tab */}
            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white">
              <h3 className="font-medium text-lg">Placeholder - Wishlist Item</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Example future activity</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            My Footprint
          </h1>
          <button className="text-sm font-medium text-indigo-500 dark:text-sky-400 hover:underline">
            Share
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("been")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1
              ${activeTab === "been" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Been
          </button>
          <button
            onClick={() => setActiveTab("interested")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1
              ${activeTab === "interested" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Interested
          </button>
          <button
            onClick={() => setActiveTab("wantToGo")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1
              ${activeTab === "wantToGo" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Want to Go
          </button>
        </div>

        {/* Tab Content */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}
