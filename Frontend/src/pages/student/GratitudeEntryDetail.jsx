import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import styles from './GratitudeEntryDetail.module.scss'

const GRATITUDE_QUESTIONS = [
  {
    id: 'moment',
    question: "What was a moment today that made you smile or feel grateful?",
    icon: "😊",
    color: "#f59e0b"
  },
  {
    id: 'person',
    question: "Who is someone you're grateful for today and why?",
    icon: "❤️",
    color: "#ef4444"
  },
  {
    id: 'growth',
    question: "What's one thing you learned about yourself or accomplished today?",
    icon: "🌟",
    color: "#8b5cf6"
  }
]

export function GratitudeEntryDetail() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load entry for the specified date
    try {
      const entries = JSON.parse(localStorage.getItem('gratitudeEntries') || '{}')
      const entryData = entries[date]
      
      if (entryData) {
        setEntry(entryData)
      } else {
        // Entry not found, redirect back to journal
        navigate('/student/gratitude-journal')
      }
    } catch (error) {
      console.error('Error loading entry:', error)
      navigate('/student/gratitude-journal')
    } finally {
      setLoading(false)
    }
  }, [date, navigate])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your entry...</p>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>📝</div>
        <h2>Entry Not Found</h2>
        <p>This gratitude journal entry could not be found.</p>
        <Link to="/student/gratitude-journal" className={styles.backButton}>
          ← Back to Journal
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.entryDetail}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconContainer}>
              <div className={styles.journalIcon}>📔</div>
            </div>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Gratitude Entry</h1>
              <p className={styles.subtitle}>
                Your reflections from {formatDate(date)}
              </p>
              <div className={styles.entryMeta}>
                <span className={styles.entryDate}>📅 {formatDate(date)}</span>
                <span className={styles.entryTime}>🕐 {formatTime(entry.timestamp)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Entry Content */}
        <div className={styles.entryContent}>
          <div className={styles.questionsContainer}>
            {GRATITUDE_QUESTIONS.map((question, index) => (
              <div key={question.id} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <div className={styles.questionIcon} style={{ backgroundColor: question.color }}>
                    {question.icon}
                  </div>
                  <div className={styles.questionNumber}>Question {index + 1}</div>
                </div>
                
                <h3 className={styles.questionText}>{question.question}</h3>
                
                <div className={styles.answerContainer}>
                  <div className={styles.answerText}>
                    {entry[question.id] || 'No answer provided'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to="/student/gratitude-journal" className={styles.backButton}>
            ← Back to Journal
          </Link>
          <button
            className={styles.editButton}
            onClick={() => {
              navigate('/student/gratitude-journal')
              // Set the date in the main journal for editing
              setTimeout(() => {
                const dateInput = document.querySelector('input[type="date"]')
                if (dateInput) {
                  dateInput.value = date
                  dateInput.dispatchEvent(new Event('change', { bubbles: true }))
                }
              }, 100)
            }}
          >
            Edit Entry
          </button>
        </div>
      </div>
    </div>
  )
}
