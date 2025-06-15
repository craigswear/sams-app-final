'use client';

import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { AccommodationLog, Student, UserProfile, Accommodation } from '@/types';
import styles from '@/app/dashboard/admin/reports/page.module.css';
import { Download } from 'lucide-react';

export function ImplementationLogReport() {
    const [logs, setLogs] = useState<AccommodationLog[]>([]);
    const [students, setStudents] = useState<Map<string, Student>>(new Map());
    const [teachers, setTeachers] = useState<Map<string, UserProfile>>(new Map());
    const [accommodations, setAccommodations] = useState<Map<string, Accommodation>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [logsSnap, studentsSnap, usersSnap, accommodationsSnap] = await Promise.all([
                    getDocs(collection(db, 'accommodationLogs')),
                    getDocs(collection(db, 'students')),
                    getDocs(collection(db, 'users')),
                    getDocs(collection(db, 'accommodations')),
                ]);

                const logsList = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AccommodationLog));
                setLogs(logsList);
                setStudents(new Map(studentsSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as Student])));
                setTeachers(new Map(usersSnap.docs.map(doc => [doc.id, { uid: doc.id, ...doc.data() } as UserProfile])));
                setAccommodations(new Map(accommodationsSnap.docs.map(doc => [doc.id, { id: doc.id, ...doc.data() } as Accommodation])));

            } catch (err) {
                console.error("Error fetching report data: ", err);
                setError("Failed to load report data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const filteredLogs = useMemo(() => {
        return logs
            .filter(log => {
                const logDate = log.date.toDate();
                const start = startDate ? new Date(startDate) : null;
                const end = endDate ? new Date(endDate) : null;

                if (start && logDate < start) return false;
                if (end) {
                    end.setHours(23, 59, 59, 999);
                    if (logDate > end) return false;
                }
                return true;
            })
            .sort((a, b) => b.date.toMillis() - a.date.toMillis());
    }, [logs, startDate, endDate]);

    const getEffectivenessText = (level: 1 | 2 | 3) => {
        switch (level) {
            case 1: return { text: 'Not Effective', style: styles.dotLow };
            case 2: return { text: 'Somewhat', style: styles.dotMedium };
            case 3: return { text: 'Very Effective', style: styles.dotHigh };
            default: return { text: 'N/A', style: '' };
        }
    };

    const handleExport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Date,Student,Accommodation,Teacher,Effectiveness,Notes\r\n";
        filteredLogs.forEach(log => {
            const student = students.get(log.studentId);
            const teacher = teachers.get(log.teacherId);
            const accommodation = accommodations.get(log.accommodationId);
            const { text } = getEffectivenessText(log.effectiveness);
            const notes = `"${log.implementationNotes.replace(/"/g, '""')}"`;
            const row = [
                log.date.toDate().toLocaleDateString(),
                student ? `${student.firstName} ${student.lastName}` : 'Unknown',
                accommodation?.name || 'Unknown',
                teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown',
                text,
                notes,
            ].join(",");
            csvContent += row + "\r\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sams_compliance_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className={styles.loading}>Generating compliance reports...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <div>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date" id="startDate" className={styles.dateInput} value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className={styles.filterGroup}>
                    <label htmlFor="endDate">End Date</label>
                    <input type="date" id="endDate" className={styles.dateInput} value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <button className={styles.exportButton} onClick={handleExport}>
                    <Download size={16} />
                    Export CSV
                </button>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Student</th>
                            <th>Accommodation</th>
                            <th>Teacher</th>
                            <th>Effectiveness</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map((log) => {
                            const student = students.get(log.studentId);
                            const teacher = teachers.get(log.teacherId);
                            const accommodation = accommodations.get(log.accommodationId);
                            const { text, style } = getEffectivenessText(log.effectiveness);
                            return (
                                <tr key={log.id}>
                                    <td>{log.date.toDate().toLocaleDateString()}</td>
                                    <td>{student ? `${student.firstName} ${student.lastName}` : 'Unknown'}</td>
                                    <td>{accommodation?.name || 'Unknown'}</td>
                                    <td>{teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown'}</td>
                                    <td className={styles.effectivenessCell}>
                                        <span className={`${styles.effectivenessDot} ${style}`}></span>
                                        {text}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
