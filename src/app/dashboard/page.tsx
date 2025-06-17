'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Assuming this is your path
import styles from './page.module.css';

// Sample data for the classes
const myClasses = [
  { id: 'algebra-1', name: 'test class 3', studentCount: 4 },
  { id: 'geometry-1', name: 'test class 2', studentCount: 3 },
];

export default function TeacherDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // This effect runs when the user/loading state changes
    if (!loading && user) {
      // If the user is an admin, redirect them away from the teacher dashboard
      if (user.role === 'admin') {
        router.push('/dashboard/admin');
      }
    }
  }, [user, loading, router]);

  // While the auth context is loading, or if the user is an admin about to be redirected, show a loading state.
  if (loading || (user && user.role === 'admin')) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'white' }}>
            Loading Dashboard...
        </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>My Classes</h1>
        <button className={styles.createButton}>+ Create New Class</button>
      </div>
      <div className={styles.classList}>
        {myClasses.map((course) => (
          // In a real app, the href would be `/dashboard/class/${course.id}`
          <Link href="/dashboard/class" key={course.id} className={styles.classCard}>
            <h2>{course.name}</h2>
            <p>{course.studentCount} student(s)</p>
            <div className={styles.cardActions}>
                {/* Placeholder for Edit/Delete icons */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}


