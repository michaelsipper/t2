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
    age: 22,
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

  const handlePhotoUpload = async (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setProfileData((prev) => ({
      ...prev,
      photos: prev.photos.map((photo) =>
        photo.id === id ? { ...photo, url } : photo
      ),
    }));
    showToast("Photo updated successfully!");
  };

  const handleAddBlurb = () => {
    const prompts = [
      "My go-to adventure is...",
      "You'll find me...",
      "Best local spot...",
      "Next on my list...",
      "My signature move...",
    ];

    const unusedPrompts = prompts.filter(
      (prompt) => !profileData.blurbs.some((blurb) => blurb.prompt === prompt)
    );

    if (unusedPrompts.length === 0) {
      showToast("Maximum blurbs reached!");
      return;
    }

    const newBlurb = {
      id: Date.now().toString(),
      prompt: unusedPrompts[0],
      response: "",
    };

    setProfileData((prev) => ({
      ...prev,
      blurbs: [...prev.blurbs, newBlurb],
    }));
  };

  const handleUpdateBlurb = (id: string, response: string) => {
    setProfileData((prev) => ({
      ...prev,
      blurbs: prev.blurbs.map((blurb) =>
        blurb.id === id ? { ...blurb, response } : blurb
      ),
    }));
  };

  const handleRemoveBlurb = (id: string) => {
    setProfileData((prev) => ({
      ...prev,
      blurbs: prev.blurbs.filter((blurb) => blurb.id !== id),
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-16">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-r from-indigo-400 to-sky-400">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
      </div>

      <div className="max-w-lg mx-auto px-4">
        {/* Profile Info */}
        <div className="relative -mt-12 flex gap-4">
          {/* Left Column - Photo */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl ring-4 ring-white dark:ring-zinc-950 bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{profileData.name[0]}</span>
            </div>
            
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="absolute -top-1 -right-1 p-1.5 rounded-full bg-white dark:bg-zinc-900 shadow-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              {isEditing ? (
                <Check className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Edit3 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              )}
            </button>

            {isEditing && (
              <button className="absolute bottom-1 right-1 p-1.5 rounded-full bg-black/50 text-white">
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="flex-1 pt-2">
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
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => setProfileData(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  className="w-12 text-sm bg-transparent dark:text-zinc-300 focus:outline-none"
                  placeholder="Age"
                />
              ) : (
                <span className="text-sm dark:text-zinc-300">{profileData.age}</span>
              )}
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

            {/* Bio */}
            <div className="mt-2">
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Add a bio..."
                  className="w-full text-sm bg-transparent dark:text-zinc-100 focus:outline-none resize-none"
                  rows={2}
                />
              ) : (
                <p className="text-sm dark:text-zinc-100">{profileData.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats and Status */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-4">
            <div>
              <div className="text-sm font-semibold dark:text-zinc-100">{stats.friendCount}</div>
              <div className="text-xs text-zinc-400">Friends</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-green-400">{stats.flakeScore}%</div>
              <div className="text-xs text-zinc-400">Reliable</div>
            </div>
          </div>

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
                    {isEditing && (
                      <label className="absolute inset-0 cursor-pointer hover:bg-black/20 transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handlePhotoUpload(photo.id, e.target.files[0])}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                      </label>
                    )}
                  </div>
                  {index < profileData.blurbs.length && (
                    <div className="px-1">
                      <h3 className="text-lg font-medium dark:text-zinc-100 mb-2">
                        {profileData.blurbs[index].prompt}
                      </h3>
                      {isEditing ? (
                        <div className="relative">
                          <textarea
                            value={profileData.blurbs[index].response}
                            onChange={(e) => handleUpdateBlurb(profileData.blurbs[index].id, e.target.value)}
                            className="w-full text-zinc-600 dark:text-zinc-300 bg-transparent resize-none focus:outline-none"
                            rows={2}
                          />
                          <button
                            onClick={() => handleRemoveBlurb(profileData.blurbs[index].id)}
                            className="absolute -right-2 top-0 p-1 text-zinc-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-zinc-600 dark:text-zinc-300">
                          {profileData.blurbs[index].response}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && profileData.blurbs.length < profileData.photos.length && (
                <button
                  onClick={handleAddBlurb}
                  className="w-full p-4 text-sm font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  + Add another prompt
                </button>
              )}
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