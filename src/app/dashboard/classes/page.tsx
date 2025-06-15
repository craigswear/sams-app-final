'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, query, where, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { TeacherClass } from '@/types';
import styles from './page.module.css';
import { PlusCircle } from 'lucide-react';
import { CreateClassModal } from '@/components/modals/CreateClassModal';
import Link from 'next/link'; 
export default function MyClassesPage() {
    const { user } = useAuth();
    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchClasses = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const classesCollectionRef = collection(db, 'teacherClasses');
            const q = query(classesCollectionRef, where("teacherId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const fetchedClasses = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as TeacherClass));
            setClasses(fetchedClasses);
        } catch (err) { setError("Failed to load your classes."); } finally { setLoading(false); }
    }, [user]);
    useEffect(() => { fetchClasses(); }, [fetchClasses]);
    if (loading) return <div className={styles.loading}>Loading your classes...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    return (
        <>
            <CreateClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onClassCreated={fetchClasses} />
            <div>
                <header className={styles.header}><h1 className={styles.title}>My Classes</h1><button onClick={() => setIsModalOpen(true)} className={styles.createButton}><PlusCircle size={20} />Create New Class</button></header>
                {classes.length === 0 ? (
                    <div className={styles.emptyState}><h2>No Classes Found</h2><p>You haven&apos;t created any classes yet. Get started by creating your first one.</p><button onClick={() => setIsModalOpen(true)} className={styles.createButton}>Create a Class</button></div>
                ) : (
                    <div className={styles.classesGrid}>
                        {classes.map((cls) => (
                            <Link href={`/dashboard/class?id=${cls.id}`} key={cls.id} style={{textDecoration: 'none'}}>
                                <div className={styles.classCard}><h2 className={styles.cardTitle}>{cls.name}</h2><p className={styles.cardInfo}>{cls.studentIds.length} student(s)</p></div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}