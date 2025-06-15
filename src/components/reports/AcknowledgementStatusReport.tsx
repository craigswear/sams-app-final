'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { Student, UserProfile, TeacherClass } from '@/types';
import styles from '@/app/dashboard/admin/reports/page.module.css'; // Reuse styles

export function AcknowledgementStatusReport() {
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const generateReport = async () => {
            setLoading(true);
            const [classesSnap, studentsSnap, usersSnap, acksSnap] = await Promise.all([
                getDocs(collection(db, 'teacherClasses')),
                getDocs(collection(db, 'students')),
                getDocs(collection(db, 'users')),
                getDocs(collection(db, 'acknowledgements')),
            ]);

            const studentsMap = new Map(studentsSnap.docs.map(doc => [doc.id, doc.data() as Omit<Student, 'id'>]));
            const teachersMap = new Map(usersSnap.docs.map(doc => [doc.id, doc.data() as UserProfile]));
            const acksSet = new Set(acksSnap.docs.map(doc => doc.id)); // Use a Set for fast lookups

            const data: any[] = [];
            classesSnap.docs.forEach(classDoc => {
                const classData = classDoc.data() as TeacherClass;
                const teacher = teachersMap.get(classData.teacherId);
                
                classData.studentIds.forEach(studentId => {
                    const student = studentsMap.get(studentId);
                    const acknowledgementId = `${teacher?.uid}_${studentId}`;
                    const isAcknowledged = acksSet.has(acknowledgementId);

                    if (teacher && student) {
                        data.push({
                            id: `${classDoc.id}-${studentId}`,
                            teacherName: `${teacher.firstName} ${teacher.lastName}`,
                            className: classData.name,
                            studentName: `${student.firstName} ${student.lastName}`,
                            status: isAcknowledged ? 'Acknowledged' : 'Pending',
                        });
                    }
                });
            });
            
            setReportData(data);
            setLoading(false);
        };
        generateReport();
    }, []);

    if (loading) return <div className={styles.loading}>Generating acknowledgement report...</div>;

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Teacher</th>
                        <th>Class</th>
                        <th>Student</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map(row => (
                        <tr key={row.id}>
                            <td>{row.teacherName}</td>
                            <td>{row.className}</td>
                            <td>{row.studentName}</td>
                            <td>
                                <span style={{
                                    color: row.status === 'Acknowledged' ? '#22c55e' : '#f59e0b',
                                    fontWeight: 600
                                }}>
                                    {row.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
