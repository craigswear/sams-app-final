'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import styles from './AddAccommodationModal.module.css';
import { X } from 'lucide-react';

interface AddAccommodationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccommodationAdded: () => void;
}

export function AddAccommodationModal({ isOpen, onClose, onAccommodationAdded }: AddAccommodationModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim() || !description.trim()) return;

        setIsSubmitting(true);
        try {
            // Generate a URL-friendly ID from the name
            const id = name.toLowerCase().replace(/\s+/g, '-');
            
            await addDoc(collection(db, 'accommodations'), {
                id,
                name,
                description,
            });
            onAccommodationAdded();
            onClose();
        } catch (error) {
            console.error("Error adding accommodation: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Add New Accommodation</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="accName">Accommodation Name</label>
                    <input id="accName" type="text" value={name} onChange={(e) => setName(e.target.value)} className={styles.input} placeholder="e.g., Small Group Testing" />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="accDesc">Description</label>
                    <textarea id="accDesc" value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} placeholder="Briefly describe the accommodation."></textarea>
                </div>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                    <button onClick={handleSubmit} disabled={!name.trim() || !description.trim() || isSubmitting} className={`${styles.button} ${styles.submitButton}`}>
                        {isSubmitting ? 'Adding...' : 'Add Accommodation'}
                    </button>
                </div>
            </div>
        </div>
    );
}