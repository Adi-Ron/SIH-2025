import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './GratitudeJournal.module.scss'

const GRATITUDE_QUESTIONS = [
  {
    id: 'moment',
    question: "What was a moment today that made you smile or feel grateful?",
    placeholder: "It could be something small like a warm cup of coffee, a kind word from someone, or seeing a beautiful sunset...",
    icon: "😊",
    color: "#f59e0b"
  },
  {
    id: 'person',
    question: "Who is someone you're grateful for today and why?",
    placeholder: "Think about someone who made a difference in your day - a friend, family member, teacher, or even a stranger...",
    icon: "❤️",
    color: "#ef4444"
  },
  {
    id: 'growth',
    question: "What's one thing you learned about yourself or accomplished today?",
    placeholder: "Maybe you handled a difficult situation well, learned something new, or took a step towards a goal...",
    icon: "🌟",
    color: "#8b5cf6"
  }
]

export function GratitudeJournal() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gratitudeEntries') || '{}')
    } catch {
      return {}
    }
  })
  const [currentEntry, setCurrentEntry] = useState({
    moment: '',
    person: '',
    growth: ''
  })
  const [isEditing, setIsEditing] = useState(false)
  const [showSaved, setShowSaved] = useState(false)

  useEffect(() => {
    // Load entry for selected date
    const dateKey = selectedDate
    if (entries[dateKey]) {
      setCurrentEntry(entries[dateKey])
      setIsEditing(true)
    } else {
      setCurrentEntry({ moment: '', person: '', growth: '' })
      setIsEditing(false)
    }
  }, [selectedDate, entries])

  const handleSaveEntry = () => {
    const dateKey = selectedDate
    const updatedEntries = {
      ...entries,
      [dateKey]: { ...currentEntry, date: selectedDate, timestamp: new Date().toISOString() }
    }
    
    setEntries(updatedEntries)
    localStorage.setItem('gratitudeEntries', JSON.stringify(updatedEntries))
    setShowSaved(true)
    setIsEditing(true)
    
    // Clear fields for next entry (only if saving today's entry)
    if (selectedDate === currentDate) {
      setCurrentEntry({ moment: '', person: '', growth: '' })
      setIsEditing(false)
    }
    
    // Hide success message after 3 seconds
    setTimeout(() => setShowSaved(false), 3000)
  }

  const handleInputChange = (questionId, value) => {
    setCurrentEntry(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const getStreakDays = () => {
    const today = new Date()
    let streak = 0
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      
      if (entries[dateKey]) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const getTotalEntries = () => {
    return Object.keys(entries).length
  }

  const getRecentEntries = () => {
    return Object.values(entries)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7)
  }

  const isEntryComplete = () => {
    return currentEntry.moment.trim() && currentEntry.person.trim() && currentEntry.growth.trim()
  }

  const canSave = () => {
    return isEntryComplete() && (!isEditing || Object.values(currentEntry).some(val => val.trim()))
  }

  return (
    <div className={styles.gratitudeJournal}>
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
              <h1 className={styles.title}>Gratitude Journal</h1>
              <p className={styles.subtitle}>
                Take a moment each day to reflect on the positive moments and people in your life
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🔥</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{getStreakDays()}</div>
                <div className={styles.statLabel}>Day Streak</div>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📝</div>
              <div className={styles.statInfo}>
                <div className={styles.statNumber}>{getTotalEntries()}</div>
                <div className={styles.statLabel}>Total Entries</div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className={styles.dateSection}>
          <label className={styles.dateLabel}>Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={currentDate}
            className={styles.dateInput}
          />
          {selectedDate === currentDate && (
            <div className={styles.todayBadge}>Today</div>
          )}
        </div>

        {/* Success Message */}
        {showSaved && (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <span>
              {selectedDate === currentDate 
                ? 'Entry saved! Fields cleared for your next entry.' 
                : 'Entry saved successfully!'}
            </span>
          </div>
        )}

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Gratitude Questions */}
          <div className={styles.questionsSection}>
            <h2 className={styles.sectionTitle}>Daily Reflection</h2>
            <p className={styles.sectionDescription}>
              Answer these three questions to reflect on your day and cultivate gratitude
            </p>
            
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
                  
                  <textarea
                    className={styles.questionInput}
                    value={currentEntry[question.id] || ''}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                    placeholder={question.placeholder}
                    rows={4}
                  />
                  
                  <div className={styles.characterCount}>
                    {currentEntry[question.id]?.length || 0} characters
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className={styles.saveSection}>
              <button
                className={`${styles.saveButton} ${canSave() ? styles.canSave : ''}`}
                onClick={handleSaveEntry}
                disabled={!canSave()}
              >
                <span className={styles.saveIcon}>💾</span>
                {isEditing ? 'Update Entry' : 'Save Entry'}
              </button>
              
              {!isEntryComplete() && (
                <p className={styles.completionHint}>
                  Complete all three questions to save your entry
                </p>
              )}
            </div>
          </div>

          {/* Recent Entries */}
          <div className={styles.recentSection}>
            <h2 className={styles.sectionTitle}>Recent Entries</h2>
            
            {getRecentEntries().length > 0 ? (
              <div className={styles.entriesList}>
                {getRecentEntries().map((entry, index) => (
                  <div key={entry.timestamp} className={styles.entryCard}>
                    <div className={styles.entryHeader}>
                      <div className={styles.entryDate}>
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          // Navigate to detailed view
                          window.location.href = `/student/gratitude-journal/entry/${entry.date}`
                        }}
                      >
                        View Full Entry
                      </button>
                    </div>
                    
                    <div className={styles.entryPreview}>
                      <div className={styles.previewItem}>
                        <span className={styles.previewLabel}>😊</span>
                        <span className={styles.previewText}>
                          {entry.moment.length > 80 
                            ? entry.moment.substring(0, 80) + '...' 
                            : entry.moment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📖</div>
                <p>No entries yet. Start your gratitude journey today!</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.navigation}>
          <Link to="/student/dashboard" className={styles.backButton}>
            ← Back to Dashboard
          </Link>
          <Link to="/student/self-help" className={styles.helpButton}>
            More Self-Help Tools →
          </Link>
        </div>
      </div>
    </div>
  )
}
