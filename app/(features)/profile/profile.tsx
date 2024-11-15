"use client";

import { useState, useRef, useEffect } from "react";
// ... rest of the code
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
  Eye,
  EyeOff,
  Users,
  Calendar as CalendarIcon,
  MapPin as LocationIcon,
} from "lucide-react";
import { useAppContext } from "@/components/shared/AppContext";
import { FeedCard } from "@/components/shared/feed-card";
import { useToast } from "@/components/ui/use-toast";
import type { FeedItem } from "@/lib/types";

interface ProfileStats {
  flakeScore: number;
  friendCount: number;
  plansCreated: number;
  plansAttended: number;
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

// Reusable components
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
  onUpdate?: (key: keyof ProfileStats, value: number) => void;
}) => {
  const StatItem = ({
    value,
    label,
    statKey,
  }: {
    value: number;
    label: string;
    statKey: keyof ProfileStats;
  }) => (
    <div className="text-center">
      {isEditing ? (
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onUpdate?.(statKey, parseInt(e.target.value) || 0)}
            className="w-20 text-2xl font-bold text-center bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
          />
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {label}
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold text-zinc-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {label}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-4 gap-4 p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-zinc-900/50 transform hover:scale-[1.02] transition-all duration-300">
      <div className="relative">
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10">
            {isEditing ? (
              <div className="flex flex-col items-center gap-1">
                <input
                  type="number"
                  value={stats.flakeScore}
                  min="0"
                  max="100"
                  onChange={(e) =>
                    onUpdate?.("flakeScore", parseInt(e.target.value) || 0)
                  }
                  className="w-16 text-2xl font-bold text-center bg-transparent border-b border-green-300 focus:outline-none focus:border-green-500 text-green-500"
                />
                <div className="text-sm text-green-600 dark:text-green-400">
                  Reliability
                </div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold text-green-500">
                  {stats.flakeScore}%
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Reliability
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <StatItem
        value={stats.friendCount}
        label="Friends"
        statKey="friendCount"
      />
      <StatItem
        value={stats.plansCreated}
        label="Created"
        statKey="plansCreated"
      />
      <StatItem
        value={stats.plansAttended}
        label="Attended"
        statKey="plansAttended"
      />
    </div>
  );
};

const VerificationInfo = ({ joinDate }: { joinDate: string }) => (
  <div className="mt-3 flex items-center justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
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

const ProfileActions = ({
  isEditing,
  onEditToggle,
  onShare,
}: {
  isEditing: boolean;
  onEditToggle: () => void;
  onShare: () => void;
}) => (
  <div className="fixed bottom-20 right-4 flex flex-col gap-2">
    <button
      onClick={onEditToggle}
      className="p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
    >
      {isEditing ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <Edit3 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
      )}
    </button>
    <button
      onClick={onShare}
      className="p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
    >
      <Share2 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
    </button>
  </div>
);

function Profile() {
  const { feedItems } = useAppContext();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"spotlight" | "interested">(
    "spotlight"
  );
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
        response:
          "Impromptu rooftop gatherings, vinyl records, and conversations that last until sunrise",
      },
      {
        id: "2",
        prompt: "Best spontaneous decision...",
        response:
          "Booking a one-way flight to Tokyo, ended up staying for a month",
      },
    ] as ProfileBlurb[],
    joinDate: "October 2023",
  });

  const [stats, setStats] = useState<ProfileStats>({
    flakeScore: 95,
    friendCount: 342,
    plansCreated: 15,
    plansAttended: 28,
  });

  const handleStatsUpdate = (key: keyof ProfileStats, value: number) => {
    setStats((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handlers
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
        `https://tapdin.app/profile/${profileData.name
          .toLowerCase()
          .replace(" ", "-")}`
      );
      showToast("Profile link copied to clipboard!");
    } catch (error) {
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-24 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-2xl bg-white dark:bg-zinc-800 shadow-lg overflow-hidden ring-4 ring-white dark:ring-zinc-900">
              <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {profileData.name[0]}
                </span>
              </div>
            </div>
            {isEditing && (
              <PhotoUploadButton
                onUpload={(file) => handlePhotoUpload("profile", file)}
              >
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/80 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </PhotoUploadButton>
            )}
          </div>

          {/* Profile Info */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-center focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  profileData.name
                )}
              </h1>
              <Shield
                className="w-5 h-5 text-blue-500"
                aria-label="Verified Account"
              />
            </div>

            <div className="flex items-center justify-center gap-2 mt-2 text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4" />
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-center focus:outline-none focus:border-blue-500"
                />
              ) : (
                <span>{profileData.location}</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="w-full mt-8">
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
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        joinDate: e.target.value,
                      }))
                    }
                    className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-center focus:outline-none focus:border-blue-500 w-32"
                  />
                ) : (
                  profileData.joinDate
                )
              }
            />
          </div>

          {/* Tabs Navigation */}
          <div className="mt-12 w-full">
            <div className="flex border-b border-zinc-200 dark:border-zinc-800">
              {[
                { id: "spotlight" as const, label: "Snapshot" },
                { id: "interested" as const, label: "Interested" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 py-4 text-sm font-medium border-b-2 transition-all duration-300
                    ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-500 dark:text-blue-400"
                        : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "spotlight" ? (
                <div className="space-y-8">
                  {/* Photos Grid with Modern Layout */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        Photos
                      </h2>
                      {isEditing && (
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                          Tap to edit
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                      {/* Main Photo */}
                      <div className="col-span-6 aspect-[2/1] relative rounded-2xl overflow-hidden group">
                        {profileData.photos[0]?.url ? (
                          <>
                            <img
                              src={profileData.photos[0].url}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            {isEditing && (
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PhotoUploadButton
                                  onUpload={(file) =>
                                    handlePhotoUpload("1", file)
                                  }
                                >
                                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                                    <Camera className="w-4 h-4 text-white" />
                                    <span className="text-sm text-white">
                                      Change Cover
                                    </span>
                                  </div>
                                </PhotoUploadButton>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                            {isEditing ? (
                              <PhotoUploadButton
                                onUpload={(file) =>
                                  handlePhotoUpload("1", file)
                                }
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <Plus className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                                  <span className="text-sm text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                                    Add cover photo
                                  </span>
                                </div>
                              </PhotoUploadButton>
                            ) : (
                              <Image className="w-8 h-8 text-zinc-400" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Secondary Photos */}
                      {profileData.photos.slice(1).map((photo, index) => (
                        <div
                          key={photo.id}
                          className="col-span-3 aspect-square relative rounded-2xl overflow-hidden group"
                        >
                          {photo.url ? (
                            <>
                              <img
                                src={photo.url}
                                alt=""
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              {isEditing && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <PhotoUploadButton
                                    onUpload={(file) =>
                                      handlePhotoUpload(photo.id, file)
                                    }
                                  >
                                    <Camera className="w-6 h-6 text-white" />
                                  </PhotoUploadButton>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                              {isEditing ? (
                                <PhotoUploadButton
                                  onUpload={(file) =>
                                    handlePhotoUpload(photo.id, file)
                                  }
                                >
                                  <Plus className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                                </PhotoUploadButton>
                              ) : (
                                <Image className="w-8 h-8 text-zinc-400" />
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blurbs Section with Modern Design */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                      About
                    </h2>
                    <div className="space-y-4">
                      {profileData.blurbs.map((blurb) => (
                        <div
                          key={blurb.id}
                          className="p-4 bg-gradient-to-br from-zinc-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-900 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-sm font-medium text-zinc-400 dark:text-zinc-500">
                              {blurb.prompt}
                            </h3>
                            {isEditing && (
                              <button
                                onClick={() => handleRemoveBlurb(blurb.id)}
                                className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          {isEditing ? (
                            <textarea
                              value={blurb.response}
                              onChange={(e) =>
                                handleUpdateBlurb(blurb.id, e.target.value)
                              }
                              className="w-full bg-transparent focus:outline-none text-zinc-900 dark:text-white resize-none"
                              placeholder="Your response..."
                              rows={2}
                            />
                          ) : (
                            <p className="text-zinc-900 dark:text-white leading-relaxed">
                              {blurb.response}
                            </p>
                          )}
                        </div>
                      ))}
                      {isEditing && profileData.blurbs.length < 5 && (
                        <button
                          onClick={handleAddBlurb}
                          className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                        >
                          Add a prompt
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Interested Tab Content
                <div className="space-y-6">
                  {feedItems
                    .filter((item) =>
                      item.event.participants.some(
                        (p) => p.name === profileData.name
                      )
                    )
                    .map((item) => (
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
                  {feedItems.filter((item) =>
                    item.event.participants.some(
                      (p) => p.name === profileData.name
                    )
                  ).length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-zinc-400" />
                      </div>
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-1">
                        No interested plans yet
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        When you express interest in plans, they'll appear here
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <ProfileActions
        isEditing={isEditing}
        onEditToggle={() => setIsEditing(!isEditing)}
        onShare={handleShare}
      />
    </div>
  );
}

export default Profile;
