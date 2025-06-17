'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, deleteDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { CreateUserModal } from '@/components/modals/CreateUserModal';
import EditUserModal from '@/components/modals/EditUserModal'; // Corrected: Use default import

export default function UserManagementPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    const fetchUsers = useCallback(async () => {
        if (user?.role !== 'admin') { setLoading(false); return; };
        setLoading(true);
        try {
            const usersCollectionRef = collection(db, 'users');
            const querySnapshot = await getDocs(usersCollectionRef);
            const usersList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data() } as UserProfile));
            setUsers(usersList);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load user data.");
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/dashboard');
        } else if (user) {
            fetchUsers();
        }
    }, [user, router, fetchUsers]);

    const handleEdit = (user: UserProfile) => {
        setSelectedUser(user);
        setEditModalOpen(true);
    };

    const handleDelete = async (uid: string) => {
        if (window.confirm("Are you sure you want to delete this user's profile? This does not remove their login credentials.")) {
            try {
                await deleteDoc(doc(db, "users", uid));
                fetchUsers(); // Refresh list
            } catch (error) {
                console.error("Error deleting user profile: ", error);
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading users...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <>
            <CreateUserModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onUserCreated={fetchUsers} />
            <EditUserModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onUserUpdated={fetchUsers} user={selectedUser} />
            
            <div>
                <header className={styles.pageHeader} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                        <h1 className={styles.title}>User Management</h1>
                        <p className={styles.subtitle}>View and manage all users in the system.</p>
                    </div>
                    <button onClick={() => setAddModalOpen(true)} className={styles.createButton}>
                        <PlusCircle size={20} />
                        Create User
                    </button>
                </header>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.uid}>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`${styles.roleTag} ${user.role === 'admin' ? styles.roleAdmin : styles.roleTeacher}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className={styles.actionsCell}>
                                        <button onClick={() => handleEdit(user)} className={styles.actionButton}><Edit size={14}/></button>
                                        <button onClick={() => handleDelete(user.uid)} className={`${styles.actionButton} ${styles.deleteButton}`}><Trash2 size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
