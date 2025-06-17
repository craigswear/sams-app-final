'use client';

import Link from 'next/link';
import Image from 'next/image'; // Import the Image component
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <Image
          src="/logo.png" // IMPORTANT: Change to your logo's path in the /public folder
          alt="SAMS Logo"
          width={40}
          height={40}
        />
        <span>SAMS</span>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <Link 
              href="/dashboard" 
              className={pathname === '/dashboard' ? styles.active : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard"
              className={pathname.startsWith('/dashboard/class') ? styles.active : ''}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              <span>My Classes</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}