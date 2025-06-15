'use client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
export function Header() {
    const router = useRouter();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push('/');
        } catch (error) {
            console.error('Error signing out: ', error);
        }
    };
    return (
        <header className={styles.header}>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </header>
    );
}