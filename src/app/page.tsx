'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { ShieldCheck, BarChart, BookCopy, Info } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // THIS IS THE NEW LINE: It saves the email for the AuthProvider to check.
    localStorage.setItem('user_email', email);

    // The rest of the function remains the same.
    document.cookie = 'auth_token=dummy_token; path=/;';
    window.location.href = '/dashboard';
  };

  return (
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
              <div className={styles.logoTagline}>"The Standard in Educational Solutions"</div>
            </div>
          </div>
          <button className={styles.infoButton}>
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
              <div className={styles.feature}>
                <div className={styles.featureIconContainer}>
                  <BookCopy className={styles.featureIcon} />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>For Teachers & Admins</h3>
                  <p className={styles.featureDescription}>Acknowledge, track, and document accommodations seamlessly.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIconContainer}>
                  <BarChart className={styles.featureIcon} />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Compliance & Reporting</h3>
                  <p className={styles.featureDescription}>Oversee compliance and manage school-wide data.</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIconContainer}>
                  <ShieldCheck className={styles.featureIcon} />
                </div>
                <div>
                  <h3 className={styles.featureTitle}>Secure & Compliant</h3>
                  <p className={styles.featureDescription}>Built with security in mind to protect student data.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.formSide}>
            <div className={styles.loginBox}>
              <h2>Welcome Back</h2>
              <p className={styles.loginSubtitle}>Sign in to access your dashboard.</p>
              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.loginButton}>
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
