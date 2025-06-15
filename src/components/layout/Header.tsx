'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export function Header() {
    const { logout } = useAuth();

    return (
        <header className={styles.header}>
            <button onClick={logout} className={styles.logoutButton}>
                Logout
            </button>
        </header>
    );
}