'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface User {
  uid: string;
  name: string;
  email: string;
  role?: 'admin' | 'teacher';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>; // Add the logout function to our context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Define the logout function here
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Clear the user state and redirect
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = document.cookie.includes('auth_token=');
        if (token) {
          setUser({ uid: 'dummy-admin-uid-123', name: 'Admin User', email: 'admin@example.com', role: 'admin' });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  if (loading && !user) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#1a1d2e', color: '#ffffff'
      }}>
        Loading...
      </div>
    );
  }
  
  // Provide the user, loading status, and logout function in the context's value
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}