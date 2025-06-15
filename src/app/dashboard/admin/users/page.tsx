'use client';
import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { CreateUserModal } from '@/components/modals/CreateUserModal';
export default function UserManagementPage() {
    const { userProfile } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fetchUsers = useCallback(async () => {
        if (userProfile?.role !== 'admin') { setLoading(false); return; };
        try {
            const usersCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollectionRef);
            const usersList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data() } as UserProfile));
            setUsers(usersList);
        } catch (err) { setError("Failed to load user data."); } finally { setLoading(false); }
    }, [userProfile]);
    useEffect(() => {
        if (userProfile && userProfile.role !== 'admin') { router.push('/dashboard'); } else if (userProfile) { fetchUsers(); }
    }, [userProfile, router, fetchUsers]);
    if (loading) return <div className={styles.loading}>Loading users...</div>;
    if (error) return <div className={styles.error}>{error}</div>;
    return (
        <>
            <CreateUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUserCreated={fetchUsers} />
            <div>
                <header className={styles.pageHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div><h1 className={styles.title}>User Management</h1><p className={styles.subtitle}>View and manage all users in the system.</p></div>
                    <button onClick={() => setIsModalOpen(true)} className={styles.createButton}><PlusCircle size={20} />Create User</button>
                </header>
                <div className={styles.tableContainer}><table className={styles.table}><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.map((user) => (<tr key={user.uid}><td>{user.firstName} {user.lastName}</td><td>{user.email}</td><td><span className={`${styles.roleTag} ${user.role === 'admin' ? styles.roleAdmin : styles.roleTeacher}`}>{user.role}</span></td></tr>))}</tbody></table></div>
            </div>
        </>
    );
}