'use client';

import { useState } from "react";
import { Calendar, MapPin, Clock, Upload, Link, Loader2, X, Eye, Users, Timer } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import type { FeedItem, EventLocation } from "@/lib/types";
import { useAppContext } from "@/components/shared/AppContext";
import { FeedCard } from "@/components/shared/feed-card";

type PlanType = "scheduled" | "live" | "upload";

interface FormData {
  title: string;
  description: string;
  location: EventLocation;
  datetime?: string;
  attendeeCount?: number;
  duration?: number;
}

interface UploadData {
  media?: File;
  eventURL?: string;
  processedData?: {
    title: string;
    description: string;
    location: EventLocation;
    datetime?: string;
  };
}

interface FormErrors {
  [key: string]: string;
}

export function Create() {
  const { addInterestedItem } = useAppContext();
  const { showToast } = useToast();

  // Form States
  const [planType, setPlanType] = useState<PlanType>("scheduled");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: { name: "" },
  });
  const [uploadData, setUploadData] = useState<UploadData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploadProcessed, setIsUploadProcessed] = useState(false);

  // Generate preview data for FeedCard
  const generatePreviewData = (): FeedItem => ({
    id: Date.now(),
    type: planType === "live" ? "realtime" : "scheduled",
    poster: {
      name: "You",
      connection: "1st",
    },
    event: {
      title: formData.title,
      description: formData.description,
      location: formData.location.name,
      time: formData.datetime,
      startTime: planType === "live" ? Date.now() : undefined,
      duration: planType === "live" ? Number(formData.duration) : undefined,
      currentInterested: 0,
      openInvite: false,
      totalSpots: formData.attendeeCount || 0,
      participants: [],
    },
  });

  // Handle plan type change
  const handlePlanTypeChange = (type: PlanType) => {
    setPlanType(type);
    setFormData({
      title: "",
      description: "",
      location: { name: "" },
    });
    setUploadData({});
    setIsUploadProcessed(false);
    setPreview(null);
    setErrors({});
  };

  // Handle URL or image upload processing
  const handleUploadProcess = async (type: 'url' | 'image', value: string | File) => {
    try {
      setIsProcessing(true);
      setErrors({});

      const formData = new FormData();
      if (type === 'url') {
        formData.append('url', value as string);
      } else {
        formData.append('image', value as File);
        // Show image preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(value as File);
      }

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process upload");

      const processedData = await response.json();
      
      setUploadData(prev => ({
        ...prev,
        processedData,
        [type === 'url' ? 'eventURL' : 'media']: value,
      }));

      // Populate form with processed data
      setFormData({
        title: processedData.title || "",
        description: processedData.description || "",
        location: processedData.location || { name: "" },
        datetime: processedData.datetime,
      });

      setIsUploadProcessed(true);
      showToast("Upload processed successfully!");
    } catch (error) {
      showToast("Failed to process upload");
      setErrors({ upload: "Failed to process upload. Please try again." });
    } finally {
      setIsProcessing(false);
    }
  };

  // Render form based on plan type and state
  const renderForm = () => {
    if (planType === "upload" && !isUploadProcessed) {
      return (
        <div className="space-y-6">
          {/* Upload Event Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <input
                type="url"
                placeholder="Event URL"
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-black dark:text-white"
                value={uploadData.eventURL || ""}
                onChange={(e) => setUploadData(prev => ({ ...prev, eventURL: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => uploadData.eventURL && handleUploadProcess('url', uploadData.eventURL)}
                className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-800 dark:text-zinc-200"
              >
                Process URL
              </button>
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="file"
                  accept="image/*"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-600 dark:text-zinc-400"
                  onChange={(e) => e.target.files?.[0] && handleUploadProcess('image', e.target.files[0])}
                />
              </div>

              {preview && (
                <div className="mt-4 relative">
                  <img src={preview} alt="Preview" className="w-full rounded-lg" />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setUploadData(prev => ({ ...prev, media: undefined }));
                    }}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {isProcessing && (
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      );
    }

    return (
      <form className="space-y-6">
        <div className="space-y-4">
          {/* Common Fields */}
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-black dark:text-white"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
          
          <textarea
            placeholder="Description (optional)"
            className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg min-h-[100px] text-black dark:text-white"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />

          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-black dark:text-white"
              value={formData.location.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                location: { ...prev.location, name: e.target.value }
              }))}
            />
          </div>

          {/* Type-specific Fields */}
          {planType === "scheduled" && (
            <>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="datetime-local"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-black dark:text-white"
                  value={formData.datetime || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, datetime: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="number"
                  placeholder="Number of attendees needed"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-black dark:text-white"
                  value={formData.attendeeCount || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendeeCount: parseInt(e.target.value) }))}
                />
              </div>
            </>
          )}

          {planType === "live" && (
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <input
                type="number"
                placeholder="Duration (in hours)"
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-black dark:text-white"
                value={formData.duration || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-indigo-400 to-sky-400 text-white rounded-lg font-medium"
        >
          Post Plan
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
            Create a Plan
          </h1>
          {(planType !== "upload" || isUploadProcessed) && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm">Preview</span>
            </button>
          )}
        </div>

        {/* Plan Type Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => handlePlanTypeChange("scheduled")}
            className={`p-3 rounded-xl border ${
              planType === "scheduled" 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <Calendar className={`w-6 h-6 mx-auto ${
              planType === "scheduled" ? "text-blue-500" : "text-zinc-400"
            }`} />
            <span className="text-xs mt-1 block text-center">Scheduled</span>
          </button>
          <button
            onClick={() => handlePlanTypeChange("live")}
            className={`p-3 rounded-xl border ${
              planType === "live" 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <Clock className={`w-6 h-6 mx-auto ${
              planType === "live" ? "text-blue-500" : "text-zinc-400"
            }`} />
            <span className="text-xs mt-1 block text-center">Live</span>
          </button>
          <button
            onClick={() => handlePlanTypeChange("upload")}
            className={`p-3 rounded-xl border ${
              planType === "upload" 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-zinc-200 dark:border-zinc-800"
            }`}
          >
            <Upload className={`w-6 h-6 mx-auto ${
              planType === "upload" ? "text-blue-500" : "text-zinc-400"
            }`} />
            <span className="text-xs mt-1 block text-center">Upload</span>
          </button>
        </div>

        {/* Preview Card */}
        {showPreview && (
          <div className="mb-6">
            <FeedCard
              item={generatePreviewData()}
              onInterestToggle={() => {}}
              onRepostToggle={() => {}}
              isInterested={false}
              isReposted={false}
            />
          </div>
        )}

        {/* Form */}
        {renderForm()}
      </div>
    </div>
  );
}