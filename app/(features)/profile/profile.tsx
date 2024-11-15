"use client";

import { useState } from "react";
import {
  Camera,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Share2,
  Plus,
  X,
  Check,
  Image,
  Edit3,
  Heart,
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

const FlakeScoreBadge = ({ score }: { score: number }) => {
  const getBadgeColor = (score: number) => {
    if (score >= 90) return "text-green-500 bg-green-50 dark:bg-green-500/10";
    if (score >= 70)
      return "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10";
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

  const handlePhotoUpload = async (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData((prev) => ({
        ...prev,
        photos: prev.photos.map((photo) =>
          photo.id === id
            ? { ...photo, url: URL.createObjectURL(e.target.files![0]) }
            : photo
        ),
      }));
      showToast("Photo updated!");
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

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `https://tapdin.app/profile/${profileData.name
          .toLowerCase()
          .replace(" ", "-")}`
      );
      showToast("Profile link copied!");
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
      <div className="max-w-2xl mx-auto px-4 -mt-24 relative z-10 pb-24">
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
                  onChange={(e) => handlePhotoUpload("profile", e)}
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
              <div className="relative group">
                <Shield
                  className="w-5 h-5 text-blue-500 cursor-help"
                  aria-label="Verified Account"
                />
              </div>
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

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 w-full mt-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl">
            <div className="text-center">
              <FlakeScoreBadge score={stats.flakeScore} />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.friendCount}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Friends
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.plansCreated}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Created
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-zinc-900 dark:text-white">
                {stats.plansAttended}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Attended
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {[
              { id: "spotlight", label: "Snapshot" },
              { id: "interested", label: "Interested" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex-1 py-4 text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-500"
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
                {/* Photos Grid */}
                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-6 aspect-[2/1] relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    {profileData.photos[0]?.url ? (
                      <img
                        src={profileData.photos[0].url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {isEditing ? (
                          <label className="cursor-pointer group">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handlePhotoUpload("0", e)}
                            />
                            <div className="flex flex-col items-center gap-2">
                              <Plus className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                              <span className="text-sm text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                                Add cover photo
                              </span>
                            </div>
                          </label>
                        ) : (
                          <Image className="w-8 h-8 text-zinc-400" />
                        )}
                      </div>
                    )}
                  </div>
                  {profileData.photos.slice(1).map((photo, index) => (
                    <div
                      key={photo.id}
                      className="col-span-3 aspect-square relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800"
                    >
                      {photo.url ? (
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {isEditing ? (
                            <label className="cursor-pointer group">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(photo.id, e)}
                              />
                              <Plus className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                            </label>
                          ) : (
                            <Image className="w-8 h-8 text-zinc-400" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Blurbs */}
                <div className="space-y-4">
                  {profileData.blurbs.map((blurb) => (
                    <div
                      key={blurb.id}
                      className="p-4 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950 rounded-2xl shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-zinc-400">
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
                      className="w-full p-4 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                    >
                      Add a prompt
                    </button>
                  )}
                </div>
              </div>
            ) : (
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

      {/* Action Buttons */}
      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-3 rounded-full bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl transition-all"
        >
          {isEditing ? (
            <Check className="w-5 h-5 text-green-500" />
          ) : (
            <Edit3 className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
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
