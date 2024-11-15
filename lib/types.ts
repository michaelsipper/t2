//types.ts

// types.ts

// Existing types remain unchanged
export interface Participant {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Poster {
  name: string;
  age?: number;
  connection: "1st" | "2nd" | "3rd";
}

export interface Event {
  title: string;
  description: string;
  time?: string;
  location: string;
  currentInterested: number;
  openInvite: boolean;
  totalSpots: number;
  participants: Participant[];
  startTime?: number;
  duration?: number;
  originalPoster?: Poster;
}

export interface FeedItem {
  id: number;
  type: "scheduled" | "realtime" | "repost";
  poster: Poster;
  event: Event;
  repostMessage?: string;
}

// New Profile-specific types
export interface ProfileStats {
  flakeScore: number;
  friendCount: number;
  plansCreated: number;
  plansAttended: number;
  plansCompleted: number;
  interestAcceptanceRate: number;
  averageResponseTime: number; // in minutes
  topActivities: string[];
  lastActive: string;
}

export interface ProfilePhoto {
  id: string;
  url: string | null;
  order: number;
  caption?: string;
  isPrivate: boolean;
}

export interface ProfileBlurb {
  id: string;
  prompt: string;
  response: string;
  lastUpdated: string;
}

export interface ProfilePreferences {
  maxGroupSize: number;
  preferredActivities: string[];
  availability: {
    weekdays: boolean;
    weekends: boolean;
    evenings: boolean;
    mornings: boolean;
  };
  locationPreference: {
    radius: number; // in miles
    neighborhoods: string[];
  };
}

export interface ProfileBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

export interface Profile {
  name: string;
  location: string;
  photos: ProfilePhoto[];
  blurbs: ProfileBlurb[];
  preferences: ProfilePreferences;
  badges: ProfileBadge[];
  joinDate: string;
  stats: ProfileStats;
}