import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { AppointmentsAPI } from '../../services/api.js';
import styles from './TherapistDashboard.module.scss';

export function TherapistDashboard() {
  const navigate = useNavigate();
  const { user, logoutTherapist } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments when component mounts or selectedDate changes
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get therapist ID from user data
        const therapistId = user.id || user.username || 'therapist1';
        
        const data = await AppointmentsAPI.getTherapistAppointments(therapistId, selectedDate);
        
        // Transform the data to match our component's expected format
        const transformedAppointments = data.map(apt => ({
          id: apt._id,
          studentName: apt.studentId?.name || 'Unknown Student',
          studentEmail: apt.studentId?.email || 'unknown@email.com',
          time: new Date(apt.startsAt).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          date: new Date(apt.startsAt).toISOString().split('T')[0],
          duration: 60, // Default duration
          status: apt.status === 'booked' ? 'upcoming' : apt.status,
          concern: 'Mental Health Support', // Default concern
          notes: 'Scheduled appointment',
          therapist: apt.counselorId?.name || user.name,
          startsAt: apt.startsAt
        }));
        
        setAppointments(transformedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user, selectedDate]);

  // Filter appointments for today
  const todayAppointments = appointments.filter(apt => apt.date === selectedDate);
  const upcomingToday = todayAppointments.filter(apt => apt.status === 'upcoming' || apt.status === 'booked');
  const completedToday = todayAppointments.filter(apt => apt.status === 'completed');

  // Calculate stats for current therapist
  const totalPatients = [...new Set(appointments.map(apt => apt.studentEmail))].length;
  const patientsToMeetToday = upcomingToday.length;
  const totalSessions = appointments.length;
  const completedSessions = appointments.filter(apt => apt.status === 'completed').length;

  const handleLogout = async () => {
    try {
      await logoutTherapist();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#f59e0b';
      case 'completed': return '#22c55e';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming': return '⏰';
      case 'completed': return '✅';
      case 'scheduled': return '📅';
      default: return '⏸️';
    }
  };

  return (
    <div className={styles.therapistDashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.therapistInfo}>
            <div className={styles.therapistAvatar}>
              {user?.name?.charAt(0) || 'T'}
            </div>
            <div className={styles.therapistDetails}>
              <h1>Welcome, {user?.name || 'Therapist'}</h1>
              <p>{user?.specialty || 'Mental Health Professional'}</p>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <span className={styles.logoutIcon}>🚪</span>
            Logout
          </button>
        </div>
      </header>

      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>👥</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{totalPatients}</div>
              <div className={styles.statLabel}>Total Patients</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{patientsToMeetToday}</div>
              <div className={styles.statLabel}>Patients Today</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>💬</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{totalSessions}</div>
              <div className={styles.statLabel}>Total Sessions</div>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{completedSessions}</div>
              <div className={styles.statLabel}>Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentSection}>
        <div className={styles.appointmentsSection}>
          <div className={styles.sectionHeader}>
            <h2>Today's Appointments</h2>
            <div className={styles.dateSelector}>
              <label>Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>

          <div className={styles.appointmentsList}>
            {loading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading appointments...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <div className={styles.errorIcon}>⚠️</div>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryBtn}>
                  Retry
                </button>
              </div>
            ) : todayAppointments.length === 0 ? (
              <div className={styles.noAppointments}>
                <div className={styles.noAppointmentsIcon}>📅</div>
                <p>No appointments scheduled for this date</p>
              </div>
            ) : (
              todayAppointments.map(appointment => (
                <div key={appointment.id} className={styles.appointmentCard}>
                  <div className={styles.appointmentHeader}>
                    <div className={styles.appointmentTime}>
                      <span className={styles.timeIcon}>🕐</span>
                      {appointment.time}
                    </div>
                    <div 
                      className={styles.appointmentStatus}
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      <span className={styles.statusIcon}>{getStatusIcon(appointment.status)}</span>
                      <span className={styles.statusText}>{appointment.status}</span>
                    </div>
                  </div>
                  
                  <div className={styles.appointmentContent}>
                    <div className={styles.patientInfo}>
                      <div className={styles.patientAvatar}>
                        {appointment.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.patientDetails}>
                        <h3 className={styles.patientName}>{appointment.studentName}</h3>
                        <p className={styles.patientEmail}>{appointment.studentEmail}</p>
                      </div>
                    </div>
                    
                    <div className={styles.appointmentDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Duration:</span>
                        <span className={styles.detailValue}>{appointment.duration} minutes</span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>Concern:</span>
                        <span className={styles.detailValue}>{appointment.concern}</span>
                      </div>
                      {appointment.notes && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Notes:</span>
                          <span className={styles.detailValue}>{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.appointmentActions}>
                    {appointment.status === 'upcoming' && (
                      <button className={`${styles.actionBtn} ${styles.startBtn}`}>
                        Start Session
                      </button>
                    )}
                    {appointment.status === 'completed' && (
                      <button className={`${styles.actionBtn} ${styles.viewBtn}`}>
                        View Notes
                      </button>
                    )}
                    <button className={`${styles.actionBtn} ${styles.rescheduleBtn}`}>
                      Reschedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
