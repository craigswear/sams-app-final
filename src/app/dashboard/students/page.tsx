'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/types';
import styles from './page.module.css';

export default function AllStudentsPage() {
    const { user } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const fetchStudents = async () => {
                try {
                    const studentsCollectionRef = collection(db, 'students');
                    const querySnapshot = await getDocs(studentsCollectionRef);
                    const studentsList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Student));
                    setStudents(studentsList);
                } catch (err) {
                    console.error("Error fetching students:", err);
                    setError("Failed to load student data.");
                } finally {
                    setLoading(false);
                }
            };
            fetchStudents();
        }
    }, [user]);

    if (loading) return <div className={styles.loading}>Loading students...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>All Students</h1>
                <p className={styles.subtitle}>This is a list of all students registered in the system.</p>
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
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.firstName} {student.lastName}</td>
                                <td>{student.studentId}</td>
                                <td>
                                    {student.accommodations.length > 0 ? (
                                        student.accommodations.map((acc) => (
                                            <span key={acc.id} className={styles.accommodationTag}>{acc.name}</span>
                                        ))
                                    ) : (
                                        <span>No accommodations listed.</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}