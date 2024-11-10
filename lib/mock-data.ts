import { FeedItem } from './types';

export const feedItems: FeedItem[] = [
  {
    id: 1,
    type: 'scheduled',
    poster: {
      name: "Michael Sipper",
      age: 22,
      connection: "1st",
    },
    event: {
      title: "Catan with me and @Austin",
      description: "I have beer, but bring more",
      time: "8:00 PM Today",
      location: "Mission District, SF",
      currentInterested: 3,
      openInvite: false,
      totalSpots: 6,
      participants: [
        { id: 1, name: "Michael Sipper", avatar: null },
        { id: 2, name: "Austin Ritz", avatar: null }
      ]
    }
  },
  {
    id: 2,
    type: 'scheduled',
    poster: {
      name: "Zach Sorscher",
      age: 25,
      connection: "1st",
    },
    event: {
      title: "Morning surf sesh at Four Mile",
      description: "Have 2 extra wet suits!",
      time: "5:00 AM Tomorrow",
      location: "Four Mile, Santa Cruz",
      currentInterested: 1,
      openInvite: false,
      totalSpots: 5,
      participants: [
        { id: 3, name: "Zach Sorscher", avatar: null },
        { id: 4, name: "Suki Chen", avatar: null },
        { id: 5, name: "Katie Brown", avatar: null }
      ]
    }
  },
  {
    id: 3,
    type: 'realtime',
    poster: {
      name: "Brandon Wilson",
      age: 22,
      connection: "2nd",
    },
    event: {
      title: "Pick-up Basketball",
      description: "Come through, more ppl the better",
      startTime: new Date().getTime() - (30 * 60 * 1000),
      duration: 2,
      location: "Mission Bay Courts, SF",
      currentInterested: 8,
      openInvite: true,
      totalSpots: 10,
      participants: [
        { id: 6, name: "Brandon Wilson", avatar: null }
      ]
    }
  }
];