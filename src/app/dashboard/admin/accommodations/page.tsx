'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, doc, deleteDoc, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Accommodation } from '@/types';
import styles from './page.module.css';
import { AddAccommodationModal } from '@/components/modals/AddAccommodationModal';
import EditAccommodationModal from '@/components/modals/EditAccommodationModal';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

export default function ManageAccommodationsPage() {
    const { user } = useAuth();
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);

    const fetchAccommodations = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'accommodations'));
            const accommodationList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id, ...doc.data()
            } as Accommodation));
            setAccommodations(accommodationList);
        } catch (error) {
            console.error("Error fetching accommodations: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAccommodations();
        }
    }, [user, fetchAccommodations]);
    
    const handleEdit = (acc: Accommodation) => {
        setSelectedAccommodation(acc);
        setEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this accommodation? This action cannot be undone.")) {
            try {
                await deleteDoc(doc(db, "accommodations", id));
                fetchAccommodations(); // Refresh the list
            } catch (error) {
                console.error("Error deleting accommodation: ", error);
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading accommodations...</div>;

    return (
        <>
            <AddAccommodationModal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} onAccommodationAdded={fetchAccommodations} />
            <EditAccommodationModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} onAccommodationUpdated={fetchAccommodations} accommodation={selectedAccommodation} />
            
            <div>
                <header className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.title}>Manage Accommodations</h1>
                        <p className={styles.subtitle}>Add, edit, or remove system-wide accommodations.</p>
                    </div>
                    <button onClick={() => setAddModalOpen(true)} className={styles.addButton}>
                        <PlusCircle size={20} />
                        Add Accommodation
                    </button>
                </header>

                <div className={styles.listContainer}>
                    {accommodations.map(acc => (
                        <div key={acc.id} className={styles.accommodationItem}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div>
                                    <p className={styles.accommodationName}>{acc.name}</p>
                                    <p className={styles.accommodationDesc}>{acc.description}</p>
                                </div>
                                <div className={styles.accommodationActions}>
                                    <button onClick={() => handleEdit(acc)} className={styles.actionButton}><Edit size={14}/></button>
                                    <button onClick={() => handleDelete(acc.id)} className={`${styles.actionButton} ${styles.deleteButton}`}><Trash2 size={14}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
