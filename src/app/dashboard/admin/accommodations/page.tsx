'use client';

import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore as db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { Accommodation } from '@/types';
import styles from './page.module.css';
import { AddAccommodationModal } from '@/components/modals/AddAccommodationModal';
import { PlusCircle } from 'lucide-react';

export default function ManageAccommodationsPage() {
    const { userProfile } = useAuth();
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAccommodations = useCallback(async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'accommodations'));
            const accommodationList = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
                id: doc.id,
                ...doc.data()
            } as Accommodation));
            setAccommodations(accommodationList);
        } catch (error) {
            console.error("Error fetching accommodations: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (userProfile?.role === 'admin') {
            fetchAccommodations();
        }
    }, [userProfile, fetchAccommodations]);

    if (loading) return <div className={styles.loading}>Loading accommodations...</div>;

    return (
        <>
            <AddAccommodationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAccommodationAdded={fetchAccommodations}
            />
            <div>
                <header className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.title}>Manage Accommodations</h1>
                        <p className={styles.subtitle}>Add or edit system-wide accommodations.</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className={styles.addButton}>
                        <PlusCircle size={20} />
                        Add Accommodation
                    </button>
                </header>

                <div className={styles.listContainer}>
                    {accommodations.map(acc => (
                        <div key={acc.id} className={styles.accommodationItem}>
                            <p className={styles.accommodationName}>{acc.name}</p>
                            <p className={styles.accommodationDesc}>{acc.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
