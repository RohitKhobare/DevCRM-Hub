import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, UserRole, PlanType } from '../lib/types';

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    if (API_URL) {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUser({ id: data.id, full_name: data.fullName || data.full_name, email: data.email, role: data.role } as unknown as Profile);
      }
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (data) setUser(data);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (API_URL) {
      const token = localStorage.getItem('token');
      if (token) {
        await fetchProfile('');
      }
      setLoading(false);
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (API_URL) {
      const token = localStorage.getItem('token');
      if (token) {
        fetchProfile('').finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, fullName, phone }) });
        const data = await res.json();
        if (!res.ok) return { error: data.error || 'Registration failed' };
        localStorage.setItem('token', data.token);
        setUser({ id: data.user.id, full_name: data.user.fullName || data.user.full_name, email: data.user.email } as unknown as Profile);
        return { error: null };
      } catch (e) { return { error: String(e) }; }
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    if (error) return { error: error.message };

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: fullName,
        email,
        phone: phone || null,
        role: 'user' as UserRole,
        plan: 'free' as PlanType,
      });
      await fetchProfile(session.user.id);
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const data = await res.json();
        if (!res.ok) return { error: data.error || 'Login failed' };
        localStorage.setItem('token', data.token);
        setUser({ id: data.user.id, full_name: data.user.fullName || data.user.full_name, email: data.user.email, role: data.user.role } as unknown as Profile);
        return { error: null };
      } catch (e) { return { error: String(e) }; }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    if (API_URL) {
      localStorage.removeItem('token');
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, isAdmin, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
