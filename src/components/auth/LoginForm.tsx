'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import styles from './LoginForm.module.css';
import { useRouter } from 'next/navigation';
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(null); setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          setError('Invalid email or password.');
        } else { setError('An error occurred during login.'); }
      } else { setError('An unexpected error occurred.'); }
    } finally { setIsLoading(false); }
  };
  return (
    <div className={styles.formContainer}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to access your dashboard.</p>
        <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
                <Mail className={styles.inputIcon} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} required/>
            </div>
            <div className={styles.inputGroup}>
                <Lock className={styles.inputIcon} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.input} required/>
            </div>
            {error && (<div className={styles.error}><AlertCircle /><p>{error}</p></div>)}
            <div>
                <button type="submit" disabled={isLoading} className={styles.submitButton}>
                    {isLoading ? (<div className={styles.spinner}></div>) : (<LogIn />)}
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                </button>
            </div>
        </form>
    </div>
  );
}