// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial loading is done
    if (loading) {
      return;
    }

    // If there's no user, send them to the login page
    if (!user) {
      router.push('/');
    } 
    // If the user's profile is loaded and they are an admin, send them to the admin page
    else if (userProfile?.role === 'admin') {
      router.push('/dashboard/admin');
    }
  }, [user, userProfile, loading, router]);

  // This is the Teacher's view. We only render it if loading is finished
  // and we have confirmed the user is a teacher.
  if (!loading && userProfile?.role === 'teacher') {
    return (
      <div>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Dashboard Overview</h1>
        <p>Welcome, {user?.email}. This is the main dashboard where you can get an overview of your classes and pending tasks.</p>
      </div>
    );
  }

  // For all other states (initial load, waiting for profile, during admin redirect),
  // show a consistent loading screen to prevent a blank page.
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      fontSize: '1.5rem'
    }}>
        Loading Dashboard...
    </div>
  );
}