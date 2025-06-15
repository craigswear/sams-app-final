'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRedirectPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the initial loading is done
    if (loading) {
      return;
    }

    // If there's still no user profile, they are not logged in.
    if (!userProfile) {
        router.push('/');
        return;
    }
    
    // If the user's profile is loaded and they are an admin, send them to the admin page
    if (userProfile.role === 'admin') {
      router.push('/dashboard/admin');
    }
    // Note: If the user is a teacher, we will let this page render the teacher's overview below.

  }, [userProfile, loading, router]);

  // Show the Teacher's dashboard view ONLY if their role is confirmed.
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
