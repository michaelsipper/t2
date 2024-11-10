'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { FeedCard } from '@/components/shared/feed-card';
import { feedItems } from '@/lib/mock-data';

type TimeFilter = 'all' | 'now' | 'later';

export function Feed() {
  const [activeTab, setActiveTab] = useState<'friends' | 'mutuals' | 'community'>('friends');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [interestedItems, setInterestedItems] = useState<Set<number>>(new Set());
  const [repostedItems, setRepostedItems] = useState<Set<number>>(new Set());

  const toggleInterest = (itemId: number) => {
    setInterestedItems(prev => {
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
    setRepostedItems(prev => {
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

    // Filter by connection type
    switch (activeTab) {
      case 'friends':
        filtered = filtered.filter(item => item.poster.connection === "1st");
        break;
      case 'mutuals':
        filtered = filtered.filter(item => item.poster.connection === "2nd");
        break;
      case 'community':
        filtered = filtered.filter(item => item.poster.connection === "3rd");
        break;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.event.title.toLowerCase().includes(query) ||
        item.event.description.toLowerCase().includes(query) ||
        item.event.location.toLowerCase().includes(query) ||
        item.poster.name.toLowerCase().includes(query)
      );
    }

    // Filter by time mode
    switch (timeFilter) {
      case 'now':
        filtered = filtered.filter(item => item.type === 'realtime');
        break;
      case 'later':
        filtered = filtered.filter(item => item.type === 'scheduled');
        break;
      // 'all' requires no filtering
    }

    return filtered;
  };

  return (
    <div className="mb-16">
      <header className="sticky top-0 bg-white border-b z-10 px-4 py-3">
        <h1 className="text-2xl font-bold text-blue-500 mb-4">Tap'dIn</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search a person, place, etc."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1 flex-1">
            <button
              className={`px-3 py-2 rounded-lg text-sm flex-1 ${
                activeTab === 'friends'
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm flex-1 ${
                activeTab === 'mutuals'
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300'
              }`}
              onClick={() => setActiveTab('mutuals')}
            >
              Mutuals
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm flex-1 ${
                activeTab === 'community'
                  ? 'bg-blue-500 text-white'
                  : 'border border-gray-300'
              }`}
              onClick={() => setActiveTab('community')}
            >
              Community
            </button>
          </div>

          <div className="ml-3 shrink-0">
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                className={`px-3 py-1 rounded text-sm ${
                  timeFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setTimeFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 rounded text-sm ${
                  timeFilter === 'now'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setTimeFilter('now')}
              >
                Now
              </button>
              <button
                className={`px-3 py-1 rounded text-sm ${
                  timeFilter === 'later'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setTimeFilter('later')}
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4">
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
    </div>
  );
}