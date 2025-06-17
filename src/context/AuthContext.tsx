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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // NEW: Clear the saved email on logout
      localStorage.removeItem('user_email');
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
          // NEW: Read the email from local storage
          const storedEmail = localStorage.getItem('user_email');
          
          // Check if the email suggests an admin role
          if (storedEmail && storedEmail.includes('admin')) {
            setUser({ 
              uid: 'dummy-admin-uid-123', 
              name: 'Admin User', 
              email: storedEmail, 
              role: 'admin' 
            });
          } else {
            // Otherwise, create a teacher user
            setUser({ 
              uid: 'dummy-teacher-uid-456', 
              name: 'Teacher User', 
              email: storedEmail || 'teacher@example.com', 
              role: 'teacher' 
            });
          }
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#1a1d2e', color: '#ffffff' }}>
        Loading...
      </div>
    );
  }
  
  const value = { user, isAuthenticated: !!user, loading, logout };

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