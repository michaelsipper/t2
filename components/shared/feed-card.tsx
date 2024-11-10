'use client';
import { Heart, MessageCircle, Send, Repeat } from 'lucide-react';
import { TimeProgressBar } from './time-progress-bar';
import { ParticipantsDisplay } from './participants-display';
import type { FeedItem } from '@/lib/types';

interface FeedCardProps {
  item: FeedItem;
  onInterestToggle: (id: number) => void;
  onRepostToggle: (id: number) => void;
  isInterested: boolean;
  isReposted: boolean;
}

export function FeedCard({
  item,
  onInterestToggle,
  onRepostToggle,
  isInterested,
  isReposted
}: FeedCardProps) {
  return (
    <div className="bg-white rounded-xl border">
      {item.type === 'repost' && (
        <div className="px-4 py-2 border-b flex items-center gap-2 text-gray-600">
          <Repeat className="w-4 h-4" />
          <span className="text-sm">
            Reposted by <span className="font-medium">{item.poster.name}</span>
          </span>
        </div>
      )}

      <div className="p-4">
        {item.type === 'realtime' && (
          <TimeProgressBar
            startTime={item.event.startTime!}
            duration={item.event.duration!}
          />
        )}

        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium">
            {item.poster.name[0]}
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {item.type === 'repost' ? item.event.originalPoster?.name : item.poster.name}
              </span>
              <span className="text-sm text-gray-500">
                {item.type === 'repost' ? item.event.originalPoster?.age : item.poster.age}
              </span>
              <span className={`
                text-xs px-2 py-0.5 rounded-full 
                ${
                  (item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection) === "1st"
                    ? "bg-green-100 text-green-700"
                    : (item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection) === "2nd"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                }
              `}>
                {item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection}
              </span>
            </div>
          </div>
        </div>

        {/* Event Content */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">
            {item.event.title}
          </h3>
          <p className="text-gray-600 mb-3">
            {item.event.description}
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span>{item.event.time}</span>
            <span>•</span>
            <span>{item.event.location}</span>
          </div>
        </div>

        <ParticipantsDisplay
          totalSpots={item.event.totalSpots}
          participants={item.event.participants}
          remainingSpots={item.event.totalSpots - item.event.participants.length}
          showNames={item.poster.connection === "1st"}
          openInvite={item.event.openInvite}
        />

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t mt-4">
          <div className="flex gap-4">
            <button className="text-gray-600 hover:text-black transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-black transition-colors">
              <Send className="w-5 h-5" />
            </button>
            {item.event.openInvite && (
              <button
                onClick={() => onRepostToggle(item.id)}
                className={`transition-colors ${isReposted ? 'text-green-500' : 'text-gray-600 hover:text-black'}`}
              >
                <Repeat className="w-5 h-5" />
              </button>
            )}
          </div>

          <button
            onClick={() => onInterestToggle(item.id)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium
              transition-all duration-200
              ${
                isInterested
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-900'
              }
            `}
          >
            {isInterested ? 'Interested' : 'Join'}
          </button>
        </div>
      </div>
    </div>
  );
}