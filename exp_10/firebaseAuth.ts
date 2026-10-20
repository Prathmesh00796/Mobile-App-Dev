import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName?: string;
  emailVerified: boolean;
  createdAt: string;
}

type AuthStateListener = (user: FirebaseUser | null) => void;

const AUTH_STORAGE_KEY = '@firebase_simulated_users';
const CURRENT_USER_KEY = '@firebase_current_user_session';

class FirebaseAuthService {
  private listeners: AuthStateListener[] = [];
  private _currentUser: FirebaseUser | null = null;
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        this._currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to restore auth session:', e);
    } finally {
      this.initialized = true;
      this.notifyListeners();
    }
  }

  get currentUser(): FirebaseUser | null {
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

  // Step 78: onAuthStateChanged listener
  onAuthStateChanged(listener: AuthStateListener): () => void {
    this.listeners.push(listener);
    // Fire immediately with current state
    if (this.initialized) {
      listener(this._currentUser);
    }
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Step 75: createUserWithEmailAndPassword(email, password)
  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: FirebaseUser }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      const err: any = new Error('The email address is badly formatted.');
      err.code = 'auth/invalid-email';
      throw err;
    }

    if (!password || password.length < 6) {
      const err: any = new Error('Password should be at least 6 characters.');
      err.code = 'auth/weak-password';
      throw err;
    }

    // Retrieve existing users from local persistent db
    const usersJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    const users: Record<string, { passwordHash: string; user: FirebaseUser }> = usersJson
      ? JSON.parse(usersJson)
      : {
          'student@college.edu': {
            passwordHash: 'password123',
            user: {
              uid: 'usr_default_demo_01',
              email: 'student@college.edu',
              displayName: 'Demo Student',
              emailVerified: true,
              createdAt: new Date().toISOString(),
            },
          },
        };

    if (users[cleanEmail]) {
      const err: any = new Error('The email address is already in use by another account.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }

    const newUser: FirebaseUser = {
      uid: 'uid_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      emailVerified: false,
      createdAt: new Date().toISOString(),
    };

    users[cleanEmail] = {
      passwordHash: password,
      user: newUser,
    };

    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    this._currentUser = newUser;
    this.notifyListeners();

    return { user: newUser };
  }

  // Step 76: signInWithEmailAndPassword(email, password)
  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: FirebaseUser }> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err: any = new Error('Invalid email address format.');
      err.code = 'auth/invalid-email';
      throw err;
    }

    if (!password) {
      const err: any = new Error('Password cannot be empty.');
      err.code = 'auth/missing-password';
      throw err;
    }

    const usersJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    const users: Record<string, { passwordHash: string; user: FirebaseUser }> = usersJson
      ? JSON.parse(usersJson)
      : {
          'student@college.edu': {
            passwordHash: 'password123',
            user: {
              uid: 'usr_default_demo_01',
              email: 'student@college.edu',
              displayName: 'Demo Student',
              emailVerified: true,
              createdAt: new Date().toISOString(),
            },
          },
        };

    const record = users[cleanEmail];
    if (!record) {
      const err: any = new Error('There is no existing user record corresponding to this identifier.');
      err.code = 'auth/user-not-found';
      throw err;
    }

    if (record.passwordHash !== password) {
      const err: any = new Error('The password entered is incorrect. Please try again.');
      err.code = 'auth/wrong-password';
      throw err;
    }

    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(record.user));
    this._currentUser = record.user;
    this.notifyListeners();

    return { user: record.user };
  }

  // Step 77: sendPasswordResetEmail(email)
  async sendPasswordResetEmail(email: string): Promise<void> {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      const err: any = new Error('Please enter a valid email address.');
      err.code = 'auth/invalid-email';
      throw err;
    }

    const usersJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};

    // In Firebase production, for security it succeeds without leaking user presence
    // We simulate a realistic network delay
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 800));
  }

  // Step 79: signOut()
  async signOut(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    this._currentUser = null;
    this.notifyListeners();
  }
}

const authInstance = new FirebaseAuthService();

// Standard Firebase SDK export style: auth()
export const auth = () => authInstance;

export default auth;
