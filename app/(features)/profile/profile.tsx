//profile.tsx

"use client";

import { useState } from 'react';
import { 
  Camera, MapPin, Shield, Plus, X, Check, 
  Image, Edit3, Heart, Calendar, UserPlus, Activity
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
    bio: "Exploring SF's hidden gems and building community through spontaneous adventures 🌉",
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
        <div className="relative -mt-12">
          <div className="flex gap-4">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl ring-4 ring-white dark:ring-zinc-950 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{profileData.name[0]}</span>
              </div>
              {isEditing ? (
                <button className="absolute bottom-1 right-1 p-1.5 rounded-full bg-black/50 text-white">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-white dark:bg-zinc-900 shadow-lg"
                >
                  <Edit3 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                </button>
              )}
            </div>

            {/* Name, Location, Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="text-xl font-bold bg-transparent dark:text-white focus:outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-bold dark:text-white">{profileData.name}</h2>
                )}
                <Shield className="w-4 h-4 text-blue-500" />
              </div>

              <div className="flex items-center gap-1 text-zinc-400 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    className="text-sm bg-transparent focus:outline-none"
                  />
                ) : (
                  <span className="text-sm">{profileData.location}</span>
                )}
              </div>

              <div className="flex gap-4 mt-2">
                <div>
                  <div className="text-sm font-semibold dark:text-zinc-100">{stats.friendCount}</div>
                  <div className="text-xs text-zinc-400">Friends</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-400">{stats.flakeScore}%</div>
                  <div className="text-xs text-zinc-400">Reliable</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Add a bio..."
                className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 rounded-xl focus:outline-none resize-none"
                rows={2}
              />
            ) : (
              <p className="text-sm dark:text-zinc-100">{profileData.bio}</p>
            )}
          </div>

          {/* Status */}
          <div className="mt-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900">
              <Activity className="w-4 h-4 text-green-400" />
              {isEditing ? (
                <select
                  value={stats.status}
                  onChange={(e) => setStats(prev => ({ ...prev, status: e.target.value }))}
                  className="text-sm font-medium bg-transparent dark:text-zinc-100 focus:outline-none"
                >
                  <option>Down to hangout</option>
                  <option>Busy week</option>
                  <option>Out of town</option>
                  <option>Looking to explore</option>
                </select>
              ) : (
                <span className="text-sm font-medium dark:text-zinc-100">{stats.status}</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-2 border-b border-zinc-200 dark:border-zinc-800 mt-6">
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
                      <h3 className="text-lg font-medium dark:text-zinc-100 mb-2">
                        {profileData.blurbs[index].prompt}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-300">
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
                  <p className="text-zinc-400">No active plans</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;