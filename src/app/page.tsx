'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  // We now need the userProfile to check their role
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // First, check if the user is logged in at all. If not, send to login page.
      if (!user) {
        router.push('/');
      } 
      // If the user profile is loaded and their role is 'admin', redirect to the admin page.
      else if (userProfile?.role === 'admin') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, userProfile, loading, router]);

  // Show a loading screen while we determine where to send the user
  if (loading || (user && !userProfile) || userProfile?.role === 'admin') {
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

  // If the user is a teacher, they will stay on this page and see the overview.
  if (user && userProfile?.role === 'teacher') {
    return (
      <div>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Dashboard Overview</h1>
        <p>Welcome, {user.email}. This is the main dashboard where you can get an overview of your classes and pending tasks.</p>
      </div>
    );
  }

  // Fallback for any other state
  return null;
}