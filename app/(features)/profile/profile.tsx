// app/(features)/profile/profile.tsx
"use client";

import { useState } from "react";
import { 
  Image as ImageIcon, 
  Edit2, 
  Star, 
  Calendar, 
  Users, 
  Loader2,
  X,
  Plus,
  Camera
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert } from "@/components/ui/alert";
import { useAppContext } from "@/components/shared/AppContext";
import { FeedCard } from "@/components/shared/feed-card";

interface ProfilePhoto {
  id: number;
  url: string;
  order: number;
}

interface ProfileBlurb {
  id: number;
  prompt: string;
  answer: string;
}

export function Profile() {
  const { feedItems } = useAppContext();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [blurbs, setBlurbs] = useState<ProfileBlurb[]>([]);

  // Mocked user data - this would come from your user context/API
  const userData = {
    name: "John Doe",
    age: 25,
    flakeScore: 95,
    plansCreated: 15,
    plansAttended: 12,
    plansFlaked: 1
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      setIsUploading(true);
      const file = e.target.files[0];
      
      // Here you would typically upload to your storage service
      // For now, we'll create a local URL
      const newPhoto: ProfilePhoto = {
        id: Date.now(),
        url: URL.createObjectURL(file),
        order: photos.length
      };
      
      setPhotos(prev => [...prev, newPhoto]);
      showToast("Photo uploaded successfully!");
    } catch (error) {
      showToast("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const activePlans = feedItems.filter(item => 
    item.poster.name === userData.name && 
    (item.type === "scheduled" || item.type === "realtime")
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="relative h-48 bg-gradient-to-r from-indigo-400 to-sky-400">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative w-24 h-24 rounded-full bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-800">
            {photos[0] ? (
              <img
                src={photos[0].url}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                <Camera className="w-8 h-8 text-zinc-400" />
              </div>
            )}
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer">
                <Plus className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isUploading}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-lg mx-auto px-4 mt-16">
        {/* Basic Info */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-semibold text-black dark:text-white">
              {userData.name}
            </h1>
            <span className="text-zinc-600 dark:text-zinc-400">{userData.age}</span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors mx-auto"
          >
            <Edit2 className="w-4 h-4" />
            <span className="text-sm">{isEditing ? "Done" : "Edit Profile"}</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center justify-center gap-2 text-emerald-500 mb-2">
              <Star className="w-5 h-5" />
              <span className="text-lg font-semibold">{userData.flakeScore}</span>
            </div>
            <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
              Flake Score
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center justify-center gap-2 text-blue-500 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-lg font-semibold">{userData.plansCreated}</span>
            </div>
            <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
              Plans Created
            </p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900">
            <div className="flex items-center justify-center gap-2 text-purple-500 mb-2">
              <Users className="w-5 h-5" />
              <span className="text-lg font-semibold">{userData.plansAttended}</span>
            </div>
            <p className="text-xs text-center text-zinc-600 dark:text-zinc-400">
              Plans Attended
            </p>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
            Photos
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-900 overflow-hidden"
              >
                {photos[index] ? (
                  <div className="relative group">
                    <img
                      src={photos[index].url}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {isEditing && (
                      <button
                        onClick={() => {
                          setPhotos(prev => prev.filter((_, i) => i !== index));
                          showToast("Photo removed");
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : isEditing ? (
                  <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
                    <Plus className="w-6 h-6 text-zinc-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                      disabled={isUploading}
                    />
                  </label>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-zinc-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Plans */}
        {activePlans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
              Active Plans
            </h2>
            <div className="space-y-4">
              {activePlans.map((plan) => (
                <FeedCard
                  key={plan.id}
                  item={plan}
                  onInterestToggle={() => {}}
                  onRepostToggle={() => {}}
                  onDelete={() => {}}
                  isInterested={false}
                  isReposted={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Blurbs */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
            About Me
          </h2>
          <div className="space-y-4">
            {blurbs.length === 0 && isEditing ? (
              <button
                onClick={() => {
                  const newBlurb: ProfileBlurb = {
                    id: Date.now(),
                    prompt: "I want to make memories by...",
                    answer: ""
                  };
                  setBlurbs(prev => [...prev, newBlurb]);
                }}
                className="w-full p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Add a blurb
              </button>
            ) : (
              blurbs.map((blurb) => (
                <div
                  key={blurb.id}
                  className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900"
                >
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                    {blurb.prompt}
                  </p>
                  {isEditing ? (
                    <textarea
                      value={blurb.answer}
                      onChange={(e) => {
                        setBlurbs(prev =>
                          prev.map(b =>
                            b.id === blurb.id
                              ? { ...b, answer: e.target.value }
                              : b
                          )
                        );
                      }}
                      className="w-full bg-white dark:bg-zinc-800 rounded-lg p-2 text-black dark:text-white"
                    />
                  ) : (
                    <p className="text-black dark:text-white">{blurb.answer}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}