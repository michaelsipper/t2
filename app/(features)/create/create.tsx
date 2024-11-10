'use client';
import { useState } from "react";
import { Calendar, MapPin, Clock, Upload, Link, Loader2, X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

type PlanType = "scheduled" | "live" | "upload";

export function Create() {
  const { showToast } = useToast(); // Update to use showToast
  const [planType, setPlanType] = useState<PlanType>("scheduled");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState<number | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [eventURL, setEventURL] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlanTypeChange = (type: PlanType) => {
    setPlanType(type);
    if (type !== "scheduled") setTime("");
    if (type !== "live") setDuration("");
    if (type !== "upload") {
      setMedia(null);
      setEventURL("");
      setPreview(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ planType, title, description, location, time, duration, attendees, media, eventURL });
  };

  // Handler for image uploads
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process image");

      showToast("Image processed successfully!"); // Updated toast usage
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image");
      showToast("Failed to process image"); // Updated toast usage
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for URL submissions
  const handleUrlSubmit = async () => {
    if (!eventURL) {
      setError("Please enter a URL");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");

      const formData = new FormData();
      formData.append("url", eventURL);

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to process URL");

      showToast("URL processed successfully!"); // Updated toast usage
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process URL");
      showToast("Failed to process URL"); // Updated toast usage
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent mb-6">
          Create a Plan
        </h1>

        {/* Plan Type Selector */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handlePlanTypeChange("scheduled")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1 flex items-center gap-2 justify-center
              ${planType === "scheduled" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            <Calendar className="w-5 h-5" />
            Scheduled Plan
          </button>
          <button
            onClick={() => handlePlanTypeChange("live")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1 flex items-center gap-2 justify-center
              ${planType === "live" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            <Clock className="w-5 h-5" />
            Live Happening
          </button>
          <button
            onClick={() => handlePlanTypeChange("upload")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1 flex items-center gap-2 justify-center
              ${planType === "upload" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            <Upload className="w-5 h-5" />
            Upload Event
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {(planType === "scheduled" || planType === "live") && (
            <>
              <input
                type="text"
                placeholder="Title"
                className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Description (optional)"
                className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="text"
                  placeholder="Location"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              {planType === "scheduled" && (
                <>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                    <input
                      type="datetime-local"
                      className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                  <input
                    type="number"
                    placeholder="Number of Attendees"
                    className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                    value={attendees ?? ""}
                    onChange={(e) => setAttendees(Number(e.target.value))}
                  />
                </>
              )}
              {planType === "live" && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 2 hours)"
                    className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              )}
            </>
          )}

          {/* Upload Event Fields */}
          {planType === "upload" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-black dark:text-white">Upload Event</h3>
              
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="url"
                  placeholder="Event URL (optional)"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                  value={eventURL}
                  onChange={(e) => setEventURL(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg"
                >
                  Process URL
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="file"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                  onChange={handleImageUpload}
                />
              </div>

              {preview && (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full h-48 object-contain rounded-lg" />
                  <button
                    onClick={() => setPreview(null)}
                    className="absolute top-2 right-2 p-1 bg-white dark:bg-zinc-900 rounded-full shadow"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              
              {error && (
                <Alert message={error} />
              )}

              {isProcessing && (
                <div className="flex items-center justify-center mt-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Processing...</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-indigo-400 to-sky-400 text-white rounded-lg font-medium transition-colors hover:opacity-90"
          >
            Post Plan
          </button>
        </form>
      </div>
    </div>
  );
}
