//profile.tsx

"use client";

import { useState } from 'react';
import { 
  Camera, MapPin, Shield, Share2, Plus, X, Check, 
  Image, Edit3, Heart, Calendar, UserPlus, Activity,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppContext } from '@/components/shared/AppContext';
import { FeedCard } from '@/components/shared/feed-card';
import type { FeedItem } from '@/lib/types';

function Profile() {
  const { showToast } = useToast();
  const { feedItems } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('photos');
  const [profileData, setProfileData] = useState({
    name: "Michael Sipper",
    location: "San Francisco, CA",
    photos: [
      { id: "1", url: null, order: 1 },
      { id: "2", url: null, order: 2 },
      { id: "3", url: null, order: 3 },
    ],
    blurbs: [
      {
        id: "1",
        prompt: "A perfect night looks like...",
        response: "Impromptu rooftop gatherings, vinyl records, and conversations that last until sunrise",
      },
      {
        id: "2",
        prompt: "Best spontaneous decision...",
        response: "Booking a one-way flight to Tokyo, ended up staying for a month",
      },
    ],
    joinDate: "October 2023",
  });

  const [stats, setStats] = useState({
    flakeScore: 95,
    friendCount: 342,
    status: "Down to hangout",
  });

  const activePlans = feedItems.filter(item => 
    item.poster.name === profileData.name && 
    (item.type === 'scheduled' || item.type === 'realtime')
  );

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isEditing ? (
                <Check className="w-5 h-5 text-blue-500" />
              ) : (
                <Edit3 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-r from-indigo-400 to-sky-400">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        {isEditing && (
          <button className="absolute bottom-2 right-2 p-2 rounded-full bg-black/50 text-white">
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Profile Info */}
        <div className="relative -mt-12 mb-6">
          <div className="flex items-end gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white dark:ring-zinc-950 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{profileData.name[0]}</span>
              </div>
              {isEditing && (
                <button className="absolute bottom-1 right-1 p-1.5 rounded-full bg-black/50 text-white">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex-1 flex justify-end gap-4 mb-2">
              <div className="text-center">
                <div className="text-lg font-semibold">{stats.friendCount}</div>
                <div className="text-xs text-zinc-500">Friends</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-500">{stats.flakeScore}%</div>
                <div className="text-xs text-zinc-500">Reliable</div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{profileData.name}</h2>
              <Shield className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-1 text-zinc-500 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-sm">{profileData.location}</span>
            </div>
            <div className="mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">{stats.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2 border-b border-zinc-200 dark:border-zinc-800">
          {['photos', 'plans'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab 
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }
              `}
            >
              {tab === 'photos' ? 'Photos & Prompts' : 'Active Plans'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="py-4">
          {activeTab === 'photos' ? (
            <div className="space-y-6">
              {profileData.photos.map((photo, index) => (
                <div key={photo.id} className="space-y-4">
                  <div className={`relative rounded-2xl overflow-hidden ${
                    index === 0 ? 'aspect-[2/1]' : 'aspect-square'
                  } bg-zinc-100 dark:bg-zinc-900`}>
                    {photo.url ? (
                      <img
                        src={photo.url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Plus className="w-8 h-8 text-zinc-400" />
                      </div>
                    )}
                  </div>
                  {index < profileData.blurbs.length && (
                    <div className="px-1">
                      <h3 className="text-lg font-medium mb-2">
                        {profileData.blurbs[index].prompt}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        {profileData.blurbs[index].response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {activePlans.length > 0 ? (
                activePlans.map(item => (
                  <FeedCard
                    key={item.id}
                    item={item}
                    onInterestToggle={() => {}}
                    onRepostToggle={() => {}}
                    onDelete={() => {}}
                    isInterested={false}
                    isReposted={false}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-zinc-500 dark:text-zinc-400">No active plans</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Button */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(`https://tapdin.app/profile/${profileData.name.toLowerCase().replace(" ", "-")}`);
          showToast("Profile link copied!");
        }}
        className="fixed bottom-20 right-4 p-3 rounded-full bg-black dark:bg-white text-white dark:text-black shadow-lg"
      >
        <Share2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default Profile;