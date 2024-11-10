// create.tsx

'use client';
import { useState } from "react";
import { Calendar, MapPin, PlusCircle, Clipboard } from "lucide-react";

type PlanType = "type1" | "type2" | "type3";

export function Create() {
  const [planType, setPlanType] = useState<PlanType>("type1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [attendees, setAttendees] = useState<number | null>(null);
  const [media, setMedia] = useState<File | null>(null);

  const handlePlanTypeChange = (type: PlanType) => {
    setPlanType(type);
    // Clear irrelevant fields when switching types
    if (type !== "type1") setTime("");
    if (type !== "type2") setDuration("");
    if (type !== "type3") setMedia(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ planType, title, description, location, time, duration, attendees, media });
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
            onClick={() => handlePlanTypeChange("type1")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1
              ${planType === "type1" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Type 1
          </button>
          <button
            onClick={() => handlePlanTypeChange("type2")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1
              ${planType === "type2" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Type 2
          </button>
          <button
            onClick={() => handlePlanTypeChange("type3")}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex-1
              ${planType === "type3" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Type 3
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
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

          {planType === "type1" && (
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

          {planType === "type2" && (
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <input
                type="text"
                placeholder="Duration (e.g., 2 hours)"
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          )}

          {planType === "type3" && (
            <div className="flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
              <input
                type="file"
                className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-zinc-900 dark:text-white focus:outline-none"
                onChange={(e) => setMedia(e.target.files ? e.target.files[0] : null)}
              />
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
