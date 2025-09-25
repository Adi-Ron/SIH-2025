import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './CrisisAlert.module.scss'

export function CrisisAlert() {
  const [showSupportMessage, setShowSupportMessage] = useState(false)
  const [selectedSupport, setSelectedSupport] = useState(null)

  useEffect(() => {
    // Show supportive message after component mounts
    const timer = setTimeout(() => {
      setShowSupportMessage(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const crisisResources = [
    {
      id: 'emergency',
      title: 'Emergency Services',
      description: 'If you are in immediate danger or having thoughts of self-harm',
      number: '108',
      available: '24/7',
      type: 'emergency',
      action: 'Call Now'
    },
    {
      id: 'campus',
      title: 'Campus Security',
      description: 'Immediate help from campus security team',
      number: '+91 12345 67890',
      available: '24/7',
      type: 'campus',
      action: 'Call Campus'
    },
    {
      id: 'suicide-prevention',
      title: 'National Suicide Prevention Helpline',
      description: 'Free, confidential support for anyone in distress',
      number: '1800-599-0019',
      available: '24/7',
      type: 'crisis',
      action: 'Call Helpline'
    },
    {
      id: 'mental-health',
      title: 'Mental Health Helpline',
      description: 'Professional mental health support and counseling',
      number: '080-46110007',
      available: '24/7',
      type: 'support',
      action: 'Get Support'
    },
    {
      id: 'text-support',
      title: 'Crisis Text Line',
      description: 'Text-based crisis support - completely confidential',
      number: 'Text HOME to 741741',
      available: '24/7',
      type: 'text',
      action: 'Text Now'
    }
  ]

  const copingStrategies = [
    {
      title: 'Deep Breathing',
      description: 'Take slow, deep breaths to calm your nervous system',
      steps: ['Breathe in for 4 counts', 'Hold for 4 counts', 'Breathe out for 6 counts', 'Repeat 5 times']
    },
    {
      title: 'Grounding Technique',
      description: 'Connect with the present moment using your senses',
      steps: ['Name 5 things you can see', 'Name 4 things you can touch', 'Name 3 things you can hear', 'Name 2 things you can smell', 'Name 1 thing you can taste']
    },
    {
      title: 'Safe Space Visualization',
      description: 'Imagine yourself in a peaceful, safe place',
      steps: ['Close your eyes', 'Picture a calm, beautiful place', 'Notice all the details', 'Feel the peace and safety', 'Stay there for a few minutes']
    }
  ]

  const supportiveMessages = [
    "You are not alone in this. Many people care about you and want to help.",
    "This feeling is temporary, even though it doesn't feel that way right now.",
    "Asking for help is a sign of strength, not weakness.",
    "You have survived 100% of your worst days so far. You can get through this too.",
    "Your life has value and meaning, even when it's hard to see.",
    "There are people who understand what you're going through and can help."
  ]

  const handleSupportClick = (support) => {
    setSelectedSupport(support)
    
    // Simulate call/text action
    if (support.type === 'text') {
      // For text support, show instructions
      alert(`To get crisis support via text:\n\n1. Open your messaging app\n2. Text "HOME" to 741741\n3. A trained crisis counselor will respond\n\nThis service is free, confidential, and available 24/7.`)
    } else {
      // For phone calls, initiate the call
      window.location.href = `tel:${support.number.replace(/[^\d]/g, '')}`
    }
  }

  return (
    <div className={styles.crisisPage}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.circle3}></div>
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <div className={styles.crisisIcon}>🆘</div>
          </div>
          <h1 className={styles.title}>You Are Not Alone</h1>
          <p className={styles.subtitle}>
            We're here to help you through this difficult moment. Support is available right now.
          </p>
          
          {showSupportMessage && (
            <div className={styles.supportMessage}>
              <div className={styles.messageIcon}>💙</div>
              <p>{supportiveMessages[Math.floor(Math.random() * supportiveMessages.length)]}</p>
            </div>
          )}
        </div>

        {/* Crisis Resources */}
        <div className={styles.resourcesSection}>
          <h2 className={styles.sectionTitle}>Immediate Help Available</h2>
          <div className={styles.resourcesGrid}>
            {crisisResources.map((resource) => (
              <div key={resource.id} className={`${styles.resourceCard} ${styles[resource.type]}`}>
                <div className={styles.resourceHeader}>
                  <div className={styles.resourceIcon}>
                    {resource.type === 'emergency' && '🚨'}
                    {resource.type === 'campus' && '🏫'}
                    {resource.type === 'crisis' && '📞'}
                    {resource.type === 'support' && '🤝'}
                    {resource.type === 'text' && '💬'}
                  </div>
                  <div className={styles.resourceInfo}>
                    <h3 className={styles.resourceTitle}>{resource.title}</h3>
                    <p className={styles.resourceDescription}>{resource.description}</p>
                  </div>
                </div>
                
                <div className={styles.resourceDetails}>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactNumber}>{resource.number}</span>
                    <span className={styles.availability}>{resource.available}</span>
                  </div>
                  
                  <button
                    className={`${styles.contactButton} ${styles[resource.type]}`}
                    onClick={() => handleSupportClick(resource)}
                  >
                    {resource.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coping Strategies */}
        <div className={styles.copingSection}>
          <h2 className={styles.sectionTitle}>Coping Strategies</h2>
          <p className={styles.sectionDescription}>
            Try these techniques while waiting for support or between calls
          </p>
          
          <div className={styles.copingGrid}>
            {copingStrategies.map((strategy, index) => (
              <div key={index} className={styles.copingCard}>
                <div className={styles.copingHeader}>
                  <div className={styles.copingNumber}>{index + 1}</div>
                  <div className={styles.copingInfo}>
                    <h3 className={styles.copingTitle}>{strategy.title}</h3>
                    <p className={styles.copingDescription}>{strategy.description}</p>
                  </div>
                </div>
                
                <div className={styles.copingSteps}>
                  {strategy.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className={styles.step}>
                      <div className={styles.stepNumber}>{stepIndex + 1}</div>
                      <span className={styles.stepText}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Support */}
        <div className={styles.additionalSupport}>
          <h2 className={styles.sectionTitle}>More Support Options</h2>
          <div className={styles.supportLinks}>
            <Link to="/student/peer" className={styles.supportLink}>
              <div className={styles.linkIcon}>👥</div>
              <div className={styles.linkContent}>
                <h3>Peer Support</h3>
                <p>Connect with others who understand</p>
              </div>
            </Link>
            
            <Link to="/student/counselor" className={styles.supportLink}>
              <div className={styles.linkIcon}>👨‍⚕️</div>
              <div className={styles.linkContent}>
                <h3>Professional Counseling</h3>
                <p>Book a session with a counselor</p>
              </div>
            </Link>
            
            <Link to="/student/self-help" className={styles.supportLink}>
              <div className={styles.linkIcon}>📚</div>
              <div className={styles.linkContent}>
                <h3>Self-Help Resources</h3>
                <p>Access mental health tools and exercises</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className={styles.footerMessage}>
          <div className={styles.footerIcon}>🌟</div>
          <p>
            Remember: You matter. Your feelings are valid. Help is available, and you don't have to face this alone.
          </p>
        </div>
      </div>
    </div>
  )
}