import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AppointmentsAPI } from '../../services/api.js';
import styles from './StudentDashboard.module.scss';

export function StudentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [upcomingAppointment, setUpcomingAppointment] = useState(null);
  const [loadingAppointment, setLoadingAppointment] = useState(true);
  const [assessmentData, setAssessmentData] = useState({
    lastAssessment: null,
    wellnessScore: null,
    currentWellness: 'Good'
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load assessment data from localStorage
  useEffect(() => {
    const loadAssessmentData = () => {
      try {
        const lastAssessment = localStorage.getItem('lastAssessmentResults');
        const lastAssessmentDate = localStorage.getItem('lastAssessmentDate');
        
        if (lastAssessment && lastAssessmentDate) {
          const results = JSON.parse(lastAssessment);
          const assessmentDate = new Date(lastAssessmentDate);
          
          // Calculate days since last assessment
          const daysSince = Math.floor((new Date() - assessmentDate) / (1000 * 60 * 60 * 24));
          
          // Calculate overall wellness score from results
          let totalScore = 0;
          let testCount = 0;
          
          if (results.phqScore !== undefined) {
            // PHQ-9: Lower is better (0-27 scale, convert to 100-0)
            totalScore += Math.max(0, 100 - (results.phqScore / 27) * 100);
            testCount++;
          }
          
          if (results.gadScore !== undefined) {
            // GAD-7: Lower is better (0-21 scale, convert to 100-0)
            totalScore += Math.max(0, 100 - (results.gadScore / 21) * 100);
            testCount++;
          }
          
          if (results.ghqScore !== undefined) {
            // GHQ-12: Lower is better (0-12 scale, convert to 100-0)
            totalScore += Math.max(0, 100 - (results.ghqScore / 12) * 100);
            testCount++;
          }
          
          const wellnessScore = testCount > 0 ? Math.round(totalScore / testCount) : 85;
          
          // Determine wellness status based on score
          let currentWellness = 'Good';
          if (wellnessScore < 40) currentWellness = 'Needs Attention';
          else if (wellnessScore < 60) currentWellness = 'Fair';
          else if (wellnessScore < 80) currentWellness = 'Good';
          else currentWellness = 'Excellent';
          
          setAssessmentData({
            lastAssessment: daysSince === 0 ? 'Today' : 
                          daysSince === 1 ? '1 day ago' : 
                          `${daysSince} days ago`,
            wellnessScore: `${wellnessScore}%`,
            currentWellness
          });
        }
      } catch (error) {
        console.error('Error loading assessment data:', error);
      }
    };
    
    loadAssessmentData();
    
    // Listen for assessment updates
    const handleStorageChange = (e) => {
      if (e.key === 'lastAssessmentResults' || e.key === 'lastAssessmentDate') {
        loadAssessmentData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch upcoming appointment
  useEffect(() => {
    const fetchUpcomingAppointment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoadingAppointment(false);
          return;
        }

        // Check if there's a stored appointment ID from recent booking
        const lastAppointmentId = localStorage.getItem('lastAppointmentId');
        if (lastAppointmentId) {
          // For demo purposes, we'll check localStorage for appointment data
          // In a real app, you'd fetch from the API
          const appointmentData = localStorage.getItem('upcomingAppointment');
          if (appointmentData) {
            const appointment = JSON.parse(appointmentData);
            const appointmentDate = new Date(appointment.startsAt);
            
            // Only show if appointment is in the future
            if (appointmentDate > new Date()) {
              setUpcomingAppointment(appointment);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching appointment:', error);
      } finally {
        setLoadingAppointment(false);
      }
    };

    fetchUpcomingAppointment();
  }, []);

  // Function to format appointment date
  const formatAppointmentDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

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
                  <span className={`${styles.statusValue} ${
                    assessmentData.currentWellness === 'Excellent' ? styles.excellent :
                    assessmentData.currentWellness === 'Good' ? styles.good :
                    assessmentData.currentWellness === 'Fair' ? styles.fair :
                    styles.needsAttention
                  }`}>
                    {assessmentData.currentWellness || 'Good'}
                  </span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>📊</div>
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>Last Assessment</span>
                  <span className={styles.statusValue}>{assessmentData.lastAssessment || 'Never'}</span>
                </div>
              </div>
              <div className={styles.statusItem}>
                <div className={styles.statusIcon}>🎯</div>
                <div className={styles.statusInfo}>
                  <span className={styles.statusLabel}>Wellness Score</span>
                  <span className={styles.statusValue}>{assessmentData.wellnessScore || '85%'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Appointment - Only show if there's a real appointment */}
      {!loadingAppointment && upcomingAppointment && (
        <section className={styles.appointmentSection}>
          <div className={styles.appointmentCard}>
            <div className={styles.appointmentHeader}>
              <div className={styles.appointmentIcon}>📅</div>
              <div className={styles.appointmentInfo}>
                <h2 className={styles.appointmentTitle}>Next Counseling Session</h2>
                <p className={styles.appointmentSubtitle}>Your upcoming appointment with your counselor</p>
              </div>
            </div>
            
            <div className={styles.appointmentDetails}>
              <div className={styles.appointmentDate}>
                <div className={styles.dateIcon}>🗓️</div>
                <div className={styles.dateInfo}>
                  <div className={styles.dateLabel}>Date & Time</div>
                  <div className={styles.dateValue}>{formatAppointmentDate(upcomingAppointment.startsAt)}</div>
                </div>
              </div>
              
              <div className={styles.appointmentCounselor}>
                <div className={styles.counselorIcon}>👨‍⚕️</div>
                <div className={styles.counselorInfo}>
                  <div className={styles.counselorLabel}>Your Counselor</div>
                  <div className={styles.counselorValue}>{upcomingAppointment.counselorName || 'Your Counselor'}</div>
                  <div className={styles.counselorSpecialty}>{upcomingAppointment.specialty || 'Licensed Professional'}</div>
                </div>
              </div>
              
            </div>
          </div>
        </section>
      )}

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
            <Link to="/student/gratitude-journal" className={styles.supportOption}>
              <div className={styles.optionIcon}>📔</div>
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Gratitude Journal</div>
                <div className={styles.optionDesc}>Daily reflection & positivity</div>
              </div>
            </Link>
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