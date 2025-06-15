'use client';
import { BarChart, BookCheck, ShieldCheck } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import Image from 'next/image';
import styles from './page.module.css';
export default function HomePage() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="SAMS Logo" width={50} height={50}/>
            <h1 className={styles.logoTitle}>SAMS</h1>
          </div>
        </header>
        <main className={styles.mainContent}>
          <div className={styles.infoSide}>
            <h2 className={styles.title}>Accommodation Management, Reimagined.</h2>
            <p className={styles.description}>The all-in-one platform for compliance, tracking, and data-driven insights.</p>
            <div className={styles.featuresGrid}>
              <div className={styles.feature}><div className={styles.featureIconContainer}><BookCheck className={styles.featureIcon} /></div><div><h3 className={styles.featureTitle}>For Teachers & Admins</h3><p className={styles.featureDescription}>Acknowledge, track, and document accommodations.</p></div></div>
              <div className={styles.feature}><div className={styles.featureIconContainer}><BarChart className={styles.featureIcon} /></div><div><h3 className={styles.featureTitle}>Compliance & Reporting</h3><p className={styles.featureDescription}>Oversee compliance and manage school-wide data.</p></div></div>
              <div className={styles.feature}><div className={styles.featureIconContainer}><ShieldCheck className={styles.featureIcon} /></div><div><h3 className={styles.featureTitle}>Secure & Compliant</h3><p className={styles.featureDescription}>Built with security in mind to protect student data.</p></div></div>
            </div>
          </div>
          <div className={styles.formSide}><LoginForm /></div>
        </main>
      </div>
    </div>
  );
}