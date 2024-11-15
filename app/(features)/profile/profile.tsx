"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import {
  Camera,
  MapPin,
  Shield,
  Share2,
  Plus,
  X,
  Check,
  Image,
  Edit3,
  Heart,
  Calendar,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { FeedItem } from "@/lib/types";

interface ProfileStats {
  flakeScore: number;
  friendCount: number;
  status: string;
}

interface ProfileBlurb {
  id: string;
  prompt: string;
  response: string;
}

interface ProfilePhoto {
  id: string;
  url: string | null;
  order: number;
}

interface PhotoUploadProps {
  onUpload: (file: File) => void;
  children: React.ReactNode;
}

type StatValue = string | number;

const PhotoUploadButton = ({ onUpload, children }: PhotoUploadProps) => (
  <label className="cursor-pointer group">
    <input
      type="file"
      className="hidden"
      accept="image/*"
      onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
    />
    {children}
  </label>
);

const StatsCard = ({
  stats,
  isEditing,
  onUpdate,
}: {
  stats: ProfileStats;
  isEditing: boolean;
  onUpdate?: (key: keyof ProfileStats, value: StatValue) => void;
}) => {
  const statuses = [
    "Looking to explore",
    "Down to hangout",
    "Plans tonight",
    "Busy week",
    "Out of town",
    "Open to anything",
    "Seeking adventure",
    "Local guide available",
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-white dark:bg-zinc-900 rounded-xl">
      <div className="flex flex-col items-center">
        <div className="p-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10">
          {isEditing ? (
            <input
              type="number"
              value={stats.flakeScore}
              min="0"
              max="100"
              onChange={(e) => onUpdate?.("flakeScore", parseInt(e.target.value) || 0)}
              className="w-12 text-lg font-bold text-center bg-transparent border-b border-green-300 focus:outline-none focus:border-green-500 text-green-500"
            />
          ) : (
            <div className="text-lg font-bold text-green-500">{stats.flakeScore}%</div>
          )}
          <div className="text-xs text-green-600 dark:text-green-400">Reliable</div>
        </div>
      </div>

      <div className="text-center">
        {isEditing ? (
          <input
            type="number"
            value={stats.friendCount}
            onChange={(e) => onUpdate?.("friendCount", parseInt(e.target.value) || 0)}
            className="w-16 text-lg font-bold text-center bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
          />
        ) : (
          <div className="text-lg font-bold text-zinc-900 dark:text-white">
            {stats.friendCount}
          </div>
        )}
        <div className="text-xs text-zinc-600 dark:text-zinc-400">Friends</div>
      </div>

      <div className="text-center">
        {isEditing ? (
          <select
            value={stats.status}
            onChange={(e) => onUpdate?.("status", e.target.value)}
            className="text-sm bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 w-full"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        ) : (
          <>
            <div className="text-lg font-bold text-zinc-900 dark:text-white">
              {stats.status}
            </div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">Status</div>
          </>
        )}
      </div>
    </div>
  );
};

const VerificationInfo = ({ joinDate }: { joinDate: string | ReactNode }) => (
  <div className="mt-3 mb-6 flex items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
    <div className="flex items-center gap-1">
      <Calendar className="w-4 h-4" />
      <span>Joined {joinDate}</span>
    </div>
    <div className="flex items-center gap-1">
      <Shield className="w-4 h-4" />
      <span>Identity Verified</span>
    </div>
  </div>
);

function Profile() {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Michael Sipper",
    location: "San Francisco, CA",
    photos: [
      { id: "1", url: null, order: 1 },
      { id: "2", url: null, order: 2 },
      { id: "3", url: null, order: 3 },
    ] as ProfilePhoto[],
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
    ] as ProfileBlurb[],
    joinDate: "October 2023",
  });

  const [stats, setStats] = useState<ProfileStats>({
    flakeScore: 95,
    friendCount: 342,
    status: "Down to hangout",
  });

  const handleStatsUpdate = (key: keyof ProfileStats, value: StatValue) => {
    setStats(prev => ({
      ...prev,
      [key]: value
    }));
  };

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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://tapdin.app/profile/${profileData.name.toLowerCase().replace(" ", "-")}`
      );
      showToast("Profile link copied to clipboard!");
    } catch (_err: unknown) {
      showToast("Failed to copy profile link");
    }
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

    const newBlurb: ProfileBlurb = {
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
<div className="bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="relative -mt-24 z-10">
          {/* Profile Header - Horizontal Layout */}
          <div className="flex gap-6 items-start bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-lg">
            {/* Left Column - Profile Photo */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-zinc-800 overflow-hidden ring-4 ring-white dark:ring-zinc-900">
                <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {profileData.name[0]}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="absolute -top-2 -right-2 p-2 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
              >
                {isEditing ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Edit3 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                )}
              </button>

              {isEditing && (
                <PhotoUploadButton onUpload={(file) => handlePhotoUpload("profile", file)}>
                  <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/80 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
                    <Camera className="w-3 h-3 text-white" />
                  </div>
                </PhotoUploadButton>
              )}
            </div>

            {/* Right Column - Name, Location */}
            <div className="flex-1">
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
                    />
                  ) : profileData.name}
                  <Shield className="w-5 h-5 text-blue-500" aria-label="Verified Account" />
                </h1>

                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                      className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500"
                    />
                  ) : <span>{profileData.location}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="mt-4">
            <StatsCard
              stats={stats}
              isEditing={isEditing}
              onUpdate={handleStatsUpdate}
            />
            <VerificationInfo
              joinDate={
                isEditing ? (
                  <input
                    type="text"
                    value={profileData.joinDate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, joinDate: e.target.value }))}
                    className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-center focus:outline-none focus:border-blue-500 w-32"
                  />
                ) : (
                  profileData.joinDate
                )
              }
            />
          </div>

          {/* Photos and Blurbs */}
          <div className="mt-4 space-y-6 pb-24">
            {profileData.photos.map((photo, index) => (
              <div key={photo.id} className="space-y-4">
                <div className={`relative rounded-2xl overflow-hidden ${index === 0 ? 'aspect-[2/1]' : 'aspect-square'}`}>
                  {photo.url ? (
                    <>
                      <img
                        src={photo.url}
                        alt={`Profile photo ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PhotoUploadButton onUpload={(file) => handlePhotoUpload(photo.id, file)}>
                            <Camera className="w-6 h-6 text-white" />
                          </PhotoUploadButton>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center">
                      {isEditing ? (
                        <PhotoUploadButton onUpload={(file) => handlePhotoUpload(photo.id, file)}>
                          <Plus className="w-8 h-8 text-zinc-400" />
                        </PhotoUploadButton>
                      ) : (
                        <Image className="w-8 h-8 text-zinc-400" />
                      )}
                    </div>
                  )}
                </div>

                {index < profileData.blurbs.length && (
                  <div className="px-2">
                    <h3 className="text-2xl font-medium text-zinc-900 dark:text-white mb-2">
                      {profileData.blurbs[index].prompt}
                    </h3>
                    {isEditing ? (
                      <div className="relative">
                        <textarea
                          value={profileData.blurbs[index].response}
                          onChange={(e) => handleUpdateBlurb(profileData.blurbs[index].id, e.target.value)}
                          className="w-full bg-transparent text-lg focus:outline-none text-zinc-700 dark:text-zinc-300 resize-none min-h-[60px]"
                          placeholder="Your response..."
                        />
                        <button
                          onClick={() => handleRemoveBlurb(profileData.blurbs[index].id)}
                          className="absolute -right-2 top-0 p-1 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-lg text-zinc-700 dark:text-zinc-300">
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
                className="w-full p-4 text-lg font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                + Add another prompt
              </button>
            )}

            <button
              onClick={handleShare}
              className="mt-8 flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;