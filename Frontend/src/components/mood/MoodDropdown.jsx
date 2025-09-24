import { useState, useRef, useEffect } from 'react';
import { useClickAway } from 'react-use';
import { useMood } from '../../context/MoodContext.jsx';
import styles from './MoodDropdown.module.scss';

// Mood icon component
const MoodIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

export function MoodDropdown() {
  const { currentMood, emotions, updateMood, moodHistory, getMoodInsights } = useMood();
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const dropdownRef = useRef(null);

  const currentEmotion = emotions.find(e => e.id === currentMood);
  const insights = getMoodInsights();

  // Close dropdown when clicking outside
  useClickAway(dropdownRef, () => {
    setIsOpen(false);
    setShowHistory(false);
  });

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowHistory(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleMoodSelect = (emotionId) => {
    updateMood(emotionId, 'Quick mood selection');
    // Close dropdown after selection
    setTimeout(() => {
      setIsOpen(false);
      setShowHistory(false);
    }, 300);
  };

  return (
    <div className={styles.moodDropdown} ref={dropdownRef}>
      <button 
        className={styles.moodTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="Update your mood"
      >
        <MoodIcon />
        <div 
          className={styles.moodIndicator}
          style={{ backgroundColor: currentEmotion?.color }}
        >
          {currentEmotion?.emoji}
        </div>
      </button>

      {isOpen && (
        <div className={styles.dropdownPanel}>
          <div className={styles.currentMoodSection}>
            <h3>Current Mood</h3>
            <div className={styles.currentMoodDisplay}>
              <div 
                className={styles.moodEmoji}
                style={{ 
                  backgroundColor: currentEmotion?.color,
                  boxShadow: `0 0 20px ${currentEmotion?.color}40`
                }}
              >
                {currentEmotion?.emoji}
              </div>
              <div className={styles.moodInfo}>
                <div className={styles.moodLabel}>{currentEmotion?.label}</div>
                <div className={styles.moodTime}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.quickMoodsSection}>
            <h4>Update Mood</h4>
            <div className={styles.moodGrid}>
              {emotions.map(emotion => (
                <button
                  key={emotion.id}
                  className={`${styles.moodButton} ${currentMood === emotion.id ? styles.active : ''}`}
                  onClick={() => handleMoodSelect(emotion.id)}
                  style={{ 
                    '--emotion-color': emotion.color,
                    backgroundColor: currentMood === emotion.id ? emotion.color : 'transparent'
                  }}
                  title={emotion.label}
                >
                  <span className={styles.emoji}>{emotion.emoji}</span>
                  <span className={styles.label}>{emotion.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h4>Mood History</h4>
              <button 
                className={styles.toggleHistory}
                onClick={() => setShowHistory(!showHistory)}
              >
                {showHistory ? '▼' : '▶'}
              </button>
            </div>
            
            {showHistory && (
              <div className={styles.historyContent}>
                <div className={styles.historyList}>
                  {moodHistory.slice(-5).reverse().map(entry => (
                    <div key={entry.id} className={styles.historyItem}>
                      <div 
                        className={styles.historyEmoji}
                        style={{ backgroundColor: entry.emotion.color }}
                      >
                        {entry.emotion.emoji}
                      </div>
                      <div className={styles.historyInfo}>
                        <div className={styles.historyLabel}>{entry.emotion.label}</div>
                        <div className={styles.historyTime}>
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {insights && (
                  <div className={styles.insights}>
                    <h5>Insights</h5>
                    <div className={styles.insightItem}>
                      <span>Trend:</span>
                      <strong>{insights.trend.replace('_', ' ')}</strong>
                    </div>
                    <div className={styles.insightItem}>
                      <span>Most common:</span>
                      <strong>{insights.dominantMood}</strong>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
