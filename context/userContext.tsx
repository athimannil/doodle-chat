'use client';
import {
  createContext,
  ReactNode,
  useContext,
  useSyncExternalStore,
  useCallback,
  useMemo,
} from 'react';

const STORAGE_KEY = 'doodle-chat-username';

interface UserContextValue {
  username: string;
  setUsername: (name: string) => void;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

const getSnapshot = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY) ?? '';
};

const getServerSnapshot = (): string => '';

const subscribe = (callback: () => void): (() => void) => {
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const username = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const setUsername = useCallback((name: string) => {
    const trimmed = name.trim();
    localStorage.setItem(STORAGE_KEY, trimmed);
    window.dispatchEvent(
      new StorageEvent('storage', { key: STORAGE_KEY, newValue: trimmed })
    );
  }, []);

  const value = useMemo(
    () => ({ username, setUsername, isLoggedIn: username.length > 0 }),
    [username, setUsername]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export { UserProvider, useUser };
