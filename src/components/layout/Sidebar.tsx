'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Shield } from 'lucide-react';
import styles from './Sidebar.module.css';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    // Base navigation items
    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'teacher' },
        { href: '/dashboard/admin', label: 'Admin', icon: Shield, role: 'admin' },
    ];

    // Filter items based on user role
    const visibleNavItems = navItems.filter(item => item.role === user?.role);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Image src="/logo.png" alt="SAMS Logo" width={40} height={40} />
                <h1 className={styles.logoTitle}>SAMS</h1>
            </div>
            <nav>
                <ul className={styles.navList}>
                    {/* For teachers, we only show their main dashboard link. Admins see the admin link. */}
                    {visibleNavItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} className={`${styles.navLink} ${pathname.startsWith(item.href) ? styles.navLinkActive : ''}`}>
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}