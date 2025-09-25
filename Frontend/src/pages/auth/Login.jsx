import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Login.module.scss'

export function Login() {
  const { login, loginTherapist } = useAuth()
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const initialRole = params.get('role') === 'admin' ? 'admin' : params.get('role') === 'therapist' ? 'therapist' : 'student'
  const [role, setRole] = useState(initialRole)
  const [successMessage, setSuccessMessage] = useState(params.get('registered') ? 'Registration successful! Please log in.' : '')

  useEffect(() => { if (role !== initialRole) { /* allow change */ } }, [role, initialRole])

  function submit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const identity = form.get('identity')
    const password = form.get('password')
    
    if (role === 'therapist') {
      // Handle therapist login with predefined credentials
      const therapists = {
        'therapist1': { id: 'therapist1', name: 'Dr. A. Sharma', specialty: 'Cognitive Behavioral Therapy', email: 'dr.sharma@mindfulness.com' },
        'therapist2': { id: 'therapist2', name: 'Ms. R. Iyer', specialty: 'Anxiety & Depression', email: 'ms.iyer@mindfulness.com' }
      }
      
      if (identity === 'therapist1' && password === 'therapist123') {
        loginTherapist(therapists.therapist1)
        navigate('/therapist/dashboard')
      } else if (identity === 'therapist2' && password === 'therapist456') {
        loginTherapist(therapists.therapist2)
        navigate('/therapist/dashboard')
      } else {
        alert('Invalid therapist credentials')
      }
    } else {
      login(role === 'admin' ? { username: identity, password } : { email: identity, password })
        .then(() => navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard'))
        .catch(() => alert('Login failed'))
    }
  }


  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.header}>
            <div className={styles.logoContainer}>
              <img 
                src="/images/logo.png" 
                alt="MindFulness Logo"
                className={styles.logo}
              />
              <div className={styles.brandInfo}>
                <h1 className={styles.brandName}>MindFulness</h1>
                <p className={styles.tagline}>Your mental health companion</p>
              </div>
            </div>
            {successMessage && (
              <div className={styles.successAlert}>
                <span className={styles.successIcon}>✓</span>
                {successMessage}
              </div>
            )}
          </div>

          <form onSubmit={submit} className={styles.loginForm}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>Sign in to continue your mental health journey</p>
            </div>
            
            <div className={styles.roleSelector}>
              <label className={`${styles.roleBtn} ${role === 'student' ? styles.active : ''}`}>
                <div className={styles.roleIcon}>👨‍🎓</div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleTitle}>Student</div>
                  <div className={styles.roleDesc}>Access support & resources</div>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'student'} 
                  onChange={() => setRole('student')}
                  style={{ display: 'none' }}
                />
              </label>
              <label className={`${styles.roleBtn} ${role === 'admin' ? styles.active : ''}`}>
                <div className={styles.roleIcon}>👨‍💼</div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleTitle}>Admin</div>
                  <div className={styles.roleDesc}>Manage platform & users</div>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'admin'} 
                  onChange={() => setRole('admin')}
                  style={{ display: 'none' }}
                />
              </label>
              <label className={`${styles.roleBtn} ${role === 'therapist' ? styles.active : ''}`}>
                <div className={styles.roleIcon}>👨‍⚕️</div>
                <div className={styles.roleInfo}>
                  <div className={styles.roleTitle}>Therapist</div>
                  <div className={styles.roleDesc}>View appointments & patients</div>
                </div>
                <input 
                  type="radio" 
                  name="role" 
                  checked={role === 'therapist'} 
                  onChange={() => setRole('therapist')}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {role === 'admin' ? 'Username' : role === 'therapist' ? 'Therapist ID' : 'Email Address'}
              </label>
              <input 
                name="identity" 
                required 
                defaultValue={role === 'admin' ? 'admin' : role === 'therapist' ? 'therapist1' : 'student@university.edu'} 
                placeholder={role === 'admin' ? 'username' : role === 'therapist' ? 'therapist1 or therapist2' : 'you@university.edu'} 
                autoComplete={role === 'admin' ? 'username' : role === 'therapist' ? 'username' : 'email'}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Password
              </label>
              <input 
                name="password" 
                type="password" 
                required 
                defaultValue={role === 'therapist' ? 'therapist123' : 'admin123'} 
                placeholder="••••••••" 
                autoComplete="current-password"
                className={styles.formInput}
              />
            </div>

            <button 
              type="submit"
              className={styles.submitBtn}
            >
              <span className={styles.btnIcon}>🔐</span>
              Sign In
            </button>

            <div className={styles.formFooter}>
              {role === 'therapist' && (
                <div className={styles.credentialsInfo}>
                  <p><strong>Therapist Credentials:</strong></p>
                  <p>• Dr. A. Sharma: therapist1 / therapist123</p>
                  <p>• Ms. R. Iyer: therapist2 / therapist456</p>
                </div>
              )}
              
              {role === 'student' && (
                <div className={styles.registerPrompt}>
                  <p>Don't have an account?</p>
                  <button
                    type="button"
                    onClick={() => navigate('/student/register')}
                    className={styles.registerBtn}
                  >
                    Register as Student
                  </button>
                </div>
              )}
              
              <button
                type="button"
                onClick={() => navigate('/')}
                className={styles.backBtn}
              >
                ← Back to Home
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
