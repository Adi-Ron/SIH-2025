import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ChatbotWidget.module.scss';
import { BOT_MESSAGES } from './botMessages.js';

export function ChatbotWidget() {
  const [showNudge, setShowNudge] = useState(false);
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();

  // Show nudge after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNudge(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleChatClick = () => {
    navigate('/student/ai-companion');
  };

  const handleNudgeClick = () => {
    setShowNudge(false);
    navigate('/student/ai-companion');
  };

  return (
    <div className={styles.root}>
      {showNudge && (
        <div className={styles.nudge} onClick={handleNudgeClick}>
          <div className={styles.nudgeIcon}>🤖</div>
          <div className={styles.nudgeContent}>
            <div className={styles.nudgeTitle}>Need someone to talk to?</div>
            <div className={styles.nudgeText}>
              {BOT_MESSAGES[lang].nudge || "I'm here to listen and support you 24/7"}
            </div>
          </div>
          <button 
            className={styles.nudgeClose}
            onClick={(e) => {
              e.stopPropagation();
              setShowNudge(false);
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className={styles.widgetContainer}>
        <button 
          className={styles.fab} 
          onClick={handleChatClick}
          aria-label="Open AI Companion"
          title="Chat with AI Companion"
        >
          <div className={styles.fabIcon}>🤖</div>
          <div className={styles.fabPulse}></div>
        </button>
        
        <div className={styles.fabTooltip}>
          <span>AI Companion</span>
          <div className={styles.tooltipArrow}></div>
        </div>
      </div>
    </div>
  );
}