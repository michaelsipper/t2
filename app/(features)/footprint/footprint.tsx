// footprint.tsx
'use client';
import React, { useState } from 'react';
import { useAppContext } from "@/components/shared/AppContext";
import { MapPin, Calendar, Sparkles, Share, ArrowRight } from 'lucide-react';
import type { FeedItem } from "@/lib/types";

interface CollectionCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  description: string;
  isActive: boolean;
  onClick: () => void;
  gradient: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  count,
  icon,
  description,
  isActive,
  onClick,
  gradient,
}) => (
  <button
    onClick={onClick}
    className={`
      w-full p-4 rounded-xl text-left
      transition-all duration-300 ease-out
      relative overflow-hidden group
      hover:scale-[1.02] active:scale-[0.98]
      ${isActive 
        ? 'bg-gradient-to-br ' + gradient + ' ring-1 ring-white/20'
        : 'hover:bg-zinc-100 dark:hover:bg-zinc-900 bg-zinc-50 dark:bg-zinc-900/50'
      }
    `}
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={isActive ? 'text-white' : 'text-zinc-900 dark:text-white'}>
            {icon}
          </div>
          <h3 className={`font-medium ${isActive ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
            {title}
          </h3>
        </div>
        <span className={`text-sm ${isActive ? 'text-white/70' : 'text-zinc-500 dark:text-zinc-400'}`}>
          {count}
        </span>
      </div>
      <p className={`text-sm ${isActive ? 'text-white/70' : 'text-zinc-500 dark:text-zinc-400'}`}>
        {description}
      </p>
    </div>
    <ArrowRight className={`
      absolute right-4 bottom-4 w-5 h-5
      transition-all duration-300
      ${isActive 
        ? 'opacity-100 translate-x-0 text-white/70' 
        : 'opacity-0 -translate-x-2 text-zinc-400'
      }
      group-hover:opacity-100 group-hover:translate-x-0
    `} />
  </button>
);

const FeedItemCard: React.FC<{ item: FeedItem }> = ({ item }) => (
  <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
    <div className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white">
          {item.poster.name[0]}
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
    
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-sky-400/0 via-sky-400/50 to-sky-400/0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
  </div>
);

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
    <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-indigo-400/10 to-sky-400/10 flex items-center justify-center">
      <Sparkles className="w-8 h-8 text-sky-400" />
    </div>
    <p className="text-zinc-600 dark:text-zinc-400 max-w-[15rem]">
      {message}
    </p>
  </div>
);

type TabType = "been" | "interested" | "bucketList";

const Footprint: React.FC = () => {
  const { interestedItems } = useAppContext();
  const [activeTab, setActiveTab] = useState<TabType>("interested");
  
  const collections = [
    {
      id: "interested" as TabType,
      title: "Interested In",
      count: interestedItems.length,
      icon: <Calendar className="w-5 h-5" />,
      description: "Plans you've clicked join on",
      gradient: "from-indigo-500/20 to-sky-500/20"
    },
    {
      id: "been" as TabType,
      title: "Past Adventures",
      count: 3,
      icon: <Sparkles className="w-5 h-5" />,
      description: "Plans you've previously participated in",
      gradient: "from-pink-500/20 to-rose-500/20"
    },
    {
      id: "bucketList" as TabType,
      title: "Bucket List",
      count: 5,
      icon: <MapPin className="w-5 h-5" />,
      description: "Things you want to do",
      gradient: "from-amber-500/20 to-orange-500/20"
    }
  ];

  const renderContent = () => {
    if (activeTab === "interested" && interestedItems.length === 0) {
      return (
        <EmptyState message="No plans saved yet! Explore the feed to find exciting plans to join ✨" />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {(activeTab === "interested" ? interestedItems : []).map((item) => (
          <FeedItemCard key={item.id} item={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Your Collection
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              
            </p>
          </div>
          <button 
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors hover:scale-105 active:scale-95"
          >
            <Share className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              title={collection.title}
              count={collection.count}
              icon={collection.icon}
              description={collection.description}
              isActive={activeTab === collection.id}
              onClick={() => setActiveTab(collection.id)}
              gradient={collection.gradient}
            />
          ))}
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Footprint;