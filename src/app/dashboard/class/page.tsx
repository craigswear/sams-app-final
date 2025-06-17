'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useSearchParams } from 'next/navigation';
import { Student } from '@/types';
import styles from './page.module.css';
import Link from 'next/link';

function ClassDetailContent() {
    const searchParams = useSearchParams();
    const classId = searchParams.get('id');

    const [className, setClassName] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClassDetails = useCallback(async () => {
        if (!classId) {
            setError("No class specified.");
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const classDocRef = doc(db, 'teacherClasses', classId);
            const classDocSnap = await getDoc(classDocRef);

            if (!classDocSnap.exists()) {
                throw new Error("Class not found.");
            }
            const classData = classDocSnap.data();
            setClassName(classData.name);

            const studentIds = classData.studentIds as string[];
            if (studentIds.length > 0) {
                const studentsQuery = query(collection(db, 'students'), where('__name__', 'in', studentIds));
                const studentsSnapshot = await getDocs(studentsQuery);
                const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
                setStudents(studentsList);
            } else {
                setStudents([]);
            }

        } catch (err) {
            console.error("Error fetching class details:", err);
            setError("Failed to load class details.");
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        fetchClassDetails();
    }, [fetchClassDetails]);

    if (loading) return <div className={styles.loading}>Loading Class Roster...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div>
            <header className={styles.header}>
                <Link href="/dashboard" className={styles.backLink}>&larr; Back to My Classes</Link>
                <h1>{className}</h1>
                <p>Student Roster</p>
            </header>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Student ID</th>
                            <th>Accommodations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.studentId}</td>
                                <td>
                                    {student.accommodations?.map(acc => acc.name).join(', ') || 'None'}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={3} style={{textAlign: 'center'}}>This class has no students.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ClassDetailsPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <ClassDetailContent />
        </Suspense>
    );
}
