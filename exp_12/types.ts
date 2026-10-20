export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Tech' | 'Cultural' | 'Sports' | 'Workshop' | 'Seminar';
  date: string;
  time: string;
  venue: string;
  organizer: string;
  speaker?: string;
  capacity: number;
  registeredCount: number;
  imageUrl: string;
  tags: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  studentId: string;
  department: string;
  createdAt: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  EventDetail: { eventId: string };
  ApkBuild: undefined;
};
