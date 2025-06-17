'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Student } from '@/types';
import styles from './CreateClassModal.module.css';
import { X } from 'lucide-react';
interface CreateClassModalProps { isOpen: boolean; onClose: () => void; onClassCreated: () => void; }
export function CreateClassModal({ isOpen, onClose, onClassCreated }: CreateClassModalProps) {
    const { user } = useAuth();
    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [className, setClassName] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (isOpen) {
            const fetchStudents = async () => {
                setLoading(true);
                const studentsCollectionRef = collection(db, 'students');
                const querySnapshot = await getDocs(studentsCollectionRef);
                const studentsList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Student));
                setAllStudents(studentsList);
                setLoading(false);
            };
            fetchStudents();
        }
    }, [isOpen]);
    const handleStudentSelect = (studentId: string) => {
        setSelectedStudentIds(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
    };
    const handleCreateClass = async () => {
        if (!className.trim() || !user) return;
        try {
            await addDoc(collection(db, 'teacherClasses'), { name: className, teacherId: user.uid, studentIds: selectedStudentIds });
            onClassCreated();
            onClose();
        } catch (error) { console.error("Error creating class: ", error); }
    };
    if (!isOpen) return null;
    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}><h2 className={styles.modalTitle}>Create a New Class</h2><button onClick={onClose} className={styles.closeButton}><X /></button></div>
                <div className={styles.formGroup}><label htmlFor="className">Class Name</label><input type="text" id="className" value={className} onChange={(e) => setClassName(e.target.value)} className={styles.input} placeholder="e.g., Period 3 English" /></div>
                <div className={styles.formGroup}><label>Select Students</label><div className={styles.studentListContainer}>{loading ? <p>Loading students...</p> : allStudents.map(student => (<label key={student.id} className={styles.studentCheckbox}><input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={() => handleStudentSelect(student.id)} />{student.firstName} {student.lastName}</label>))}</div></div>
                <div className={styles.modalActions}><button onClick={onClose} className={`${styles.button} ${styles.cancelButton}`}>Cancel</button><button onClick={handleCreateClass} disabled={!className.trim()} className={`${styles.button} ${styles.createButton}`}>Create Class</button></div>
            </div>
        </div>
    );
}