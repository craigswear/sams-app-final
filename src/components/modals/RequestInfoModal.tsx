'use client';

import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import styles from './RequestInfoModal.module.css';
import { X } from 'lucide-react';

interface RequestInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RequestInfoModal({ isOpen, onClose }: RequestInfoModalProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        schoolName: '',
        role: '',
        enrollment: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        try {
            await addDoc(collection(db, "leads"), {
                ...formData,
                submittedAt: Timestamp.now(),
            });
            
            alert("Thank you for your interest! We will be in touch shortly.");
            onClose();
            setFormData({ fullName: '', email: '', schoolName: '', role: '', enrollment: '' });
        } catch (err) {
            console.error("Error submitting lead:", err);
            setError("There was an error submitting your request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isFormValid = formData.fullName && formData.email && formData.schoolName && formData.role;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Request More Information</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                {/* Corrected Line: 'We're' is now 'We&apos;re' */}
                <p className={styles.modalSubtitle}>We&apos;re excited to show you how SAMS can help your school. Please fill out the form below.</p>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="fullName">Full Name</label>
                            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={styles.input} required />
                        </div>
                    </div>

                    <div className={styles.formGrid}>
                         <div className={styles.formGroup}>
                            <label htmlFor="schoolName">School / District Name</label>
                            <input id="schoolName" name="schoolName" type="text" value={formData.schoolName} onChange={handleChange} className={styles.input} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="role">Your Role / Title</label>
                            <input id="role" name="role" type="text" value={formData.role} onChange={handleChange} className={styles.input} placeholder="e.g., Principal, Teacher" required />
                        </div>
                    </div>
                    <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                        <label htmlFor="enrollment">Approximate Student Enrollment</label>
                        <select id="enrollment" name="enrollment" value={formData.enrollment} onChange={handleChange} className={styles.select}>
                            <option value="">Select a range...</option>
                            <option value="1-500">1 - 500</option>
                            <option value="501-2000">501 - 2,000</option>
                            <option value="2001-5000">2,001 - 5,000</option>
                            <option value="5000+">5,000+</option>
                        </select>
                    </div>
                    
                    {error && <p style={{color: 'red', textAlign: 'center', marginTop: '1rem'}}>{error}</p>}

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                        <button type="submit" disabled={!isFormValid || isSubmitting} className={`${styles.button} ${styles.submitButton}`}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
