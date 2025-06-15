'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  if (loading) return <div>Loading...</div>;
  if (user) {
    return (
      <div>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem'}}>Dashboard Overview</h1>
        <p>Welcome, {user.email}. This is the main dashboard where you can get an overview of your classes and pending tasks.</p>
      </div>
    );
  }
  return null;
}