import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMood } from '../../context/MoodContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './StudentLanding.module.scss'

export function StudentLanding() {
  const { currentMood, emotions, updateMood, personalizedContent, isLoading, getMoodInsights } = useMood()
  const { studentLoggedIn, adminLoggedIn } = useAuth()
  const navigate = useNavigate()
  const [showInsights, setShowInsights] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const insights = getMoodInsights()

  // Update animation when mood changes
  useEffect(() => {
    setAnimationKey(prev => prev + 1)
  }, [currentMood])

  const handleEmotionSelect = async (emotionId) => {
    await updateMood(emotionId, 'User selected emotion on landing page')
  }

  const handleSupportClick = (route) => {
    if (studentLoggedIn) {
      navigate(route)
    } else {
      navigate('/login?role=student')
    }
  }

  const getDynamicGreeting = () => {
    if (studentLoggedIn) return <span style={{ 
      fontStyle: 'italic',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      display: 'inline-block',
      margin: '1rem 0',
      background: 'linear-gradient(135deg, #ffffff, #e6f0ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>"Welcome back! How are you feeling today?"</span>
    return <span style={{ 
      fontStyle: 'italic',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      fontSize: '3rem',
      fontWeight: '800',
      lineHeight: '1.2',
      display: 'inline-block',
      margin: '1rem 0',
      background: 'linear-gradient(135deg, #ffffff, #e6f0ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>Find Your Peace</span>
  }

  const getDynamicDescription = () => {
    const style = {
      color: '#e2e8f0',
      fontSize: '1.25rem',
      lineHeight: '1.6',
      maxWidth: '600px',
      margin: '0 auto',
      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
      fontWeight: '400'
    };
    
    if (personalizedContent) {
      return <span style={style}>{personalizedContent.message}</span>
    }
    if (studentLoggedIn) {
      return <span style={style}>"Continue your mental health journey with personalized support and resources."</span>
    }
    return <span style={style}>"Experience a new way of emotional support. Our AI companion is here to listen, understand, and guide you through life's journey."</span>
  }

  return (
    <div className={styles.hero} style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      color: '#2c3e50',
      '--gradient-1': '#1a2980',
      '--gradient-2': '#26d0ce',
      '--gradient-3': '#4b6cb7',
      '--gradient-4': '#182848'
    }}>
      {/* Animated Gradient Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(
            45deg,
            var(--gradient-1),
            var(--gradient-2),
            var(--gradient-3),
            var(--gradient-4)
          )`,
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        zIndex: -1
      }} />
      <style jsx global>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      {/* Header */}
      <header className={styles.header} style={{
        background: 'var(--panel)',
        boxShadow: 'var(--shadow-md)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '15px 0'
      }}>
        <div className={styles.logo} style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          width: '100%',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/logo.png" 
              alt="MindFulness Logo" 
              style={{
                height: '60px',
                width: 'auto',
                marginRight: '20px'
              }}
            />
            <div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>MindFulness</div>
              <div style={{
                color: 'var(--muted)',
                fontSize: '14px',
                marginTop: '4px'
              }}>Your mental health Companion</div>
            </div>
          </div>
          <nav className={styles.nav} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px'
          }}>
            <a href="#features" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'rgba(74, 137, 220, 0.1)'
              }
            }}>Features</a>
            <a href="#about" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'rgba(74, 137, 220, 0.1)'
              }
            }}>About</a>
            <a href="#support" style={{
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              fontWeight: '500',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              transition: 'var(--transition)',
              '&:hover': {
                color: 'var(--primary)',
                backgroundColor: 'rgba(74, 137, 220, 0.1)'
              }
            }}>Support</a>
            <Link 
              to="/login?role=student" 
              style={{
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'var(--transition)',
                boxShadow: 'var(--shadow-sm)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-md)',
                  background: 'linear-gradient(135deg, var(--primary-light), var(--primary))'
                }
              }}
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent} style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '60px 20px',
        width: '100%'
      }}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            {/* Badge */}
            <div className={styles.badge}>
              <div className={styles.waveIcon}>🌊</div>
              <span>Your AI Agent Mental Health Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className={styles.headline} key={animationKey}>
              <span className={styles.highlight}>{getDynamicGreeting()}</span>
            </h1>

            {/* Description */}
            <p className={styles.description}>
              {getDynamicDescription()}
            </p>

            {/* Inspirational Quote */}
            <div className={styles.quoteSection}>
              <div className={styles.quoteCard}>
                <div className={styles.quoteIcon}>💭</div>
                <span>"Every emotion is valid and temporary. You are stronger than you know."</span>
              </div>
            </div>

            {/* Emotion Display */}
            <div className={styles.emotionSection}>
              <p className={styles.emotionPrompt}>We understand and support all emotions</p>
              <div className={styles.emotionGrid}>
                {emotions.map(emotion => (
                  <div
                    key={emotion.id}
                    className={styles.emotionDisplay}
                    style={{
                      '--emotion-color': emotion.color,
                    }}
                  >
                    <div className={styles.emotionEmoji}>{emotion.emoji}</div>
                    <div className={styles.emotionLabel}>{emotion.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.ctaButtons}>
              {studentLoggedIn ? (
                <Link to="/student/dashboard" className={styles.primaryBtn}>
                  Continue Journey
                </Link>
              ) : (
                <Link to="/login?role=student" className={styles.primaryBtn}>
                  Login
                </Link>
              )}
              {/* Admin access removed from student landing page */}
            </div>
          </div>
        </section>

        {/* Features & About Combined Section */}
        <section id="features" className={styles.infoSection}>
          <div className={styles.infoGrid}>
            {/* Features */}
            <div className={styles.featuresCard}>
              <h2 className={styles.cardTitle}>Why Choose MindFulness?</h2>
              <div className={styles.featuresList}>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>🤖</div>
                  <div>
                    <h4>AI-Powered Support</h4>
                    <p>24/7 intelligent companion</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>👥</div>
                  <div>
                    <h4>Peer Support</h4>
                    <p>Connect with fellow students</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>👨‍⚕️</div>
                  <div>
                    <h4>Professional Counselors</h4>
                    <p>Licensed mental health professionals</p>
                  </div>
                </div>
                <div className={styles.featureItem}>
                  <div className={styles.featureIcon}>📊</div>
                  <div>
                    <h4>Mood Tracking</h4>
                    <p>Monitor your emotional patterns</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div id="about" className={styles.aboutCard}>
              <h2 className={styles.cardTitle}>About MindFulness</h2>
              <p className={styles.aboutText}>
                A comprehensive digital mental health platform designed specifically for university students. 
                We understand the unique challenges you face and provide accessible, effective support.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>10K+</div>
                  <div className={styles.statLabel}>Students Helped</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>24/7</div>
                  <div className={styles.statLabel}>Support Available</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>95%</div>
                  <div className={styles.statLabel}>Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section id="support" className={styles.supportSection}>
          <h2 className={styles.sectionTitle}>Comprehensive Support Ecosystem</h2>
          <p className={styles.sectionSubtitle}>Your mental health journey is supported by multiple layers of care, from AI-powered assistance to professional counseling.</p>
          <div className={styles.supportGrid}>
            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>🤖</div>
              <h3>AI Companion</h3>
              <p className={styles.supportDescription}>
                Our advanced AI companion provides 24/7 emotional support, mood tracking, and personalized recommendations. 
                Powered by machine learning, it understands your patterns and offers evidence-based interventions.
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>24/7 Available</span>
                <span className={styles.tag}>Multi-language</span>
                <span className={styles.tag}>Personalized</span>
              </div>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>👥</div>
              <h3>Peer Support</h3>
              <p className={styles.supportDescription}>
                Connect with fellow students who understand your challenges. Join anonymous support groups, 
                share experiences, and build meaningful connections in a safe, moderated environment.
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>Anonymous</span>
                <span className={styles.tag}>Peer-led</span>
                <span className={styles.tag}>Safe Space</span>
              </div>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>👨‍⚕️</div>
              <h3>Professional Counseling</h3>
              <p className={styles.supportDescription}>
                Access licensed mental health professionals for one-on-one therapy sessions. 
                Our counselors specialize in student mental health and offer evidence-based treatments.
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>Licensed Therapists</span>
                <span className={styles.tag}>In-person Sessions</span>
                <span className={styles.tag}>Evidence-based</span>
              </div>
            </div>

            <div className={styles.supportCard}>
              <div className={styles.supportIcon}>📚</div>
              <h3>Self-Help Resources</h3>
              <p className={styles.supportDescription}>
                Access a comprehensive library of mental health resources including guided meditations, 
                breathing exercises, educational content, and wellness tools designed for students.
              </p>
              <div className={styles.featureTags}>
                <span className={styles.tag}>Guided Exercises</span>
                <span className={styles.tag}>Educational</span>
                <span className={styles.tag}>Wellness Tools</span>
              </div>
            </div>
          </div>
        </section>

        {/* Mood Insights - Only for logged in students */}
        {insights && studentLoggedIn && (
          <section className={styles.insightsSection}>
            <h2 className={styles.sectionTitle}>Your Mood Insights</h2>
            <div className={styles.insightsCard}>
              <div className={styles.insightsContent}>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Recent Trend:</span>
                  <span className={styles.insightValue}>{insights.trend.replace('_', ' ')}</span>
                </div>
                <div className={styles.insightItem}>
                  <span className={styles.insightLabel}>Most Common:</span>
                  <span className={styles.insightValue}>{insights.dominantMood}</span>
                </div>
              </div>
              <div className={styles.moodChart}>
                {Object.entries(insights.moodCounts).map(([mood, count]) => (
                  <div key={mood} className={styles.moodBar}>
                    <span>{emotions.find(e => e.id === mood)?.emoji}</span>
                    <div 
                      className={styles.bar}
                      style={{ 
                        width: `${(count / Math.max(...Object.values(insights.moodCounts))) * 100}%`,
                        backgroundColor: emotions.find(e => e.id === mood)?.color
                      }}
                    />
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

        {/* Interactive Features Showcase */}
        <section className={styles.showcaseSection}>
          <h2 className={styles.sectionTitle}>Experience the Future of Mental Health</h2>
          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseCard}>
              <div className={styles.showcaseIcon}>🧠</div>
              <h3>AI-Powered Insights</h3>
              <p>Advanced machine learning analyzes your mood patterns and provides personalized recommendations for better mental wellness.</p>
              <div className={styles.featureHighlight}>
                <span className={styles.highlightText}>Real-time analysis</span>
                <span className={styles.highlightText}>Personalized insights</span>
              </div>
            </div>

            <div className={styles.showcaseCard}>
              <div className={styles.showcaseIcon}>📱</div>
              <h3>Multi-Language Support</h3>
              <p>Chat with our AI companion in your native language. We support English, Hindi, Tamil, Telugu, Bengali, and Kannada.</p>
              <div className={styles.languageFlags}>
                <span>🇺🇸</span>
                <span>🇮🇳</span>
                <span>🇱🇰</span>
                <span>🇧🇩</span>
              </div>
            </div>

            <div className={styles.showcaseCard}>
              <div className={styles.showcaseIcon}>📊</div>
              <h3>Comprehensive Assessments</h3>
              <p>Take scientifically-backed mental health assessments (PHQ-9, GAD-7, GHQ-12) and track your progress over time.</p>
              <div className={styles.assessmentBadges}>
                <span className={styles.badge}>PHQ-9</span>
                <span className={styles.badge}>GAD-7</span>
                <span className={styles.badge}>GHQ-12</span>
              </div>
            </div>

            <div className={styles.showcaseCard}>
              <div className={styles.showcaseIcon}>🎯</div>
              <h3>Goal-Oriented Support</h3>
              <p>Set mental wellness goals, track your progress, and celebrate achievements with our integrated goal-setting system.</p>
              <div className={styles.goalProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width: '75%'}}></div>
                </div>
                <span>75% Complete</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className={styles.demoSection}>
          <h2 className={styles.sectionTitle}>See MindFulness in Action</h2>
          <div className={styles.demoContainer}>
            <div className={styles.demoContent}>
              <div className={styles.demoChat}>
                <div className={styles.chatHeader}>
                  <div className={styles.chatAvatar}>🤖</div>
                  <div className={styles.chatInfo}>
                    <h4>AI Companion</h4>
                    <span className={styles.onlineStatus}>● Online</span>
                  </div>
                </div>
                <div className={styles.chatMessages}>
                  <div className={`${styles.message} ${styles.bot}`}>
                    <p>Hi! I'm your MindFulness AI companion. How are you feeling today?</p>
                  </div>
                  <div className={`${styles.message} ${styles.user}`}>
                    <p>I'm feeling a bit stressed about my exams...</p>
                  </div>
                  <div className={`${styles.message} ${styles.bot}`}>
                    <p>I understand exam stress can be overwhelming. Let me help you with some breathing exercises and study tips.</p>
                  </div>
                </div>
              </div>
              <div className={styles.demoFeatures}>
                <div className={styles.demoFeature}>
                  <div className={styles.featureIcon}>💬</div>
                  <h4>24/7 Chat Support</h4>
                  <p>Always available when you need someone to talk to</p>
                </div>
                <div className={styles.demoFeature}>
                  <div className={styles.featureIcon}>🎵</div>
                  <h4>Guided Meditation</h4>
                  <p>Access calming sounds and meditation sessions</p>
                </div>
                <div className={styles.demoFeature}>
                  <div className={styles.featureIcon}>📈</div>
                  <h4>Progress Tracking</h4>
                  <p>Monitor your mental health journey over time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className={styles.finalCTA}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Your Mental Health Journey?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of students who have found peace, support, and growth through MindFulness. 
              Your mental health matters, and we're here to help you thrive.
            </p>
            <div className={styles.ctaButtons}>
              {studentLoggedIn ? (
                <Link to="/student/dashboard" className={styles.ctaPrimary}>
                  Continue Your Journey
                </Link>
              ) : (
                <>
                  <Link to="/student/register" className={styles.ctaPrimary}>
                    Get Started Free
                  </Link>
                  <Link to="/login?role=student" className={styles.ctaSecondary}>
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <div className={styles.trustIndicators}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🔒</span>
                <span>100% Private & Secure</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>⚡</span>
                <span>Instant Access</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🎓</span>
                <span>Built for Students</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.teamCredits}>
            <p>Made by - Aditya Banerjee, Khushi Mhamane, Dominic Joseph, Aditya S S Varma, Peeyush Rampal, Sharon Melhi</p>
          </div>
        </footer>
      </div>
    )
}