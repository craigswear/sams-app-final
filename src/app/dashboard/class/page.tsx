'use client';

import { useState } from 'react';
import styles from './page.module.css';

// --- Type Definitions ---
type Student = {
  id: string;
  name: string;
  accommodations: string[];
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgmentDate?: string;
};

type LogEntry = {
  id: number;
  date: string;
  studentName: string;
  logDetails: string;
  loggedBy: string;
};

// --- Initial Data ---
const initialStudents: Student[] = [
  { id: '333444', name: 'Jane Smith', accommodations: ['Read Aloud'], isAcknowledged: false },
  { id: '777888', name: 'Mary Williams', accommodations: ['Preferential Seating'], isAcknowledged: false },
  { id: '555666', name: 'Peter Jones', accommodations: ['Extended Time', 'Frequent Breaks', 'Use of Visual Aids'], isAcknowledged: false },
];

const initialLogEntries: LogEntry[] = [
    { id: 1, date: '2025-06-16', studentName: 'Peter Jones', logDetails: 'Extended Time (Quiz 3)', loggedBy: 'Mr. Harrison' },
    { id: 2, date: '2025-06-15', studentName: 'Jane Smith', logDetails: 'Read Aloud (Chapter 5 Reading)', loggedBy: 'Mr. Harrison' },
];

export default function ClassPage() {
  // --- State Management ---
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(initialLogEntries);
  
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
  const [isLogUsageModalOpen, setIsLogUsageModalOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);

  const [acknowledgmentName, setAcknowledgmentName] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logSignerName, setLogSignerName] = useState('');

  // --- Handlers for Acknowledgment Workflow ---
  const handleOpenAcknowledgeModal = (student: Student) => {
    setSelectedStudent(student);
    setIsAcknowledgeModalOpen(true);
  };

  const handleConfirmAcknowledgment = () => {
    const updatedStudents = students.map(s => 
      s.id === selectedStudent?.id 
      ? { ...s, isAcknowledged: true, acknowledgedBy: acknowledgmentName, acknowledgmentDate: new Date().toLocaleDateString() } 
      : s
    );
    setStudents(updatedStudents);
    setIsAcknowledgeModalOpen(false);
    setAcknowledgmentName('');
  };

  // --- Handlers for Log Usage Workflow ---
  const handleOpenLogUsageModal = (student: Student) => {
    setSelectedStudent(student);
    setEditingLog(null);
    setLogNotes('');
    setLogSignerName('');
    setIsLogUsageModalOpen(true);
  };
  
  const handleOpenEditLogModal = (log: LogEntry) => {
    setEditingLog(log);
    const studentForLog = students.find(s => s.name === log.studentName) || null;
    setSelectedStudent(studentForLog);
    const match = log.logDetails.match(/\((.*?)\)/);
    setLogNotes(match ? match[1] : '');
    setLogSignerName(log.loggedBy);
    setIsLogUsageModalOpen(true);
  };

  const handleConfirmLog = () => {
    if (!logSignerName.trim()) {
      alert('Please sign your name to log this entry.');
      return;
    }

    if (editingLog) {
      const updatedLogs = logEntries.map(log => 
        log.id === editingLog.id 
        ? { 
            ...log, 
            logDetails: `${editingLog.logDetails.split(' (')[0]} ${logNotes ? `(${logNotes})` : ''}`,
            loggedBy: logSignerName 
          } 
        : log
      );
      setLogEntries(updatedLogs);
    } else {
      const newLogEntry: LogEntry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        studentName: selectedStudent!.name,
        logDetails: `${selectedStudent!.accommodations.join(', ')} ${logNotes ? `(${logNotes})` : ''}`,
        loggedBy: logSignerName,
      };
      setLogEntries([newLogEntry, ...logEntries]);
    }
    setIsLogUsageModalOpen(false);
  };

  const handleDeleteLog = (logId: number) => {
    if (window.confirm('Are you sure you want to delete this log entry?')) {
      setLogEntries(logEntries.filter(log => log.id !== logId));
    }
  };

  return (
    <>
      <main className={styles.mainContent}>
        <a href="/dashboard" className={styles.backLink}>&larr; Back to My Classes</a>
        <div className={styles.pageHeader}><h1>Class: Algebra I</h1></div>

        <div className={styles.tableContainer}>
            <h2>Student Roster</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Accommodations</th>
                        <th>Acknowledgment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.accommodations.join(', ')}</td>
                        <td>
                          {student.isAcknowledged ? (
                            <div className={styles.acknowledgedText}>✓ {student.acknowledgedBy}</div>
                          ) : (
                            <button className={styles.actionButton} onClick={() => handleOpenAcknowledgeModal(student)}>Acknowledge</button>
                          )}
                        </td>
                        <td>
                          <button className={styles.actionButton} onClick={() => handleOpenLogUsageModal(student)}>Log Usage</button>
                        </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>

        <div className={styles.tableContainer}>
            <h2>Recent Accommodation Log Entries</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Accommodation Logged</th>
                        <th>Logged By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {logEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td>{entry.studentName}</td>
                      <td>{entry.logDetails}</td>
                      <td>{entry.loggedBy}</td>
                      <td className={styles.logActions}>
                        <button onClick={() => handleOpenEditLogModal(entry)} className={styles.editButton}>Edit</button>
                        <button onClick={() => handleDeleteLog(entry.id)} className={styles.deleteButton}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>
      </main>

      {/* --- MODALS --- */}
      {isAcknowledgeModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Acknowledge Accommodations</h3>
              <button onClick={() => setIsAcknowledgeModalOpen(false)} className={styles.closeButton}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.acknowledgmentStatement}>
                By entering your name below, you acknowledge that you have received and reviewed the accommodations for:
              </p>
              <p><strong>Student:</strong> {selectedStudent?.name}</p>
              <p><strong>Accommodations:</strong> {selectedStudent?.accommodations.join(', ')}</p>
              <div className={styles.formGroup}>
                <label htmlFor="acknowledgmentName">Type Your Full Name to Sign</label>
                <input 
                  type="text" 
                  id="acknowledgmentName"
                  className={styles.formInput}
                  value={acknowledgmentName}
                  onChange={(e) => setAcknowledgmentName(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setIsAcknowledgeModalOpen(false)} className={styles.cancelButton}>Cancel</button>
              <button onClick={handleConfirmAcknowledgment} className={styles.confirmButton} disabled={!acknowledgmentName.trim()}>
                Submit Acknowledgment
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isLogUsageModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingLog ? 'Edit' : 'Log'} Accommodation Usage</h3>
              <button onClick={() => setIsLogUsageModalOpen(false)} className={styles.closeButton}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <p><strong>Student:</strong> {selectedStudent?.name}</p>
              <p><strong>Accommodations:</strong> {editingLog ? editingLog.logDetails.split(' (')[0] : selectedStudent?.accommodations.join(', ')}</p>
              <div className={styles.formGroup}>
                {/* THIS IS THE CORRECTED LINE */}
                <label htmlFor="logNotes">Notes (e.g., &quot;on Quiz 4&quot;)</label>
                <input type="text" id="logNotes" className={styles.formInput} value={logNotes} onChange={(e) => setLogNotes(e.target.value)}/>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="logSignerName">Type Your Name to Sign</label>
                <input type="text" id="logSignerName" className={styles.formInput} value={logSignerName} onChange={(e) => setLogSignerName(e.target.value)}/>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setIsLogUsageModalOpen(false)} className={styles.cancelButton}>Cancel</button>
              <button onClick={handleConfirmLog} className={styles.confirmButton} disabled={!logSignerName.trim()}>
                {editingLog ? 'Save Changes' : 'Confirm Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}