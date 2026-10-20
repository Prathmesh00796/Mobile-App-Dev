import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

type AuthListener = (user: UserProfile | null) => void;

const AUTH_STORAGE_KEY = '@campus_event_users';
const CURRENT_SESSION_KEY = '@campus_event_active_session';

class CampusFirebaseAuth {
  private listeners: AuthListener[] = [];
  private _currentUser: UserProfile | null = null;
  private initialized: boolean = false;

  constructor() {
    this.restoreSession();
  }

  private async restoreSession() {
    try {
      const stored = await AsyncStorage.getItem(CURRENT_SESSION_KEY);
      if (stored) {
        this._currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed restoring session:', e);
    } finally {
      this.initialized = true;
      this.notifyListeners();
    }
  }

  get currentUser(): UserProfile | null {
    return this._currentUser;
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this._currentUser);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    });
  }

  onAuthStateChanged(listener: AuthListener): () => void {
    this.listeners.push(listener);
    if (this.initialized) {
      listener(this._currentUser);
    }
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      const err: any = new Error('Please provide both email and password.');
      err.code = 'auth/invalid-credentials';
      throw err;
    }

    const usersData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    const users: Record<string, { passwordHash: string; profile: UserProfile }> = usersData
      ? JSON.parse(usersData)
      : {
          'alex@campus.edu': {
            passwordHash: 'pass123',
            profile: {
              uid: 'usr_alex_001',
              email: 'alex@campus.edu',
              fullName: 'Alex Morgan',
              studentId: 'CS-2024-042',
              department: 'Computer Science & Engineering',
              createdAt: '2026-01-15T10:00:00Z',
            },
          },
        };

    const record = users[cleanEmail];
    if (!record) {
      const err: any = new Error('No campus account registered with this email.');
      err.code = 'auth/user-not-found';
      throw err;
    }

    if (record.passwordHash !== password) {
      const err: any = new Error('Invalid password. Please check your credentials.');
      err.code = 'auth/wrong-password';
      throw err;
    }

    await AsyncStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(record.profile));
    this._currentUser = record.profile;
    this.notifyListeners();
    return record.profile;
  }

  async createUserWithEmailAndPassword(
    email: string,
    password: string,
    fullName: string,
    studentId: string,
    department: string
  ): Promise<UserProfile> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err: any = new Error('Invalid email address format.');
      err.code = 'auth/invalid-email';
      throw err;
    }

    if (password.length < 6) {
      const err: any = new Error('Password must be at least 6 characters.');
      err.code = 'auth/weak-password';
      throw err;
    }

    const usersData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    const users: Record<string, { passwordHash: string; profile: UserProfile }> = usersData
      ? JSON.parse(usersData)
      : {};

    if (users[cleanEmail]) {
      const err: any = new Error('This email is already registered.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }

    const newProfile: UserProfile = {
      uid: 'uid_' + Date.now().toString(36),
      email: cleanEmail,
      fullName: fullName.trim() || cleanEmail.split('@')[0],
      studentId: studentId.trim() || 'STU-' + Math.floor(1000 + Math.random() * 9000),
      department: department.trim() || 'Information Technology',
      createdAt: new Date().toISOString(),
    };

    users[cleanEmail] = {
      passwordHash: password,
      profile: newProfile,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(newProfile));

    this._currentUser = newProfile;
    this.notifyListeners();
    return newProfile;
  }

  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_SESSION_KEY);
    this._currentUser = null;
    this.notifyListeners();
  }
}

export const campusAuth = new CampusFirebaseAuth();
export default campusAuth;
