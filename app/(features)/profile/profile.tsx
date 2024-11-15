// app/(features)/profile/profile.tsx
"use client";

import { useState } from "react";
import {
  Camera,
  Edit2,
  Plus,
  X,
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Alert } from "@/components/ui/alert";
import { useAppContext } from "@/components/shared/AppContext";
import { FeedCard } from "@/components/shared/feed-card";

// Add these interfaces
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

type PlanTab = "active" | "past" | "interested";

// Rest of your code remains the same...

// We'll create this as a separate component for cleaner organization
function FlakeScoreMeter({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 32; // radius = 32
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        Flake Score
      </span>
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="42"
            cy="42"
            r="32"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <circle
            cx="42"
            cy="42"
            r="32"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
            className="text-indigo-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute">
          <span className="text-2xl font-semibold text-black dark:text-white">
            {score}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Profile() {
  const { feedItems } = useAppContext();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<PlanTab>("active");
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [blurbs, setBlurbs] = useState<ProfileBlurb[]>([]);

  // Mocked user data
  const userData = {
    name: "Michael Sipper",
    age: 22,
    flakeScore: 95,
    friendCount: 342,
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // ... same as before
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 pb-20">
      {/* Modern Header Design */}
      <div className="relative h-64 bg-gradient-to-br from-indigo-400 via-purple-400 to-sky-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950"></div>
      </div>

      {/* Profile Content */}
      <div className="max-w-lg mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 shadow-lg">
              {photos[0] ? (
                <img
                  src={photos[0].url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-zinc-400" />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black transition-colors">
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

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {userData.name}
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                {userData.age}
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-around mb-8 py-6 border-y border-zinc-200 dark:border-zinc-800">
          <FlakeScoreMeter score={userData.flakeScore} />
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-semibold text-black dark:text-white">
              {userData.friendCount}
            </span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Friends
            </span>
          </div>
        </div>

        {/* Plans Tabs */}
        <div className="mb-8">
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6">
            {[
              { id: "active", label: "Active", icon: Clock },
              { id: "past", label: "Past", icon: Calendar },
              { id: "interested", label: "Interested", icon: Plus },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PlanTab)}
                className={`
                  flex-1 py-3 flex items-center justify-center gap-2
                  text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Plans Content */}
          <div className="space-y-4">
            {/* Render different plans based on activeTab */}
          </div>
        </div>

        {/* Photo Grid - Modern Layout */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
            Photos
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className={`
                  aspect-[4/5] rounded-xl overflow-hidden
                  ${index === 0 ? "col-span-2 row-span-2" : ""}
                  bg-gradient-to-br from-zinc-100 to-zinc-200 
                  dark:from-zinc-800 dark:to-zinc-900
                `}
              >
                {/* Photo content same as before but with updated styling */}
              </div>
            ))}
          </div>
        </div>

        {/* Blurbs - Modern Cards */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-black dark:text-white">
            About
          </h2>
          <div className="space-y-4">
            {blurbs.length === 0 && isEditing ? (
              <button
                onClick={() => {
                  const newBlurb = {
                    id: Date.now(),
                    prompt: "I want to make memories by...",
                    answer: "",
                  };
                  setBlurbs((prev) => [...prev, newBlurb]);
                }}
                className="w-full p-6 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700
                          hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all
                          text-zinc-500 dark:text-zinc-400"
              >
                Add your first prompt
              </button>
            ) : (
              blurbs.map((blurb) => (
                <div
                  key={blurb.id}
                  className="p-6 rounded-xl bg-gradient-to-br from-zinc-50 to-white
                            dark:from-zinc-900 dark:to-zinc-950 shadow-sm"
                >
                  {/* Blurb content same as before but with updated styling */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
