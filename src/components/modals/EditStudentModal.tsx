'use client';

import { useEffect, useState } from 'react';
// Corrected: Removed unused 'QueryDocumentSnapshot' and 'DocumentData'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { Accommodation, Student } from '@/types';
import styles from './AddStudentModal.module.css'; // Reuse styles
import { X } from 'lucide-react';

interface EditStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStudentUpdated: () => void;
    student: Student | null;
}

export function EditStudentModal({ isOpen, onClose, onStudentUpdated, student }: EditStudentModalProps) {
    const [allAccommodations, setAllAccommodations] = useState<Accommodation[]>([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState<Accommodation[]>([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Pre-fill form with existing student data
            if (student) {
                setFirstName(student.firstName);
                setLastName(student.lastName);
                setStudentId(student.studentId);
                setSelectedAccommodations(student.accommodations || []);
            }

            const fetchAccommodations = async () => {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'accommodations'));
                const accommodationList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Accommodation));
                setAllAccommodations(accommodationList);
                setLoading(false);
            };
            fetchAccommodations();
        }
    }, [isOpen, student]);

    const handleAccommodationSelect = (accommodation: Accommodation) => {
        setSelectedAccommodations(prev =>
            prev.some(a => a.id === accommodation.id)
                ? prev.filter(a => a.id !== accommodation.id)
                : [...prev, accommodation]
        );
    };

    const handleUpdateStudent = async () => {
        if (!firstName.trim() || !lastName.trim() || !studentId.trim() || !student) return;

        try {
            const studentDocRef = doc(db, 'students', student.id);
            await updateDoc(studentDocRef, {
                firstName,
                lastName,
                studentId,
                accommodations: selectedAccommodations,
            });
            onStudentUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating student: ", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit Student</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label htmlFor="editFirstName">First Name</label><input id="editFirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} /></div>
                    <div className={styles.formGroup}><label htmlFor="editLastName">Last Name</label><input id="editLastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} /></div>
                </div>
                 <div className={`${styles.formGroup} ${styles.formGroupFull}`}><label htmlFor="editStudentId">Student ID</label><input id="editStudentId" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className={styles.input} /></div>
                <div className={styles.formGroup}><label>Assigned Accommodations</label><div className={styles.accommodationListContainer}>{loading ? <p>Loading accommodations...</p> : allAccommodations.map(acc => (<label key={acc.id} className={styles.studentCheckbox}><input type="checkbox" checked={selectedAccommodations.some(a => a.id === acc.id)} onChange={() => handleAccommodationSelect(acc)} />{acc.name}</label>))}</div></div>
                <div className={styles.modalActions}><button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button><button onClick={handleUpdateStudent} className={`${styles.button} ${styles.submitButton}`}>Save Changes</button></div>
            </div>
        </div>
    );
}