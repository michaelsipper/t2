'use client';
import Image from 'next/image';

interface Participant {
  id: number;
  name: string;
  avatar: string | null;
}

interface ParticipantsDisplayProps {
  totalSpots: number;
  participants: Participant[];
  remainingSpots: number;
  showNames?: boolean;
  openInvite?: boolean;
}

export function ParticipantsDisplay({
  totalSpots: _totalSpots, // This is the fix - we're renaming it in the destructuring
  participants,
  remainingSpots,
  showNames = true,
  openInvite = false
}: ParticipantsDisplayProps) {
  if (openInvite) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm">Participants</h4>
        <span className="text-sm text-gray-500">
          {remainingSpots} spot{remainingSpots !== 1 ? 's' : ''} left
        </span>
      </div>

      <div className="flex items-center">
        <div className="flex -space-x-2 mr-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="relative"
              title={participant.name}
            >
              {participant.avatar ? (
                <div className="w-8 h-8 relative">
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    fill
                    className="rounded-full border-2 border-white bg-gray-200 object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {participant.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          ))}

          {Array.from({ length: Math.min(remainingSpots, 3) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"
            >
              <span className="text-gray-400 text-xs">+</span>
            </div>
          ))}
        </div>

        {showNames && participants.length > 0 && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{participants[0].name}</span>
            {participants.length > 1 && (
              <span> and {participants.length - 1} other{participants.length > 2 ? 's' : ''}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}