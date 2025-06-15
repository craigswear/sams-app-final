'use client';
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { UserRole } from '@/types';
import styles from './CreateUserModal.module.css';
import { X } from 'lucide-react';
interface CreateUserModalProps { isOpen: boolean; onClose: () => void; onUserCreated: () => void; }
export function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('teacher');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async () => {
        setError(null); setIsSubmitting(true);
        const newUser = { firstName, lastName, email, password, role };
        try {
            const functions = getFunctions();
            const createUser = httpsCallable(functions, 'createUser');
            await createUser(newUser);
            onUserCreated();
            onClose();
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };
    if (!isOpen) return null;
    const isFormValid = firstName.trim() && lastName.trim() && email.trim() && password.length >= 6;
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Create New User</h2><button onClick={onClose} className={styles.closeButton}><X /></button></div>
                {error && <p style={{color: 'red', marginBottom: '1rem'}}>{error}</p>}
                <div className={styles.formGrid}>
                    <div className={styles.formGroup}><label htmlFor="firstName">First Name</label><input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles.input} /></div>
                    <div className={styles.formGroup}><label htmlFor="lastName">Last Name</label><input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles.input} /></div>
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}><label htmlFor="email">Email Address</label><input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} /></div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}><label htmlFor="password">Password</label><input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} placeholder="Minimum 6 characters" /></div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}><label htmlFor="role">Role</label><select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className={styles.select}><option value="teacher">Teacher</option><option value="admin">Admin</option></select></div>
                <div className={styles.modalActions}><button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button><button onClick={handleSubmit} disabled={!isFormValid || isSubmitting} className={`${styles.button} ${styles.submitButton}`}>{isSubmitting ? 'Creating...' : 'Create User'}</button></div>
            </div>
        </div>
    );
}