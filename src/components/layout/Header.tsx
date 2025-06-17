'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export function Header() {
  const { logout } = useAuth();

  return (
    <header className={styles.topBar}>
      {/* You can add other header elements here later, like a search bar or user profile dropdown */}
      <button className={styles.logoutButton} onClick={logout}>
        Logout
      </button>
    </header>
  );
}