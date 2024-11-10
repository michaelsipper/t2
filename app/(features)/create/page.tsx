// app/(features)/create/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Clock, 
  Calendar, 
  Upload,
  Search,
  ToggleRight
} from 'lucide-react';

export default function CreatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'people' | 'businesses'>('people');
  const [timeFilter, setTimeFilter] = useState<'now' | 'later'>('now');

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search a person, place, etc."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterType('people')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'people'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              People
            </button>
            <button
              onClick={() => setFilterType('businesses')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterType === 'businesses'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Businesses
            </button>
          </div>

          <button
            onClick={() => setTimeFilter(timeFilter === 'now' ? 'later' : 'now')}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <span>{timeFilter === 'now' ? 'Now' : 'Later'}</span>
            <ToggleRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Create Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/create/type1" className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-8 h-8 text-blue-500 mb-4" />
            <h2 className="font-semibold mb-2">Scheduled Plan</h2>
            <p className="text-sm text-gray-600">Create a plan for a specific time and date</p>
          </div>
        </Link>
        
        <Link href="/create/type2" className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Clock className="w-8 h-8 text-green-500 mb-4" />
            <h2 className="font-semibold mb-2">Happening Now</h2>
            <p className="text-sm text-gray-600">Share what you're doing right now</p>
          </div>
        </Link>
        
        <Link href="/create/type3" className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Upload className="w-8 h-8 text-purple-500 mb-4" />
            <h2 className="font-semibold mb-2">From Media</h2>
            <p className="text-sm text-gray-600">Create from an image or URL</p>
          </div>
        </Link>
      </div>

      {/* Feed Area */}
      <div className="mt-8">
        {/* Feed component will go here */}
      </div>
    </div>
  );
}