'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Student, Accommodation } from '@/types';
import styles from './page.module.css';
import Link from 'next/link';
import { LogAccommodationModal } from '@/components/modals/LogAccommodationModal';

function StudentDetailContent() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const studentId = searchParams.get('id');
    const classId = searchParams.get('classId');
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAcknowledged, setIsAcknowledged] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

    useEffect(() => {
        if (user && studentId) {
            const fetchStudentDetails = async () => {
                setLoading(true);
                try {
                    const studentDocRef = doc(db, 'students', studentId);
                    const studentDocSnap = await getDoc(studentDocRef);
                    if (!studentDocSnap.exists()) { setError("Student not found."); return; }
                    setStudent({ id: studentDocSnap.id, ...studentDocSnap.data() } as Student);
                    const ackDocRef = doc(db, 'acknowledgements', `${user.uid}_${studentId}`);
                    const ackDocSnap = await getDoc(ackDocRef);
                    if (ackDocSnap.exists()) { setIsAcknowledged(true); }
                } catch (err) {
                    console.error("Failed to load student details:", err);
                    setError("Failed to load student details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchStudentDetails();
        }
    }, [user, studentId]);

    const handleAcknowledge = async () => {
        if (!user || !student) return;
        try {
            const ackDocRef = doc(db, 'acknowledgements', `${user.uid}_${student.id}`);
            await setDoc(ackDocRef, { teacherId: user.uid, studentId: student.id, acknowledgedAt: Timestamp.now() });
            setIsAcknowledged(true);
        } catch (error) { console.error("Error saving acknowledgement: ", error); }
    };

    const openLogModal = (accommodation: Accommodation) => {
        setSelectedAccommodation(accommodation);
        setIsLogModalOpen(true);
    };

    if (loading) return <div className={styles.loading}>Loading Student Details...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    if (!student) return <div className={styles.error}>Student not found.</div>;

    return (
        <>
            {selectedAccommodation && (<LogAccommodationModal isOpen={isLogModalOpen} onClose={() => setIsLogModalOpen(false)} student={student} accommodation={selectedAccommodation} />)}
            <div>
                <header className={styles.pageHeader}>
                    <p className={styles.breadcrumb}>
                        <Link href="/dashboard/classes">My Classes</Link> / <Link href={`/dashboard/class?id=${classId}`}> Roster</Link> / {student.firstName} {student.lastName}
                    </p>
                    <h1 className={styles.title}>{student.firstName} {student.lastName}</h1>
                </header>
                <div className={styles.container}>
                    <div className={styles.accommodationList}>
                        <h2>Accommodations on File</h2>
                        {student.accommodations.length > 0 ? (
                            student.accommodations.map(acc => (
                                <div key={acc.id} className={styles.accommodationItem}>
                                    <div className={styles.accommodationHeader}>
                                        <p className={styles.accommodationName}>{acc.name}</p>
                                        <button onClick={() => openLogModal(acc)} className={styles.logButton}>Log</button>
                                    </div>
                                    <p className={styles.accommodationDesc}>{acc.description}</p>
                                </div>
                            ))
                        ) : (<p>No accommodations listed for this student.</p>)}
                    </div>
                    <div className={styles.acknowledgementBox}>
                        <h2>Digital Acknowledgement</h2>
                        <p className={styles.agreementText}>By clicking the button below, I acknowledge that I have received, read, and understand the listed accommodations for this student. I agree to implement them with fidelity as required.</p>
                        <button onClick={handleAcknowledge} disabled={isAcknowledged} className={styles.acknowledgeButton}>{isAcknowledged ? 'Acknowledged' : 'Acknowledge Accommodations'}</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function StudentDetailPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading...</div>}>
            <StudentDetailContent />
        </Suspense>
    );
}