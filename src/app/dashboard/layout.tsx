'use client';

import styles from './layout.module.css';
import { Header } from '@/components/layout/Header'; // Import your new Header

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // The handleLogout function has been removed from here.

  return (
    <div className={styles.layoutRoot}>
      <aside className={styles.sidebar}>
        {/* Sidebar content remains the same */}
        <div className={styles.sidebarHeader}>SAMS</div>
        <nav>
           {/* ... your nav links ... */}
        </nav>
      </aside>
      
      <div className={styles.contentColumn}>
        <Header /> {/* Use the new Header component here */}
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
}