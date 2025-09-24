import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './StudentDashboard.module.scss';

export function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcome}>Welcome back, Student! 👋</h1>
            <p className={styles.subtitle}>Your mental wellness journey continues here</p>
            <div className={styles.timeInfo}>
              <span className={styles.currentTime}>{currentTime}</span>
              <span className={styles.todayDate}>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className={styles.statusOverview}>
            <div className={styles.statusGrid}>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>💚</div>
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>Current Wellness</span>
                  <span className={`${styles.statusValue} ${styles.good}`}>Good</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>📊</div>
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>Last Assessment</span>
                  <span className={styles.statusValue}>2 days ago</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>🎯</div>
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>Wellness Score</span>
                  <span className={styles.statusValue}>85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Support</h2>
        <div className={styles.actionsGrid}>
          <Link to="/student/ai-companion" className={`${styles.actionCard} ${styles.aiCard}`}>
            <div className={styles.cardIcon}>🤖</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>AI Companion</h3>
              <p className={styles.cardDesc}>Chat with our supportive AI anytime</p>
              <div className={styles.cardStatus}>
                <span className={styles.onlineIndicator}></span>
                Always available
              </div>
            </div>
            <div className={styles.cardAction}>
              <span className={styles.actionText}>Start Chat</span>
              <span className={styles.actionArrow}>→</span>
            </div>
          </Link>

          <Link to="/student/peer" className={`${styles.actionCard} ${styles.peerCard}`}>
            <div className={styles.cardIcon}>👥</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Peer Support</h3>
              <p className={styles.cardDesc}>Join supportive community channels</p>
              <div className={styles.cardStatus}>
                <span className={styles.activeIndicator}>🟢</span>
                142 members online
              </div>
            </div>
            <div className={styles.cardAction}>
              <span className={styles.actionText}>Join Chat</span>
              <span className={styles.actionArrow}>→</span>
            </div>
          </Link>

          <Link to="/student/crisis" className={`${styles.actionCard} ${styles.crisisCard}`}>
            <div className={styles.cardIcon}>🚨</div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Crisis Support</h3>
              <p className={styles.cardDesc}>Immediate help when you need it</p>
              <div className={styles.cardStatus}>
                <span className={styles.emergencyIndicator}>🔴</span>
                24/7 Emergency
              </div>
            </div>
            <div className={styles.cardAction}>
              <span className={styles.actionText}>Get Help</span>
              <span className={styles.actionArrow}>→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Main Grid */}
      <section className={styles.mainGrid}>
        {/* Support Options */}
        <div className={styles.supportSection}>
          <div className={styles.cardHeader}>
            <h3>Explore Support Options</h3>
            <div className={styles.headerIcon}>🌟</div>
          </div>
          <div className={styles.supportOptions}>
            <Link to="/student/support" className={styles.supportOption}>
              <div className={styles.optionIcon}>🤝</div>
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Find Support</div>
                <div className={styles.optionDesc}>Explore all available options</div>
              </div>
            </Link>
            <Link to="/student/assessment" className={styles.supportOption}>
              <div className={styles.optionIcon}>📋</div>
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Take Assessment</div>
                <div className={styles.optionDesc}>Check your current mood</div>
              </div>
            </Link>
            <Link to="/student/counselor" className={styles.supportOption}>
              <div className={styles.optionIcon}>👨‍⚕️</div>
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Book Counseling</div>
                <div className={styles.optionDesc}>Professional therapy sessions</div>
              </div>
            </Link>
            <Link to="/student/self-help" className={styles.supportOption}>
              <div className={styles.optionIcon}>📚</div>
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Self-Help Resources</div>
                <div className={styles.optionDesc}>Guided exercises & articles</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Wellness Tips */}
        <div className={styles.wellnessSection}>
          <div className={styles.cardHeader}>
            <h3>Daily Wellness</h3>
            <div className={styles.headerIcon}>🌱</div>
          </div>
          <div className={styles.wellnessTips}>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>🧘</div>
              <div className={styles.tipContent}>
                <h4>Mindful Breathing</h4>
                <p>Take 5 minutes to practice deep breathing exercises</p>
                <Link to="/student/self-help" className={styles.tipAction}>Try Now</Link>
              </div>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>📝</div>
              <div className={styles.tipContent}>
                <h4>Gratitude Journal</h4>
                <p>Write down three things you're grateful for today</p>
                <Link to="/student/self-help" className={styles.tipAction}>Start Writing</Link>
              </div>
            </div>
            <div className={styles.tipCard}>
              <div className={styles.tipIcon}>🚶</div>
              <div className={styles.tipContent}>
                <h4>Take a Walk</h4>
                <p>Fresh air and movement can boost your mood</p>
                <div className={styles.tipAction}>Go Outside</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={styles.activitySection}>
          <div className={styles.cardHeader}>
            <h3>Your Progress</h3>
            <div className={styles.headerIcon}>📈</div>
          </div>
          <div className={styles.progressStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>7</div>
              <div className={styles.statLabel}>Days Active</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>3</div>
              <div className={styles.statLabel}>Assessments</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>12</div>
              <div className={styles.statLabel}>AI Chats</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5</div>
              <div className={styles.statLabel}>Resources Used</div>
            </div>
          </div>
          <div className={styles.progressMessage}>
            <span className={styles.messageIcon}>🎉</span>
            <p>Great job! You've been consistently engaging with your mental health. Keep it up!</p>
          </div>
        </div>
      </section>
    </div>
  );
}