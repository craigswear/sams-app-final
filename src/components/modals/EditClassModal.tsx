'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { Student, TeacherClass } from '@/types';
import styles from './CreateClassModal.module.css';
import { X } from 'lucide-react';

interface EditClassModalProps {
    isOpen: boolean;
    onClose: () => void;
    onClassUpdated: () => void;
    classData: TeacherClass | null;
}

export function EditClassModal({ isOpen, onClose, onClassUpdated, classData }: EditClassModalProps) {
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && classData) {
            setClassName(classData.name);
            setSelectedStudentIds(classData.studentIds);
            const fetchStudents = async () => {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'students'));
                const studentsList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Student));
                setAllStudents(studentsList);
                setLoading(false);
            };
            fetchStudents();
        }
    }, [isOpen, classData]);

    const handleStudentSelect = (studentId: string) => {
        setSelectedStudentIds(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
    };

    const handleUpdateClass = async () => {
        if (!className.trim() || !classData) return;
        try {
            const classDocRef = doc(db, 'teacherClasses', classData.id);
            await updateDoc(classDocRef, {
                name: className,
                studentIds: selectedStudentIds,
            });
            onClassUpdated();
            onClose();
        } catch (error) {
            console.error("Error updating class: ", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Edit Class</h2>
                    <button onClick={onClose} className={styles.closeButton}><X /></button>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="className">Class Name</label>
                    <input type="text" id="className" value={className} onChange={(e) => setClassName(e.target.value)} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                    <label>Select Students</label>
                    <div className={styles.studentListContainer}>
                        {loading ? <p>Loading students...</p> : allStudents.map(student => (
                            <label key={student.id} className={styles.studentCheckbox}>
                                <input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => handleStudentSelect(student.id)} />
                                {student.firstName} {student.lastName}
                            </label>
                        ))}
                    </div>
                </div>
                <div className={styles.modalActions}>
                    <button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button>
                    <button onClick={handleUpdateClass} className={`${styles.button} ${styles.submitButton}`}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}

