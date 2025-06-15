'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/types';
import styles from './page.module.css';
import { AddStudentModal } from '@/components/modals/AddStudentModal';
import { PlusCircle } from 'lucide-react';

export default function AllStudentsPage() {
    const { user, userProfile } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudents = useCallback(async () => {
        setLoading(true);
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
    }, []);

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user, fetchStudents]);

    if (loading) return <div className={styles.loading}>Loading students...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <>
            <AddStudentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStudentAdded={fetchStudents}
            />
            <div>
                <header className={styles.pageHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <h1 className={styles.title}>All Students</h1>
                        <p className={styles.subtitle}>A master list of all students registered in the system.</p>
                    </div>
                    {userProfile?.role === 'admin' && (
                        <button onClick={() => setIsModalOpen(true)} className={styles.addButton} style={{backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                            <PlusCircle size={20} />
                            Add Student
                        </button>
                    )}
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
                                                <span key={acc.id} className={styles.accommodationTag}>
                                                    {acc.name}
                                                </span>
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
        </>
    );
}