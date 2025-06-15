'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { Accommodation } from '@/types';
import styles from './AddStudentModal.module.css';
import { X } from 'lucide-react';

interface AddStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStudentAdded: () => void; // To refresh the student list
}

export function AddStudentModal({ isOpen, onClose, onStudentAdded }: AddStudentModalProps) {
    const [allAccommodations, setAllAccommodations] = useState<Accommodation[]>([]);
    const [selectedAccommodations, setSelectedAccommodations] = useState<Accommodation[]>([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch all available accommodations when the modal is opened
    useEffect(() => {
        if (isOpen) {
            const fetchAccommodations = async () => {
                setLoading(true);
                const accommodationsCollectionRef = collection(db, 'accommodations');
                const querySnapshot = await getDocs(accommodationsCollectionRef);
                const accommodationList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                    id: doc.id, ...doc.data()
                } as Accommodation));
                setAllAccommodations(accommodationList);
                setLoading(false);
            };
            fetchAccommodations();
        }
    }, [isOpen]);

    const handleAccommodationSelect = (accommodation: Accommodation) => {
        setSelectedAccommodations(prev =>
            prev.some(a => a.id === accommodation.id)
                ? prev.filter(a => a.id !== accommodation.id)
                : [...prev, accommodation]
        );
    };

    const handleAddStudent = async () => {
        if (!firstName.trim() || !lastName.trim() || !studentId.trim()) return;

        try {
            await addDoc(collection(db, 'students'), {
                firstName,
                lastName,
                studentId,
                accommodations: selectedAccommodations,
            });
            onStudentAdded(); // Trigger refresh on parent page
            onClose(); // Close the modal
        } catch (error) {
            console.error("Error creating student: ", error);
        }
    };

    if (!isOpen) return null;

    const isFormValid = firstName.trim() && lastName.trim() && studentId.trim();

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Add New Student</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName">First Name</label>
                        <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName">Last Name</label>
                        <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} />
                    </div>
                </div>

                 <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label htmlFor="studentId">Student ID</label>
                    <input id="studentId" type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} className={styles.input} />
                </div>

                <div className={styles.formGroup}>
                    <label>Assign Accommodations</label>
                    <div className={styles.accommodationListContainer}>
                        {loading ? <p>Loading accommodations...</p> : allAccommodations.map(acc => (
                            <label key={acc.id} className={styles.accommodationCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={selectedAccommodations.some(a => a.id === acc.id)}
                                    onChange={() => handleAccommodationSelect(acc)}
                                />
                                {acc.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                    <button onClick={handleAddStudent} disabled={!isFormValid} className={`${styles.button} ${styles.submitButton}`}>
                        Add Student
                    </button>
                </div>
            </div>
        </div>
    );
}
