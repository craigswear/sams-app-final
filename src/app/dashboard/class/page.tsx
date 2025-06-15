'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, documentId } from 'firebase/firestore'; 
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { TeacherClass, Student } from '@/types';
import styles from './page.module.css';
import Link from 'next/link';
function ClassDetailContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const classId = searchParams.get('id');
    const [classDetails, setClassDetails] = useState<TeacherClass | null>(null);
    const [roster, setRoster] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (user && classId) {
            const fetchClassAndRoster = async () => {
                setLoading(true);
                try {
                    const classDocRef = doc(db, 'teacherClasses', classId);
                    const classDocSnap = await getDoc(classDocRef);
                    if (!classDocSnap.exists()) {
                        setError("Class not found.");
                    } else {
                        const classData = { id: classDocSnap.id, ...classDocSnap.data() } as TeacherClass;
                        setClassDetails(classData);
                        if (classData.studentIds && classData.studentIds.length > 0) {
                            const studentsCollectionRef = collection(db, 'students');
                            const q = query(studentsCollectionRef, where(documentId(), 'in', classData.studentIds));
                            const rosterSnapshot = await getDocs(q);
                            const rosterList = rosterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
                            setRoster(rosterList);
                        }
                    }
                } catch (err) {
                    setError("Failed to load class data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchClassAndRoster();
        } else if (!classId) {
            setError("No class ID provided.");
            setLoading(false);
        }
    }, [user, classId]);
    if (loading) return <div className={styles.loading}>Loading Class Roster...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    return (
        <div>
            <header className={styles.pageHeader}>
                <p className={styles.breadcrumb}>
                    <Link href="/dashboard/classes">My Classes</Link> / {classDetails?.name}
                </p>
                <h1 className={styles.title}>{classDetails?.name || 'Class Details'}</h1>
                <p className={styles.subtitle}>Student Roster</p>
            </header>
            <div className={styles.tableContainer}>
               <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Student ID</th>
                            <th>Accommodations on File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roster.length > 0 ? (
                            roster.map((student) => (
                                <tr key={student.id}>
                                    <td>
                                        <Link href={`/dashboard/student?id=${student.id}&classId=${classId}`}>
                                            {student.firstName} {student.lastName}
                                        </Link>
                                    </td>
                                    <td>{student.studentId}</td>
                                    <td>{student.accommodations.length}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center' }}>This class has no students yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default function ClassDetailPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <ClassDetailContent />
        </Suspense>
    );
}