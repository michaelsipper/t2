"use client";

import { useState, useEffect } from 'react';
import { 
  Camera, Edit2, MapPin, Calendar, 
  CheckCircle2, Shield, Star,
  Settings, Share2, Users,
  Clock, LayoutGrid, Heart
} from 'lucide-react';
import { useAppContext } from "@/components/shared/AppContext";
import { FeedCard } from "@/components/shared/feed-card";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import type { FeedItem } from "@/lib/types";

interface ProfileStats {
  flakeScore: number;
  friendCount: number;
  plansCreated: number;
  plansAttended: number;
}

const FlakeScoreBadge = ({ score }: { score: number }) => {
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50 dark:bg-green-500/10";
    if (score >= 70) return "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10";
    return "text-red-500 bg-red-50 dark:bg-red-500/10";
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`p-4 rounded-2xl ${getBadgeColor(score)}`}>
        <div className="text-2xl font-bold">{score}%</div>
        <div className="text-sm mt-1">Reliability</div>
      </div>
    </div>
  );
};

function Profile() {
  const { feedItems } = useAppContext();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'interested'>('upcoming');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Michael Sipper",
    location: "San Francisco, CA",
    bio: "Always down for spontaneous adventures! 🎮 🏃‍♂️",
    tags: ["Sports", "Gaming", "Hiking", "Movies", "Food"],
    joinDate: "October 2023"
  });

  const [stats, setStats] = useState<ProfileStats>({
    flakeScore: 95,
    friendCount: 342,
    plansCreated: 15,
    plansAttended: 28
  });

  // Filter feed items based on active tab
  const getFilteredItems = (): FeedItem[] => {
    const userPosts = feedItems.filter(item => item.poster.name === profileData.name);
    const now = new Date().getTime();

    switch (activeTab) {
      case 'upcoming':
        return userPosts.filter(item => {
          if (item.type === 'scheduled') {
            const eventTime = new Date(item.event.time || '').getTime();
            return eventTime > now;
          }
          return item.type === 'realtime';
        });
      case 'past':
        return userPosts.filter(item => {
          if (item.type === 'scheduled') {
            const eventTime = new Date(item.event.time || '').getTime();
            return eventTime <= now;
          }
          return false;
        });
      case 'interested':
        return feedItems.filter(item => 
          item.event.participants.some(p => p.name === profileData.name)
        );
      default:
        return [];
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Implement photo upload logic here
      showToast("Profile photo updated!");
    }
  };

  const handleEditSave = () => {
    if (isEditing) {
      // Save profile changes
      showToast("Profile updated successfully!");
    }
    setIsEditing(!isEditing);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`https://tapdin.app/profile/${profileData.name.toLowerCase().replace(' ', '-')}`);
      showToast("Profile link copied to clipboard!");
    } catch (error) {
      showToast("Failed to copy profile link");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Profile Header */}
      <div className="relative h-48 bg-gradient-to-r from-blue-400 to-indigo-500">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-24 relative z-10 pb-20">
        {/* Profile Photo & Basic Info */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {profileData.name[0]}
                </span>
              </div>
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/80 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>
            )}
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-center focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  profileData.name
                )}
              </h1>
              <Shield className="w-5 h-5 text-blue-500" title="Verified Account" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mt-2 text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-center focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span>{profileData.location}</span>
              )}
            </div>

            <div className="mt-2">
              {isEditing ? (
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg p-2 focus:outline-none focus:border-blue-500 text-zinc-600 dark:text-zinc-400"
                  rows={2}
                />
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">{profileData.bio}</p>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 w-full mt-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
            <div className="text-center">
              <FlakeScoreBadge score={stats.flakeScore} />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.friendCount}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Friends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.plansCreated}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.plansAttended}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">Attended</div>
            </div>
          </div>

          {/* Interest Tags */}
          <div className="w-full mt-6">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-600 dark:text-zinc-400"
                >
                  {tag}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => {/* Implement add tag logic */}}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-blue-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  + Add
                </button>
              )}
            </div>
          </div>

          {/* Join Date & Verification */}
          <div className="flex items-center gap-4 mt-6 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {profileData.joinDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Verified User</span>
            </div>
          </div>
        </div>

        {/* Activity Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {[
              { id: 'upcoming', label: 'Upcoming', icon: Clock },
              { id: 'past', label: 'Past', icon: LayoutGrid },
              { id: 'interested', label: 'Interested', icon: Heart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex-1 py-4 text-sm font-medium border-b-2 transition-colors
                  flex items-center justify-center gap-2
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity Content */}
          <div className="mt-6 space-y-6">
            {getFilteredItems().map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                onInterestToggle={() => {}}
                onRepostToggle={() => {}}
                onDelete={() => {}}
                isInterested={false}
                isReposted={false}
              />
            ))}
            {getFilteredItems().length === 0 && (
              <div className="text-center py-12">
                <LayoutGrid className="w-12 h-12 mx-auto text-zinc-400 dark:text-zinc-600 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
                  No activities to show
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Activities will appear here once you create or join plans
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <button
          onClick={handleEditSave}
          className="p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
        >
          {isEditing ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Settings className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          )}
        </button>
        <button
          onClick={handleShare}
          className="p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
        >
          <Share2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    </div>
  );
}

export default Profile;