import axios from 'axios';
import { CampusEvent } from '../types';

const REST_API_URL = 'https://jsonplaceholder.typicode.com/posts';

// Curated high quality imagery for campus activities
const EVENT_IMAGES = [
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=80',
];

const CATEGORIES: Array<CampusEvent['category']> = [
  'Tech',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
];

const VENUES = [
  'Auditorium Block A',
  'Turing Hall - 302',
  'Campus Sports Complex',
  'Innovation & Robotics Lab',
  'Open Air Amphitheatre',
  'Seminar Hall 2',
];

export const fetchCampusEventsFromApi = async (): Promise<CampusEvent[]> => {
  try {
    const response = await axios.get(REST_API_URL, { timeout: 6000 });
    const posts = response.data.slice(0, 10);

    return posts.map((post: any, index: number): CampusEvent => {
      const category = CATEGORIES[index % CATEGORIES.length];
      const venue = VENUES[index % VENUES.length];
      const imageUrl = EVENT_IMAGES[index % EVENT_IMAGES.length];

      return {
        id: `event_${post.id}`,
        title: capitalize(post.title),
        description: `${capitalize(post.body)}. Join faculty, guest industry leaders, and fellow undergraduates for an inspiring session on modern computing and campus activities.`,
        category,
        date: `Oct ${24 + (index % 7)}, 2026`,
        time: `${10 + (index % 6)}:00 AM - ${12 + (index % 5)}:30 PM`,
        venue,
        organizer: `Dept. of ${category} Affairs`,
        speaker: index % 2 === 0 ? 'Dr. Aris Thorne (Distinguished Fellow)' : undefined,
        capacity: 120 + index * 15,
        registeredCount: 42 + index * 8,
        imageUrl,
        tags: [category.toLowerCase(), 'campus', 'live'],
      };
    });
  } catch (error: any) {
    console.warn('REST API fetch error, utilizing fallback:', error.message);
    throw error;
  }
};

const capitalize = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
