'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { PenSquare } from 'lucide-react'; // Import the icon

// --- UPDATED TYPE DEFINITIONS ---
// Student type remains the same for now
type Student = {
  id: string;
  name: string;
  accommodations: string[];
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgmentDate?: string;
};

// LogEntry type is updated to store more structured data
type LogEntry = {
  id: number;
  date: string;
  studentName: string;
  accommodationName: string;
  provisionMethod: string;
  effectiveness: 1 | 2 | 3;
  notes: string;
  loggedBy: string; // This will be the teacher's name/ID from auth in a real app
};

// --- INITIAL DATA (with updated LogEntry structure) ---
const initialStudents: Student[] = [
  { id: '333444', name: 'Jane Smith', accommodations: ['Read Aloud'], isAcknowledged: false },
  { id: '777888', name: 'Mary Williams', accommodations: ['Preferential Seating'], isAcknowledged: false },
  { id: '555666', name: 'Peter Jones', accommodations: ['Extended Time', 'Frequent Breaks', 'Use of Visual Aids'], isAcknowledged: false },
];

const initialLogEntries: LogEntry[] = [
    { 
        id: 1, 
        date: '2025-06-16', 
        studentName: 'Peter Jones', 
        accommodationName: 'Extended Time',
        provisionMethod: 'One-on-one Support',
        effectiveness: 3,
        notes: 'Used on Quiz 3, student seemed less rushed.',
        loggedBy: 'Mr. Harrison' 
    },
    { 
        id: 2, 
        date: '2025-06-15', 
        studentName: 'Jane Smith', 
        accommodationName: 'Read Aloud',
        provisionMethod: 'Verbal Reminder',
        effectiveness: 2,
        notes: 'For Chapter 5 Reading assignment.',
        loggedBy: 'Mr. Harrison' 
    },
];

const PROVISION_METHODS = [
    "Verbal Reminder",
    "Small Group Instruction",
    "One-on-one Support",
    "Use of Visual Aids",
    "Extended Time",
    "Other"
];

export default function ClassPage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [logEntries, setLogEntries] = useState<LogEntry[]>(initialLogEntries);
  
  // --- STATE MANAGEMENT ---
  const [isAcknowledgeModalOpen, setIsAcknowledgeModalOpen] = useState(false);
  const [isLogUsageModalOpen, setIsLogUsageModalOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<LogEntry | null>(null);
  const [acknowledgmentName, setAcknowledgmentName] = useState('');

  // New state variables for the redesigned log modal
  const [provisionDate, setProvisionDate] = useState('');
  const [effectiveness, setEffectiveness] = useState<0 | 1 | 2 | 3>(0);
  const [provisionMethod, setProvisionMethod] = useState(PROVISION_METHODS[0]);
  const [otherMethodText, setOtherMethodText] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Effect to set the current date when the modal opens
  useEffect(() => {
    if (isLogUsageModalOpen && !editingLog) {
      // Set today's date in 'YYYY-MM-DD' format
      setProvisionDate(new Date().toISOString().split('T')[0]);
    }
  }, [isLogUsageModalOpen, editingLog]);


  // --- MODAL HANDLERS ---
  const handleOpenAcknowledgeModal = (student: Student) => {
    setSelectedStudent(student);
    setIsAcknowledgeModalOpen(true);
  };

  const handleConfirmAcknowledgment = () => {
    if (!selectedStudent || !acknowledgmentName.trim()) return;
    const updatedStudents = students.map(s => 
      s.id === selectedStudent.id 
      ? { ...s, isAcknowledged: true, acknowledgedBy: acknowledgmentName, acknowledgmentDate: new Date().toLocaleDateString() } 
      : s
    );
    setStudents(updatedStudents);
    setIsAcknowledgeModalOpen(false);
    setAcknowledgmentName('');
  };

  const resetLogForm = () => {
    setProvisionDate('');
    setEffectiveness(0);
    setProvisionMethod(PROVISION_METHODS[0]);
    setOtherMethodText('');
    setLogNotes('');
    setFormError('');
  };

  // Updated to accept both student and the specific accommodation
  const handleOpenLogUsageModal = (student: Student, accommodation: string) => {
    resetLogForm();
    setSelectedStudent(student);
    setSelectedAccommodation(accommodation);
    setEditingLog(null);
    setIsLogUsageModalOpen(true);
  };
  
  const handleOpenEditLogModal = (log: LogEntry) => {
    const studentForLog = students.find(s => s.name === log.studentName) || null;
    if (!studentForLog) return; // Should not happen in a real app

    setSelectedStudent(studentForLog);
    setSelectedAccommodation(log.accommodationName);
    setEditingLog(log);
    
    // Populate form with existing log data
    setProvisionDate(log.date);
    setEffectiveness(log.effectiveness);
    if (PROVISION_METHODS.includes(log.provisionMethod)) {
        setProvisionMethod(log.provisionMethod);
        setOtherMethodText('');
    } else {
        setProvisionMethod('Other');
        setOtherMethodText(log.provisionMethod);
    }
    setLogNotes(log.notes);
    setFormError('');
    setIsLogUsageModalOpen(true);
  };

  const handleConfirmLog = () => {
    // Validation
    if (effectiveness === 0) {
        setFormError('Effectiveness rating is required.');
        return;
    }
    const finalProvisionMethod = provisionMethod === 'Other' ? otherMethodText : provisionMethod;
    if (!finalProvisionMethod.trim()) {
        setFormError('Method of provision is required.');
        return;
    }

    const currentTeacherName = "Mr. Harrison"; // Hardcoded for now, get from auth state later

    if (editingLog) {
      // Logic for updating an existing log
      const updatedLogs = logEntries.map(log => 
        log.id === editingLog.id 
        ? { 
            ...log,
            date: provisionDate,
            provisionMethod: finalProvisionMethod,
            effectiveness: effectiveness,
            notes: logNotes.trim(),
            loggedBy: currentTeacherName,
          } 
        : log
      );
      setLogEntries(updatedLogs);
    } else {
      // Logic for adding a new log
      if (!selectedStudent || !selectedAccommodation) return;
      
      const newLogEntry: LogEntry = {
        id: Date.now(),
        date: provisionDate,
        studentName: selectedStudent.name,
        accommodationName: selectedAccommodation,
        provisionMethod: finalProvisionMethod,
        effectiveness: effectiveness,
        notes: logNotes.trim(),
        loggedBy: currentTeacherName,
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
        <div className={styles.pageHeader}>
            <h1>Class: Algebra I</h1>
        </div>

        {/* --- STUDENT ROSTER TABLE (MODIFIED) --- */}
        <div className={styles.tableContainer}>
            <h2>Student Roster</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Accommodations</th>
                        <th>Acknowledgment Status</th>
                    </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>
                            <ul className={styles.accommodationList}>
                                {student.accommodations.map(acc => (
                                    <li key={acc} className={styles.accommodationItem}>
                                        <span>{acc}</span>
                                        {/* MODIFIED: Using an icon button now */}
                                        <button 
                                            className={styles.iconButton} 
                                            onClick={() => handleOpenLogUsageModal(student, acc)}
                                            disabled={!student.isAcknowledged}
                                            title={student.isAcknowledged ? `Log usage for ${acc}` : 'Acknowledge student plan to log usage'}
                                        >
                                            <PenSquare size={18} />
                                        </button>
                                    </li>
                                ))}
                                {student.accommodations.length === 0 && <li>No accommodations on file.</li>}
                            </ul>
                        </td>
                        <td>
                          {student.isAcknowledged ? (
                            <div className={styles.acknowledgedText}>✓ {student.acknowledgedBy}</div>
                          ) : (
                            <button className={styles.actionButton} onClick={() => handleOpenAcknowledgeModal(student)}>Acknowledge</button>
                          )}
                        </td>
                    </tr>
                  ))}
                </tbody>
            </table>
        </div>

        {/* --- LOG ENTRIES TABLE (MODIFIED) --- */}
        <div className={styles.tableContainer}>
            <h2>Recent Accommodation Log Entries</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Student</th>
                        <th>Accommodation</th>
                        <th>Method</th>
                        <th>Effectiveness</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {logEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.date}</td>
                      <td>{entry.studentName}</td>
                      <td>{entry.accommodationName}</td>
                      <td>{entry.provisionMethod}</td>
                      <td>
                        <span className={`${styles.effectivenessBadge} ${styles[`effectiveness-${entry.effectiveness}`]}`}>
                            {entry.effectiveness === 1 ? 'Low' : entry.effectiveness === 2 ? 'Mid' : 'High'}
                        </span>
                      </td>
                      <td className={styles.notesCell}>{entry.notes || '-'}</td>
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

      {/* --- Acknowledgment Modal (Unchanged) --- */}
      {isAcknowledgeModalOpen && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h3>Acknowledge Accommodations</h3>
                    <button onClick={() => setIsAcknowledgeModalOpen(false)} className={styles.closeButton}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <p><strong>Student:</strong> {selectedStudent?.name}</p>
                    <p><strong>Accommodations:</strong> {selectedStudent?.accommodations.join(', ')}</p>
                    <div className={styles.formGroup}>
                        <label htmlFor="acknowledgmentName">Type Your Full Name to Sign</label>
                        <input type="text" id="acknowledgmentName" className={styles.formInput} value={acknowledgmentName} onChange={(e) => setAcknowledgmentName(e.target.value)} />
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button onClick={() => setIsAcknowledgeModalOpen(false)} className={styles.cancelButton}>Cancel</button>
                    <button onClick={handleConfirmAcknowledgment} className={styles.confirmButton} disabled={!acknowledgmentName.trim()}>Submit Acknowledgment</button>
                </div>
            </div>
        </div>
      )}
      
      {/* --- REDESIGNED LOG USAGE MODAL --- */}
      {isLogUsageModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editingLog ? 'Edit' : 'Log'} Accommodation Usage</h3>
              <button onClick={() => setIsLogUsageModalOpen(false)} className={styles.closeButton}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.logModalInfo}>
                <p><strong>Student:</strong> {selectedStudent?.name}</p>
                <p><strong>Accommodation:</strong> {selectedAccommodation}</p>
              </div>

              <div className={styles.logModalGrid}>
                <div className={styles.formGroup}>
                    <label htmlFor="provisionDate">Date of Provision</label>
                    <input type="date" id="provisionDate" className={styles.formInput} value={provisionDate} onChange={(e) => setProvisionDate(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="effectiveness">Effectiveness Rating</label>
                    <select id="effectiveness" className={styles.formInput} value={effectiveness} onChange={(e) => setEffectiveness(Number(e.target.value) as 0 | 1 | 2 | 3)}>
                        <option value={0} disabled>Select...</option>
                        <option value={1}>1 - Not Effective</option>
                        <option value={2}>2 - Somewhat Effective</option>
                        <option value={3}>3 - Very Effective</option>
                    </select>
                </div>
                <div className={`${styles.formGroup} ${styles.gridSpan2}`}>
                    <label htmlFor="provisionMethod">Method of Provision</label>
                    <select id="provisionMethod" className={styles.formInput} value={provisionMethod} onChange={(e) => setProvisionMethod(e.target.value)}>
                        {PROVISION_METHODS.map(method => <option key={method} value={method}>{method}</option>)}
                    </select>
                </div>
                {provisionMethod === 'Other' && (
                    <div className={`${styles.formGroup} ${styles.gridSpan2}`}>
                        <label htmlFor="otherMethodText">Specify Other Method</label>
                        <input type="text" id="otherMethodText" className={styles.formInput} value={otherMethodText} onChange={(e) => setOtherMethodText(e.target.value)} placeholder="Describe the method used" />
                    </div>
                )}
                <div className={`${styles.formGroup} ${styles.gridSpan2}`}>
                    <label htmlFor="logNotes">Notes (Optional)</label>
                    <textarea id="logNotes" rows={3} className={styles.formInput} value={logNotes} onChange={(e) => setLogNotes(e.target.value)} placeholder="e.g., Student completed quiz with less anxiety."></textarea>
                </div>
              </div>
              {formError && <p className={styles.formError}>{formError}</p>}
            </div>
            <div className={styles.modalFooter}>
              <button onClick={() => setIsLogUsageModalOpen(false)} className={styles.cancelButton}>Cancel</button>
              <button onClick={handleConfirmLog} className={styles.confirmButton}>
                {editingLog ? 'Save Changes' : 'Confirm Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
