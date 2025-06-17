'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { TeacherClass } from '@/types';
import styles from './page.module.css'; // Use the new stylesheet
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { CreateClassModal } from '@/components/modals/CreateClassModal';
import { EditClassModal } from '@/components/modals/EditClassModal';
import Link from 'next/link'; 
import { useRouter } from 'next/navigation';

export default function TeacherDashboardPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);

    const fetchClasses = useCallback(async () => {
        if (!user) return;
        setPageLoading(true);
        try {
            const classesCollectionRef = collection(db, 'teacherClasses');
            const q = query(classesCollectionRef, where("teacherId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedClasses = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as TeacherClass));
            setClasses(fetchedClasses);
        } catch (err) {
            console.error("Error fetching classes:", err);
            setError("Failed to load your classes.");
        } finally {
            setPageLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/');
            } else if (user?.role === 'admin') {
                router.push('/dashboard/admin');
            } else {
                fetchClasses();
            }
        }
    }, [user, authLoading, router, fetchClasses]);

    const handleEdit = (cls: TeacherClass) => {
        setSelectedClass(cls);
        setEditModalOpen(true);
    };

    const handleDelete = async (classId: string) => {
        if (window.confirm("Are you sure you want to delete this class? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "teacherClasses", classId));
                fetchClasses();
            } catch (error) {
                console.error("Error deleting class: ", error);
            }
        }
    };

    if (authLoading || pageLoading) return <div className={styles.loading}>Loading Dashboard...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    // This check ensures we only render the teacher dashboard for teachers
    if (user?.role !== 'teacher') {
        return <div className={styles.loading}>Redirecting...</div>;
    }

    return (
        <>
            <CreateClassModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onClassCreated={fetchClasses} />
            <EditClassModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onClassUpdated={fetchClasses} classData={selectedClass} />
            
            <div>
                <header className={styles.header}>
                    <h1 className={styles.title}>My Classes</h1>
                    <button onClick={() => setAddModalOpen(true)} className={styles.createButton}>
                        <PlusCircle size={20} />
                        Create New Class
                    </button>
                </header>

                {classes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h2>No Classes Found</h2>
                        <p>You haven&apos;t created any classes yet. Get started by creating your first one.</p>
                        <button onClick={() => setAddModalOpen(true)} className={styles.createButton}>Create a Class</button>
                    </div>
                ) : (
                    <div className={styles.classesGrid}>
                        {classes.map((cls) => (
                            <div key={cls.id} className={styles.classCard}>
                                <Link href={`/dashboard/class?id=${cls.id}`} style={{textDecoration: 'none', color: 'inherit', flexGrow: 1}}>
                                    <h2 className={styles.cardTitle}>{cls.name}</h2>
                                    <p className={styles.cardInfo}>{cls.studentIds.length} student(s)</p>
                                </Link>
                                <div className={styles.cardActions}>
                                    <button onClick={() => handleEdit(cls)} className={styles.actionButton}><Edit size={14}/></button>
                                    <button onClick={() => handleDelete(cls.id)} className={`${styles.actionButton} ${styles.deleteButton}`}><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}


