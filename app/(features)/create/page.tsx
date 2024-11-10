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