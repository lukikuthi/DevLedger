import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AppMode, User } from '@/types';
import { authService } from '@/services/api';

interface AppState {
  user: User | null;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AppMode>('personal');

  const handleSetMode = useCallback((m: AppMode) => {
    setMode(m);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    setUser(u);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    authService.getUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <AppStateContext.Provider value={{
      user,
      mode,
      setMode: handleSetMode,
      login,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
