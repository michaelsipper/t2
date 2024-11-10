// create.tsx

'use client';
import { useState } from "react";
import { Calendar, MapPin, Clock, Upload, Link } from "lucide-react";

type PlanType = "scheduled" | "live" | "upload";

export function Create() {
  const [planType, setPlanType] = useState<PlanType>("scheduled");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState<number | null>(null);
  const [media, setMedia] = useState<File | null>(null);
  const [eventURL, setEventURL] = useState("");

  const handlePlanTypeChange = (type: PlanType) => {
    setPlanType(type);
    if (type !== "scheduled") setTime("");
    if (type !== "live") setDuration("");
    if (type !== "upload") {
      setMedia(null);
      setEventURL("");
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ planType, title, description, location, time, duration, attendees, media, eventURL });
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
          {/* Common Fields for Scheduled Plan and Live Happening */}
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
              </div>

              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                <input
                  type="file"
                  className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                  onChange={(e) => setMedia(e.target.files ? e.target.files[0] : null)}
                />
              </div>
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
