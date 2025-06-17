'use client';
import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Accommodation, Student } from '@/types';
import styles from './LogAccommodationModal.module.css';
import { X } from 'lucide-react';
interface LogAccommodationModalProps { isOpen: boolean; onClose: () => void; student: Student; accommodation: Accommodation; }
export function LogAccommodationModal({ isOpen, onClose, student, accommodation }: LogAccommodationModalProps) {
    const { user } = useAuth();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState('');
    const [effectiveness, setEffectiveness] = useState<1 | 2 | 3 | null>(null);
    const handleSubmit = async () => {
        if (!user || !effectiveness) { alert("Please select an effectiveness rating."); return; }
        try {
            await addDoc(collection(db, 'accommodationLogs'), { teacherId: user.uid, studentId: student.id, accommodationId: accommodation.id, date: Timestamp.fromDate(new Date(date)), implementationNotes: notes, effectiveness: effectiveness });
            onClose();
        } catch (error) { console.error("Error creating log: ", error); }
    };
    if (!isOpen) return null;
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Log: {accommodation.name}</h2><button onClick={onClose} className={styles.closeButton}><X /></button></div>
                <div className={styles.formGroup}><label htmlFor="logDate">Date of Implementation</label><input type="date" id="logDate" value={date} onChange={(e) => setDate(e.target.value)} className={styles.input} /></div>
                <div className={styles.formGroup}><label htmlFor="notes">Implementation Notes (Optional)</label><textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className={styles.textarea} placeholder="e.g., Used for the chapter 5 test."></textarea></div>
                <div className={styles.formGroup}><label>Effectiveness</label><div className={styles.ratingContainer}><button onClick={() => setEffectiveness(1)} className={`${styles.ratingButton} ${effectiveness === 1 ? styles.ratingButtonActive : ''}`}>Not Effective</button><button onClick={() => setEffectiveness(2)} className={`${styles.ratingButton} ${effectiveness === 2 ? styles.ratingButtonActive : ''}`}>Somewhat</button><button onClick={() => setEffectiveness(3)} className={`${styles.ratingButton} ${effectiveness === 3 ? styles.ratingButtonActive : ''}`}>Very Effective</button></div></div>
                <div className={styles.modalActions}><button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button><button onClick={handleSubmit} disabled={!effectiveness} className={`${styles.button} ${styles.submitButton}`}>Submit Log</button></div>
            </div>
        </div>
    );
}