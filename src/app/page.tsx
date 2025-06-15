// src/app/dashboard/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the loading is complete and we have the user's profile
    if (!loading && userProfile) {
      // Check the user's role and redirect accordingly
      if (userProfile.role === 'admin') {
        router.push('/dashboard/admin');
      }
      // Teachers will stay on this page, which will render their overview.
    } else if (!loading && !userProfile) {
      // If loading is done and there's still no user, send back to login
      router.push('/');
    }
  }, [userProfile, loading, router]);

  // Only render the teacher's dashboard if we've confirmed their role.
  if (userProfile?.role === 'teacher') {
    return (
      <div>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Dashboard Overview</h1>
        <p>Welcome, {userProfile.email}. This is the main dashboard where you can get an overview of your classes and pending tasks.</p>
      </div>
    );
  }

  // For all other cases (initial load, admin redirecting), show a loading screen.
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