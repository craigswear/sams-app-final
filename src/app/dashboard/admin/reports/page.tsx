'use client';

import { useEffect, useState } from 'react'; // Corrected: removed unused 'useMemo'
import { collection, getDocs } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { AccommodationLog, Student, UserProfile, Accommodation } from '@/types';
import styles from './page.module.css';

export default function ComplianceReportsPage() {
    const { userProfile } = useAuth();
    const [logs, setLogs] = useState<AccommodationLog[]>([]);
    const [students, setStudents] = useState<Map<string, Student>>(new Map());
    const [teachers, setTeachers] = useState<Map<string, UserProfile>>(new Map());
    const [accommodations, setAccommodations] = useState<Map<string, Accommodation>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userProfile?.role === 'admin') {
            const fetchAllData = async () => {
                setLoading(true);
                try {
                    // Fetch all data in parallel
                    const [logsSnap, studentsSnap, usersSnap, accommodationsSnap] = await Promise.all([
                        getDocs(collection(db, 'accommodationLogs')),
                        getDocs(collection(db, 'students')),
                        getDocs(collection(db, 'users')),
                        getDocs(collection(db, 'accommodations')),
                    ]);

                    // Process logs
                    const logsList = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AccommodationLog));
                    setLogs(logsList.sort((a, b) => b.date.toMillis() - a.date.toMillis())); // Sort by most recent

                    // Create maps for easy lookup
                    setStudents(new Map(studentsSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as Student])));
                    setTeachers(new Map(usersSnap.docs.map(doc => [doc.id, { uid: doc.id, ...doc.data() } as UserProfile])));
                    setAccommodations(new Map(accommodationsSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as Accommodation])));

                } catch (err) {
                    console.error("Error fetching report data: ", err);
                    setError("Failed to load report data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchAllData();
        }
    }, [userProfile]);

    const getEffectivenessText = (level: 1 | 2 | 3) => {
        switch (level) {
            case 1: return { text: 'Not Effective', style: styles.dotLow };
            case 2: return { text: 'Somewhat', style: styles.dotMedium };
            case 3: return { text: 'Very Effective', style: styles.dotHigh };
            default: return { text: 'N/A', style: '' };
        }
    };
    
    if (loading) return <div className={styles.loading}>Generating compliance reports...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Compliance Reports</h1>
                    <p className={styles.subtitle}>A complete log of all accommodation implementations.</p>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student</th>
                            <th>Accommodation</th>
                            <th>Teacher</th>
                            <th>Effectiveness</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => {
                            const student = students.get(log.studentId);
                            const teacher = teachers.get(log.teacherId);
                            const accommodation = accommodations.get(log.accommodationId);
                            const { text, style } = getEffectivenessText(log.effectiveness);

                            return (
                                <tr key={log.id}>
                                    <td>{log.date.toDate().toLocaleDateString()}</td>
                                    <td>{student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}</td>
                                    <td>{accommodation?.name || 'Unknown'}</td>
                                    <td>{teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher'}</td>
                                    <td className={styles.effectivenessCell}>
                                        <span className={`${styles.effectivenessDot} ${style}`}></span>
                                        {text}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

