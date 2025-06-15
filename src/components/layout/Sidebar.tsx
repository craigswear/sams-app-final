'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, GraduationCap, Shield } from 'lucide-react'; // Removed 'Settings' icon
import styles from './Sidebar.module.css';
import { useAuth } from '@/context/AuthContext';

// Updated: Removed the 'Settings' object from the array
const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
    { href: '/dashboard/classes', label: 'My Classes', icon: Users, adminOnly: false },
    { href: '/dashboard/students', label: 'All Students', icon: GraduationCap, adminOnly: false },
    { href: '/dashboard/admin', label: 'Admin', icon: Shield, adminOnly: true },
];

export function Sidebar() {
    const pathname = usePathname();
    const { userProfile } = useAuth();

    // The rest of the logic remains the same
    const visibleNavItems = navItems.filter(item => 
        !item.adminOnly || (item.adminOnly && userProfile?.role === 'admin')
    );

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <Image src="/logo.png" alt="SAMS Logo" width={40} height={40} />
                <h1 className={styles.logoTitle}>SAMS</h1>
            </div>
            <nav>
                <ul className={styles.navList}>
                    {visibleNavItems.map((item) => (
                        <li key={item.href}>
                            <Link href={item.href} className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}>
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