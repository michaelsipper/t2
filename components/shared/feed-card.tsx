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
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      {/* Repost Header */}
      {item.type === 'repost' && (
        <>
          <div className="px-4 py-2 border-b border-zinc-800 flex items-center gap-2 text-zinc-400">
            <Repeat className="w-4 h-4" />
            <span className="text-sm">
              Reposted by <span className="text-white font-medium">{item.poster.name}</span>
            </span>
          </div>
          
          {/* Repost Actions */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-zinc-800">
            <div className="flex gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}

      <div className="p-4">
        {/* Time Progress Bar for Realtime Events */}
        {item.type === 'realtime' && (
          <div className="mb-4">
            <TimeProgressBar
              startTime={item.event.startTime!}
              duration={item.event.duration!}
            />
          </div>
        )}

        {/* Original Post Content */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-sky-400 flex items-center justify-center text-white font-medium">
            {(item.type === 'repost' ? item.event.originalPoster?.name : item.poster.name)?.[0]}
          </div>
          <div className="ml-3">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">
                {item.type === 'repost' ? item.event.originalPoster?.name : item.poster.name}
              </span>
              <span className="text-sm text-zinc-400">
                {item.type === 'repost' ? item.event.originalPoster?.age : item.poster.age}
              </span>
              <span className={`
                text-xs px-2 py-0.5 rounded-lg 
                ${
                  (item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection) === "1st"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : (item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection) === "2nd"
                      ? "bg-sky-400/10 text-sky-400"
                      : "bg-zinc-800 text-zinc-400"
                }
              `}>
                {item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection}
              </span>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 text-white">
            {item.event.title}
          </h3>
          <p className="text-zinc-300 mb-3 leading-relaxed">
            {item.event.description}
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
            <span>{item.event.time}</span>
            <span>•</span>
            <span>{item.event.location}</span>
          </div>
        </div>

        {/* Participants */}
        <div className="py-3 border-t border-zinc-800">
          <ParticipantsDisplay
            totalSpots={item.event.totalSpots}
            participants={item.event.participants}
            remainingSpots={item.event.totalSpots - item.event.participants.length}
            showNames={item.poster.connection === "1st"}
            openInvite={item.event.openInvite}
          />
        </div>

        {/* Original Post Actions */}
        {item.type !== 'repost' && (
          <div className="flex justify-between items-center pt-3 border-t border-zinc-800">
            <div className="flex gap-4">
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </button>
              <button className="text-zinc-400 hover:text-white transition-colors">
                <Send className="w-5 h-5" />
              </button>
              {item.event.openInvite && (
                <button
                  onClick={() => onRepostToggle(item.id)}
                  className={`transition-colors ${isReposted ? 'text-sky-400' : 'text-zinc-400 hover:text-white'}`}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {item.event.currentInterested > 0 && (
                <span className="text-sm text-zinc-400">
                  {item.event.currentInterested} interested
                </span>
              )}
              <button
                onClick={() => onInterestToggle(item.id)}
                className={`
                  px-4 py-1.5 rounded-xl text-sm font-medium
                  transition-all duration-300
                  ${
                    isInterested
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      : 'bg-gradient-to-r from-indigo-400 to-sky-400 text-white hover:opacity-90'
                  }
                `}
              >
                {isInterested ? 'Interested' : 'Join'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}