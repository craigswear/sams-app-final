'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { UserProfile, UserRole } from '@/types';
import styles from './CreateUserModal.module.css'; // We can reuse the same styles
import { X } from 'lucide-react';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated: () => void;
    user: UserProfile | null;
}

// Corrected: Changed to a default export
export default function EditUserModal({ isOpen, onClose, onUserUpdated, user }: EditUserModalProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState<UserRole>('teacher');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setRole(user.role);
        }
    }, [user]);

    const handleUpdate = async () => {
        if (!firstName.trim() || !lastName.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, {
                firstName,
                lastName,
                role,
            });
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating user: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit User: {user.email}</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                        <label htmlFor="editFirstName">First Name</label>
                        <input id="editFirstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="editLastName">Last Name</label>
                        <input id="editLastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} />
                    </div>
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                    <label htmlFor="editRole">Role</label>
                    <select id="editRole" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={styles.select}>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className={styles.modalActions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                    <button onClick={handleUpdate} disabled={isSubmitting} className={`${styles.button} ${styles.submitButton}`}>
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}

