'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { ShieldCheck, BarChart, BookCopy, Info, X } from 'lucide-react';
import { db } from '../lib/firebase'; // CORRECTED PATH
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_email', email);
    document.cookie = 'auth_token=dummy_token; path=/;';
    window.location.href = '/dashboard';
  };

  const handleRequestInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "infoRequests"), {
        name: contactName,
        email: contactEmail,
        message: contactMessage,
        submittedAt: serverTimestamp()
      });
      alert('Thank you for your request! We will be in touch shortly.');
      setIsInfoModalOpen(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (error) {
      console.error("Error adding document: ", error);
      alert('Sorry, there was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <header className={styles.header}>
            <div className={styles.logoContainer}>
              <Image 
                src="/logo.png"
                alt="SAMS Logo"
                width={200}
                height={200}
              />
              <div className={styles.logo}>
                <div className={styles.logoTitle}>SAMS</div>
                <div className={styles.logoTagline}>&quot;The Standard in Educational Solutions&quot;</div>
              </div>
            </div>
            <button className={styles.infoButton} onClick={() => setIsInfoModalOpen(true)}>
              <Info size={16} />
              Request More Info
            </button>
          </header>

          <main className={styles.mainContent}>
            <div className={styles.infoSide}>
                <h1 className={styles.title}>Accommodation Management, Reimagined.</h1>
                <p className={styles.description}>
                  The all-in-one platform for compliance, tracking, and data-driven insights.
                </p>
                <div className={styles.featuresGrid}>
                    <div className={styles.feature}><div className={styles.featureIconContainer}><BookCopy className={styles.featureIcon} /></div><div><h3 className={styles.featureTitle}>For Teachers & Admins</h3><p className={styles.featureDescription}>Acknowledge, track, and document accommodations seamlessly.</p></div></div>
                    <div className={styles.feature}><div className={styles.featureIconContainer}><BarChart className={styles.featureIcon} /></div><div><h3 className={styles.featureTitle}>Compliance & Reporting</h3><p className={styles.featureDescription}>Oversee compliance and manage school-wide data.</p></div></div>
                    <div className={styles.feature}><div className={styles.featureIconContainer}><ShieldCheck className={styles.featureIcon} /></div><div><h3 className={styles.featureTitle}>Secure & Compliant</h3><p className={styles.featureDescription}>Built with security in mind to protect student data.</p></div></div>
                </div>
            </div>
            <div className={styles.formSide}>
                <div className={styles.loginBox}>
                <h2>Welcome Back</h2>
                <p className={styles.loginSubtitle}>Sign in to access your dashboard.</p>
                <form onSubmit={handleLogin} className={styles.form}><div className={styles.inputGroup}><label htmlFor="email">Email Address</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div><div className={styles.inputGroup}><label htmlFor="password">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div><button type="submit" className={styles.loginButton}>Sign In</button></form>
                </div>
            </div>
          </main>
        </div>
      </div>

      {isInfoModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <form onSubmit={handleRequestInfoSubmit}>
              <div className={styles.modalHeader}>
                <h3>Request More Information</h3>
                <button type="button" onClick={() => setIsInfoModalOpen(false)} className={styles.closeButton}><X size={24}/></button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.inputGroup}><label htmlFor="contactName">Full Name</label><input type="text" id="contactName" className={styles.formInput} value={contactName} onChange={(e) => setContactName(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label htmlFor="contactEmail">Email Address</label><input type="email" id="contactEmail" className={styles.formInput} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} required /></div>
                <div className={styles.inputGroup}><label htmlFor="contactMessage">Message (Optional)</label><textarea id="contactMessage" className={styles.formInput} value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} rows={4}></textarea></div>
              </div>
              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setIsInfoModalOpen(false)} className={styles.cancelButton}>Cancel</button>
                <button type="submit" className={styles.confirmButton} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
