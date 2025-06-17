'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { Edit, Trash2, PlusCircle } from 'lucide-react'; // Import icons

const myClasses = [
  { id: 'algebra-1', name: 'test class 3', studentCount: 4 },
  { id: 'geometry-1', name: 'test class 2', studentCount: 3 },
];

export default function TeacherDashboardPage() {

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <h1>My Classes</h1>
        <button className={styles.createButton}>
          <PlusCircle size={20} />
          Create New Class
        </button>
      </div>
      <div className={styles.classList}>
        {myClasses.map((course) => (
          <div key={course.id} className={styles.classCard}>
            <Link href="/dashboard/class" className={styles.cardLink}>
              <div className={styles.cardContent}>
                <h2>{course.name}</h2>
                <p>{course.studentCount} student(s)</p>
              </div>
            </Link>
            <div className={styles.cardActions}>
                <button className={styles.iconButton} title="Edit Class"><Edit size={16} /></button>
                <button className={styles.iconButton} title="Delete Class"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

