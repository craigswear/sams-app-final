'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { ImplementationLogReport } from '@/components/reports/ImplementationLogReport';
import { AcknowledgementStatusReport } from '@/components/reports/AcknowledgementStatusReport';

type ReportTab = 'logs' | 'acknowledgements';

export default function ReportsPageContainer() {
    const [activeTab, setActiveTab] = useState<ReportTab>('logs');

    return (
        <div>
            <header className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Compliance Reports</h1>
                    <p className={styles.subtitle}>View and analyze compliance data across the system.</p>
                </div>
            </header>

            <div className={styles.tabs}>
                <button 
                    onClick={() => setActiveTab('logs')}
                    className={`${styles.tabButton} ${activeTab === 'logs' ? styles.tabButtonActive : ''}`}
                >
                    Implementation Logs
                </button>
                <button 
                    onClick={() => setActiveTab('acknowledgements')}
                    className={`${styles.tabButton} ${activeTab === 'acknowledgements' ? styles.tabButtonActive : ''}`}
                >
                    Acknowledgement Status
                </button>
            </div>

            <div>
                {activeTab === 'logs' && <ImplementationLogReport />}
                {activeTab === 'acknowledgements' && <AcknowledgementStatusReport />}
            </div>
        </div>
    );
}

