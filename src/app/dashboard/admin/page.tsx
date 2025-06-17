'use client';
    
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Users, BookMarked, BarChart3 } from 'lucide-react'; // Import new icon

const cardStyle: React.CSSProperties = {
    backgroundColor: '#1f2937', padding: '1.5rem', borderRadius: '0.75rem',
    border: '1px solid #374151', display: 'flex', alignItems: 'center',
    gap: '1rem', maxWidth: '300px', marginTop: '2rem',
    textDecoration: 'none', color: 'white'
};

const gridStyle: React.CSSProperties = {
    display: 'flex', flexWrap: 'wrap', gap: '1.5rem'
};
    
export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div>Verifying permissions...</div>;
    }

    if (user.role === 'admin') {
        return (
            <div>
                <h1 style={{fontSize: '2rem', fontWeight: 'bold'}}>Admin Dashboard</h1>
                <p>Welcome, Administrator. Here you can manage users, students, and system settings.</p>
                
                <div style={gridStyle}>
                    <Link href="/dashboard/admin/users" style={cardStyle}>
                        <Users size={24} />
                        <div>
                            <h2 style={{fontWeight: 600}}>Manage Users</h2>
                            <p style={{fontSize: '0.875rem', color: '#9ca3af'}}>View and edit user roles</p>
                        </div>
                    </Link>
                    <Link href="/dashboard/admin/accommodations" style={cardStyle}>
                        <BookMarked size={24} />
                        <div>
                            <h2 style={{fontWeight: 600}}>Manage Accommodations</h2>
                            <p style={{fontSize: '0.875rem', color: '#9ca3af'}}>Add or edit accommodations</p>
                        </div>
                    </Link>
                    {/* Link to the new reports page */}
                    <Link href="/dashboard/admin/reports" style={cardStyle}>
                        <BarChart3 size={24} />
                        <div>
                            <h2 style={{fontWeight: 600}}>Compliance Reports</h2>
                            <p style={{fontSize: '0.875rem', color: '#9ca3af'}}>View implementation logs</p>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    return null;
}
