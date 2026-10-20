import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CampusEvent, UserProfile } from '../types';
import { fetchCampusEventsFromApi } from '../services/apiService';
import campusAuth from '../services/firebaseAuth';

interface AppContextType {
  user: UserProfile | null;
  events: CampusEvent[];
  loading: boolean;
  error: string | null;
  favorites: string[];
  registeredEvents: string[];
  themeMode: 'light' | 'dark';
  toggleFavorite: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
  registerForEvent: (eventId: string) => Promise<boolean>;
  unregisterForEvent: (eventId: string) => Promise<void>;
  isRegistered: (eventId: string) => boolean;
  refreshEvents: () => Promise<void>;
  clearAllLocalData: () => Promise<void>;
  logout: () => Promise<void>;
}

const FAVORITES_STORAGE_KEY = '@campus_favorites_v1';
const REGISTRATION_STORAGE_KEY = '@campus_registered_v1';
const THEME_STORAGE_KEY = '@campus_theme_pref';

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fallback dataset in case the device is offline during lab demonstration
const FALLBACK_EVENTS: CampusEvent[] = [
  {
    id: 'event_1',
    title: 'National AI & Robotics Hackathon 2026',
    description: '36-hour intense collaborative coding sprint with industry mentors from top tech companies. Food, swags, and prizes worth $5000 provided.',
    category: 'Tech',
    date: 'Oct 25, 2026',
    time: '09:00 AM - 09:00 PM',
    venue: 'Auditorium Block A',
    organizer: 'Dept. of Computer Science & Robotics',
    speaker: 'Dr. Evelyn Reed (AI Researcher)',
    capacity: 250,
    registeredCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80',
    tags: ['hackathon', 'ai', 'tech', 'coding'],
  },
  {
    id: 'event_2',
    title: 'Inter-College Cultural Gala & Band Night',
    description: 'The biggest musical celebration of the semester! Live musical performances, indie acoustic bands, food trucks, and street dance battles.',
    category: 'Cultural',
    date: 'Oct 27, 2026',
    time: '06:00 PM - 10:30 PM',
    venue: 'Open Air Amphitheatre',
    organizer: 'Campus Cultural Committee',
    capacity: 600,
    registeredCount: 420,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80',
    tags: ['music', 'cultural', 'dance', 'fest'],
  },
  {
    id: 'event_3',
    title: 'Full-Stack React Native & Cloud Workshop',
    description: 'Hands-on practical training on modern cross-platform development, TypeScript, state management, REST APIs, and native module bridging.',
    category: 'Workshop',
    date: 'Oct 29, 2026',
    time: '11:00 AM - 03:00 PM',
    venue: 'Turing Hall - 302',
    organizer: 'Mobile Developers Club',
    speaker: 'Eng. Marcus Chen (Staff Mobile Architect)',
    capacity: 100,
    registeredCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=700&q=80',
    tags: ['react-native', 'mobile', 'workshop'],
  },
  {
    id: 'event_4',
    title: 'Annual Inter-Department Football Championship',
    description: 'Join the crowd to cheer for your department team in the finals of the annual collegiate soccer tournament under floodlights.',
    category: 'Sports',
    date: 'Nov 02, 2026',
    time: '04:00 PM - 07:00 PM',
    venue: 'Campus Sports Complex',
    organizer: 'Athletic Council',
    capacity: 400,
    registeredCount: 290,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=80',
    tags: ['football', 'tournament', 'sports'],
  },
  {
    id: 'event_5',
    title: 'Future of Cloud Infrastructure & Serverless',
    description: 'Keynote presentation discussing edge computing, distributed microservices, Docker, Kubernetes, and reactive backend systems.',
    category: 'Seminar',
    date: 'Nov 05, 2026',
    time: '02:00 PM - 04:30 PM',
    venue: 'Seminar Hall 2',
    organizer: 'IEEE Student Branch',
    speaker: 'Prof. David Vance (Cloud Systems Specialist)',
    capacity: 150,
    registeredCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=80',
    tags: ['cloud', 'kubernetes', 'seminar'],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>(FALLBACK_EVENTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // AsyncStorage persisted states (Step 93)
  const [favorites, setFavorites] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Listen to Auth State
  useEffect(() => {
    const unsub = campusAuth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  // Load persisted favorites, registrations, and theme from AsyncStorage on mount
  useEffect(() => {
    loadPersistedData();
    loadEvents();
  }, []);

  const loadPersistedData = async () => {
    try {
      const [favsJson, regJson, themeJson] = await Promise.all([
        AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
        AsyncStorage.getItem(REGISTRATION_STORAGE_KEY),
        AsyncStorage.getItem(THEME_STORAGE_KEY),
      ]);

      if (favsJson) setFavorites(JSON.parse(favsJson));
      if (regJson) setRegisteredEvents(JSON.parse(regJson));
      if (themeJson) setThemeMode(JSON.parse(themeJson));
    } catch (e) {
      console.warn('Failed loading AsyncStorage data:', e);
    }
  };

  // Step 92: Fetch dynamic data via REST API with loading and error states
  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetched = await fetchCampusEventsFromApi();
      if (fetched && fetched.length > 0) {
        setEvents(fetched);
      }
    } catch (e: any) {
      setError(e.message || 'Network request failed. Displaying local cache.');
      // Keep fallback events so user can still test all features offline
      setEvents(FALLBACK_EVENTS);
    } finally {
      setLoading(false);
    }
  };

  // Step 93: AsyncStorage Favorite Item Toggle (CRUD)
  const toggleFavorite = async (eventId: string) => {
    const exists = favorites.includes(eventId);
    const updated = exists
      ? favorites.filter((id) => id !== eventId)
      : [...favorites, eventId];

    setFavorites(updated);
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed saving favorite to AsyncStorage:', e);
    }
  };

  const isFavorite = (eventId: string) => {
    return favorites.includes(eventId);
  };

  // Step 93: AsyncStorage Event Registration Persistence
  const registerForEvent = async (eventId: string): Promise<boolean> => {
    if (registeredEvents.includes(eventId)) return false;
    const updated = [...registeredEvents, eventId];
    setRegisteredEvents(updated);
    try {
      await AsyncStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.warn('Failed saving registration to AsyncStorage:', e);
      return false;
    }
  };

  const unregisterForEvent = async (eventId: string) => {
    const updated = registeredEvents.filter((id) => id !== eventId);
    setRegisteredEvents(updated);
    try {
      await AsyncStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed removing registration from AsyncStorage:', e);
    }
  };

  const isRegistered = (eventId: string) => {
    return registeredEvents.includes(eventId);
  };

  const clearAllLocalData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(FAVORITES_STORAGE_KEY),
        AsyncStorage.removeItem(REGISTRATION_STORAGE_KEY),
      ]);
      setFavorites([]);
      setRegisteredEvents([]);
    } catch (e) {
      console.warn('Failed clearing AsyncStorage:', e);
    }
  };

  const logout = async () => {
    await campusAuth.signOut();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        events,
        loading,
        error,
        favorites,
        registeredEvents,
        themeMode,
        toggleFavorite,
        isFavorite,
        registerForEvent,
        unregisterForEvent,
        isRegistered,
        refreshEvents: loadEvents,
        clearAllLocalData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
