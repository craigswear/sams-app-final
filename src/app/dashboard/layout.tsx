// To make the active link highlighting work, we need this to be a Client Component
'use client'; 

import { usePathname } from 'next/navigation';
import styles from './layout.module.css'; // We'll create this CSS file next

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the current URL path to determine which link is active
  const pathname = usePathname();

  return (
    <div className={styles.layoutRoot}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>SAMS</div>
        <nav>
            <ul>
                {/* Dashboard Link */}
                <li>
                    <a 
                      href="/dashboard" 
                      className={pathname === '/dashboard' ? styles.active : ''}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25a2.25 2.25 0 01-2.25 2.25h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
                        Dashboard
                    </a>
                </li>

                {/* NEW: My Classes Link */}
                <li>
                    <a 
                      href="/dashboard/classes" 
                      className={pathname.startsWith('/dashboard/class') ? styles.active : ''}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6-2.292m0 0v14.25" /></svg>
                        My Classes
                    </a>
                </li>
            </ul>
        </nav>
        <button className={styles.logoutButton}>Logout</button>
      </aside>
      
      {/* Page content will be rendered here */}
      <div className={styles.contentWrapper}>
        {children}
      </div>
    </div>
  );
}