'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
const cardStyle: React.CSSProperties = { backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '1rem', maxWidth: '300px', marginTop: '2rem', textDecoration: 'none', color: 'white' };
export default function AdminPage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && userProfile?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [userProfile, loading, router]);
  if (loading || !userProfile) return <div>Verifying permissions...</div>;
  if (userProfile.role === 'admin') {
    return (
      <div>
        <h1 style={{fontSize: '2rem', fontWeight: 'bold'}}>Admin Dashboard</h1>
        <p>Welcome, Administrator. Here you can manage users, students, and system settings.</p>
        <Link href="/dashboard/admin/users" style={cardStyle}>
          <Users size={24} />
          <div>
            <h2 style={{fontWeight: 600}}>Manage Users</h2>
            <p style={{fontSize: '0.875rem', color: '#9ca3af'}}>View and edit user roles</p>
          </div>
        </Link>
      </div>
    );
  }
  return null;
}