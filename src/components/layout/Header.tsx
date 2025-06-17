'use client';

import { useAuth } from '@/context/AuthContext'; // Assuming this is the correct path
import styles from './Header.module.css'; // Assuming you have a CSS module for the header

export function Header() {
  const { logout } = useAuth(); // This will now work correctly

  return (
    <header className={styles.topBar}>
      <button className={styles.logoutButton} onClick={logout}>
        Logout
      </button>
    </header>
  );
}