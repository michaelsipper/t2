// footprint.tsx

'use client';
import React, { useState, ReactNode } from 'react';
import { useAppContext } from "@/components/shared/AppContext";
import { LayoutGrid, MapPin, Calendar, ChevronRight, Share2 } from 'lucide-react';
import type { FeedItem } from "@/lib/types";

interface FootprintBoardProps {
  children: ReactNode;
  title: string;
  count: string;
  isActive: boolean;
  onClick: () => void;
}

const FootprintBoard: React.FC<FootprintBoardProps> = ({ 
  children, 
  title, 
  count, 
  isActive, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`
      relative overflow-hidden rounded-2xl p-6
      transition-all duration-300 ease-out
      ${isActive 
        ? 'bg-gradient-to-br from-indigo-500/10 to-sky-500/10 dark:from-indigo-500/20 dark:to-sky-500/20 ring-1 ring-inset ring-indigo-500/20 dark:ring-sky-500/20' 
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-zinc-50 dark:bg-zinc-900/50'
      }
    `}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className={`text-lg font-medium transition-colors duration-300 
        ${isActive ? 'text-indigo-500 dark:text-sky-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {title}
      </h3>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{count}</span>
    </div>
    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
      {children}
      <ChevronRight className="w-4 h-4 ml-auto" />
    </div>
  </button>
);

interface FootprintCardProps {
  item: FeedItem;
}

const FootprintCard: React.FC<FootprintCardProps> = ({ item }) => (
  <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white">
          {item.event?.title?.[0] || '?'}
        </div>
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-white line-clamp-1">
            {item.event?.title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {item.event?.time}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <MapPin className="w-4 h-4" />
        <span className="line-clamp-1">{item.event?.location}</span>
      </div>
    </div>
    
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-sky-500/20 to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
  </div>
);

interface EmptyStateProps {
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-12 h-12 mb-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
      <LayoutGrid className="w-6 h-6 text-zinc-400" />
    </div>
    <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-[15rem]">
      {message}
    </p>
  </div>
);

type TabType = "been" | "interested" | "wantToGo";

interface BoardData {
  id: TabType;
  title: string;
  count: string;
  icon: React.ReactNode;
  description: string;
}

const Footprint: React.FC = () => {
  const { interestedItems } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>("been");
  
  const boardsData: BoardData[] = [
    {
      id: "been",
      title: "Been There",
      count: "3 places",
      icon: <Calendar className="w-4 h-4" />,
      description: "Places & events you've attended"
    },
    {
      id: "interested",
      title: "Interested In",
      count: `${interestedItems.length} items`,
      icon: <LayoutGrid className="w-4 h-4" />,
      description: "Events you're interested in"
    },
    {
      id: "wantToGo",
      title: "Want to Go",
      count: "5 places",
      icon: <MapPin className="w-4 h-4" />,
      description: "Your bucket list spots"
    }
  ];

  const renderContent = () => {
    if (activeTab === "interested" && interestedItems.length === 0) {
      return (
        <EmptyState message="No interested items yet. Explore the feed to find exciting events!" />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(activeTab === "interested" ? interestedItems : []).map((item) => (
          <FootprintCard key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              My Footprint
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Your personal collection of experiences
            </p>
          </div>
          <button className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
            <Share2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Boards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {boardsData.map((board) => (
            <FootprintBoard
              key={board.id}
              title={board.title}
              count={board.count}
              isActive={activeTab === board.id}
              onClick={() => setActiveTab(board.id)}
            >
              {board.icon}
              <span>{board.description}</span>
            </FootprintBoard>
          ))}
        </div>

        {/* Active Board Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Footprint;