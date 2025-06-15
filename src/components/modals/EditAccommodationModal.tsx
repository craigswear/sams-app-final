'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { Accommodation } from '@/types';
import styles from './AddAccommodationModal.module.css'; // We can reuse the same styles
import { X } from 'lucide-react';

interface EditAccommodationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccommodationUpdated: () => void;
    accommodation: Accommodation | null;
}

// Corrected: Changed to a default export
export default function EditAccommodationModal({ isOpen, onClose, onAccommodationUpdated, accommodation }: EditAccommodationModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (accommodation) {
            setName(accommodation.name);
            setDescription(accommodation.description);
        }
    }, [accommodation]);

    const handleSubmit = async () => {
        if (!name.trim() || !description.trim() || !accommodation) return;

        setIsSubmitting(true);
        try {
            const accDocRef = doc(db, 'accommodations', accommodation.id);
            await updateDoc(accDocRef, {
                name,
                description,
            });
            onAccommodationUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating accommodation: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !accommodation) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit Accommodation</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="accName">Accommodation Name</label>
                    <input id="accName" type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="accDesc">Description</label>
                    <textarea id="accDesc" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea}></textarea>
                </div>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                    <button onClick={handleSubmit} disabled={isSubmitting} className={`${styles.button} ${styles.submitButton}`}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
