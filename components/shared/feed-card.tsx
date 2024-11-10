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
  const formatTextWithMentions = (text: string) => {
    return text.split(' ').map((word, index, array) => {
      if (word.includes('@')) {
        const parts = word.split(/(@\w+)/);
        return (
          <span key={index}>
            {parts.map((part, i) =>
              part.startsWith('@') ?
                <span key={i} className="text-blue-500">{part}</span> :
                part
            )}
          </span>
        );
      }
      return <span key={index}>{word}{index < array.length - 1 ? ' ' : ''}</span>;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      {item.type === 'repost' && (
        <>
          <div className="flex items-center gap-2 mb-3 text-gray-600">
            <Repeat className="w-4 h-4" />
            <span className="text-sm">
              Reposted by <span className="font-medium">{item.poster.name}</span>
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              item.poster.connection === "1st" ? "bg-green-100 text-green-800" :
              item.poster.connection === "2nd" ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800"
            }`}>
              {item.poster.connection}
            </span>
          </div>

          {item.repostMessage && (
            <div className="mb-4">
              <p className="text-gray-800">{formatTextWithMentions(item.repostMessage)}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-4 pb-4 border-b">
            <div className="flex space-x-4">
              <button className="text-gray-500 hover:text-pink-500 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="text-gray-500 hover:text-blue-500 transition-colors">
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 mb-3">Original post by:</div>
        </>
      )}

      {item.type === 'realtime' && (
        <TimeProgressBar
          startTime={item.event.startTime!}
          duration={item.event.duration!}
        />
      )}

      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="ml-3">
          <div className="flex items-center">
            <span className="font-semibold">
              {item.type === 'repost' ? item.event.originalPoster?.name : item.poster.name}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {item.type === 'repost' ? item.event.originalPoster?.age : item.poster.age}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
              (item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection) === "1st"
                ? "bg-green-100 text-green-800"
                : (item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection) === "2nd"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
            }`}>
              {item.type === 'repost' ? item.event.originalPoster?.connection : item.poster.connection}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">
          {formatTextWithMentions(item.event.title)}
        </h3>
        <p className="text-gray-600 mb-2">
          {formatTextWithMentions(item.event.description)}
        </p>
        <div className="text-sm text-gray-500">
          <p className="mb-1">
            🕒 {item.type === 'realtime' ? `${item.event.duration}hr event (in progress)` : item.event.time}
          </p>
          <p>📍 {item.event.location}</p>
        </div>
      </div>

      <ParticipantsDisplay
        totalSpots={item.event.totalSpots}
        participants={item.event.participants}
        remainingSpots={item.event.totalSpots - item.event.participants.length}
        showNames={item.poster.connection === "1st"}
        openInvite={item.event.openInvite}
      />

      {item.type !== 'repost' && (
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-pink-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="text-gray-500 hover:text-blue-500 transition-colors">
              <Send className="w-6 h-6" />
            </button>
            {item.event.openInvite && (
              <button
                onClick={() => onRepostToggle(item.id)}
                className={`transition-colors ${isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'}`}
              >
                <Repeat className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {item.event.currentInterested} interested
            </span>
            <button
              onClick={() => onInterestToggle(item.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isInterested
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isInterested ? 'Not Interested' : 'Interested'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}