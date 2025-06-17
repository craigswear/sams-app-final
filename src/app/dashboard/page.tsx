'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Edit, Trash2, PlusCircle, X } from 'lucide-react';

// Define types for our data
type Student = {
  id: string;
  name: string;
};

type Class = {
  id: string;
  name: string;
  students: Student[];
};

// Updated initial data to include student lists
const initialClasses: Class[] = [
  { 
    id: 'algebra-1', 
    name: 'test class 3', 
    students: [
      { id: 's1', name: 'John Doe' },
      { id: 's2', name: 'Jane Smith' },
      { id: 's3', name: 'Peter Jones' },
      { id: 's4', name: 'Mary Williams' },
    ]
  },
  { 
    id: 'geometry-1', 
    name: 'test class 2', 
    students: [
      { id: 's5', name: 'David Lee' },
      { id: 's6', name: 'Susan Chen' },
      { id: 's7', name: 'Michael Brown' },
    ]
  },
];

export default function TeacherDashboardPage() {
  // --- STATE MANAGEMENT ---
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  // This state will hold the class being edited, including its student list
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [className, setClassName] = useState('');
  const [newStudentName, setNewStudentName] = useState('');

  // --- MODAL & CLASS HANDLERS ---
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setClassName('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cls: Class) => {
    setModalMode('edit');
    setEditingClass({ ...cls }); // Use a copy to allow temporary changes
    setClassName(cls.name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleDeleteClass = (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(prev => prev.filter(cls => cls.id !== classId));
    }
  };

  // --- STUDENT MANAGEMENT HANDLERS (for inside the modal) ---
  const handleAddStudent = () => {
    if (!newStudentName.trim() || !editingClass) return;
    
    const newStudent: Student = {
      id: `new-student-${Date.now()}`,
      name: newStudentName.trim(),
    };
    
    // Update the temporary 'editingClass' state
    setEditingClass({
      ...editingClass,
      students: [...editingClass.students, newStudent],
    });
    
    setNewStudentName(''); // Clear the input
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!editingClass) return;

    // Update the temporary 'editingClass' state
    setEditingClass({
      ...editingClass,
      students: editingClass.students.filter(s => s.id !== studentId),
    });
  };

  // --- FORM SUBMISSION ---
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;

    if (modalMode === 'create') {
      const newClass: Class = {
        id: `new-class-${Date.now()}`,
        name: className,
        students: [], // Starts with no students
      };
      setClasses(prev => [...prev, newClass]);
    } else if (modalMode === 'edit' && editingClass) {
      // Save the final state of the 'editingClass' object
      setClasses(prev =>
        prev.map(cls => (cls.id === editingClass.id ? editingClass : cls))
      );
    }
    handleCloseModal();
  };


  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.header}>
          <h1>My Classes</h1>
          <button className={styles.createButton} onClick={handleOpenCreateModal}>
            <PlusCircle size={20} />
            Create New Class
          </button>
        </div>
        <div className={styles.classList}>
          {classes.map((course) => (
            <div key={course.id} className={styles.classCard}>
              <Link href="/dashboard/class" className={styles.cardLink}>
                <div className={styles.cardContent}>
                  <h2>{course.name}</h2>
                  {/* Student count is now dynamic */}
                  <p>{course.students.length} student(s)</p>
                </div>
              </Link>
              <div className={styles.cardActions}>
                  <button className={styles.iconButton} title="Edit Class" onClick={() => handleOpenEditModal(course)}><Edit size={16} /></button>
                  <button className={styles.iconButton} title="Delete Class" onClick={() => handleDeleteClass(course.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL for Create/Edit --- */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.modalHeader}>
                <h3>{modalMode === 'create' ? 'Create New Class' : 'Edit Class'}</h3>
                <button type="button" onClick={handleCloseModal} className={styles.closeButton}>&times;</button>
              </div>

              {/* === Main Body of Modal === */}
              <div className={styles.modalBody}>
                <div className={styles.inputGroup}>
                  <label htmlFor="className">Class Name</label>
                  <input type="text" id="className" value={className} onChange={(e) => setClassName(e.target.value)} className={styles.formInput} required />
                </div>
                
                {/* Conditionally render student manager only in 'edit' mode */}
                {modalMode === 'edit' && editingClass && (
                  <div className={styles.studentManager}>
                    <h4>Manage Students</h4>
                    <ul className={styles.studentList}>
                      {editingClass.students.map(student => (
                        <li key={student.id}>
                          <span>{student.name}</span>
                          <button type="button" onClick={() => handleRemoveStudent(student.id)} className={styles.removeStudentButton}><X size={14}/></button>
                        </li>
                      ))}
                      {editingClass.students.length === 0 && <li className={styles.noStudents}>No students in this class yet.</li>}
                    </ul>
                    <div className={styles.addStudentForm}>
                      <input 
                        type="text" 
                        placeholder="New student name..."
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        className={styles.formInput}
                      />
                      <button type="button" onClick={handleAddStudent} className={styles.addButton}>Add</button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={styles.modalFooter}>
                <button type="button" onClick={handleCloseModal} className={styles.cancelButton}>Cancel</button>
                <button type="submit" className={styles.confirmButton}>
                  {modalMode === 'create' ? 'Create Class' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

