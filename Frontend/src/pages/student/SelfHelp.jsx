import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './SelfHelp.module.scss'

const videos = [
  { id: 'breath5', yt: 'inpok4MKVLM', title: 'Mindful Breathing (5 min)', tag: 'Meditation', icon: '🧘' },
  { id: 'ground321', yt: 'tEmt1Znux58', title: 'Grounding Exercise (3-2-1)', tag: 'Exercise', icon: '🌱' },
  { id: 'motivation', mp4: 'https://cdn.pixabay.com/vimeo/147015082/bird-1860.mp4?width=1280&hash=a0b3f0ed9d9f3e3c2e6f1', title: 'Student Motivation Boost', tag: 'Motivation', icon: '🚀' },
]

const sounds = [
  { id: 'rain', title: 'Gentle Rain', url: '/audio/gentle-rain.mp3', icon: '🌧️' },
  { id: 'piano', title: 'Soft Piano', url: '/audio/soft-piano.mp3', icon: '🎹' },
  { id: 'ocean', title: 'Ocean Waves', url: '/audio/ocean-waves.mp3', icon: '🌊' },
  { id: 'forest', title: 'Forest Sounds', url: '/audio/forest-sounds.mp3', icon: '🌲' },
  { id: 'birds', title: 'Bird Songs', url: '/audio/bird-songs.mp3', icon: '🐦' },
  { id: 'wind', title: 'Gentle Wind', url: '/audio/gentle-wind.mp3', icon: '🍃' },
]

const sleepTips = [
  'Keep a consistent sleep schedule (same time daily).',
  'Limit screens 60 minutes before bed.',
  'Avoid caffeine after 3 PM; hydrate with water or herbal tea.',
  'Keep room cool, dark, and quiet; consider earplugs or eye mask.',
  'If you cannot sleep in 20 minutes, get up and do a calm activity.'
]

const counselorRecommendedVideos = [
  { 
    id: 'depression-ted', 
    yt: 'dBYUn-FEscc', 
    title: 'Depression, the secret we share | Andrew Solomon | TEDxMet', 
    description: 'A powerful TED talk about understanding depression and finding hope',
    category: 'Depression',
    icon: '💙'
  },
  { 
    id: 'psychedelic-therapy', 
    yt: 'Bd4VzEqFQXQ', 
    title: 'The future of psychedelic-assisted psychotherapy | Rick Doblin', 
    description: 'Exploring new frontiers in mental health treatment',
    category: 'Therapy',
    icon: '🧠'
  },
  { 
    id: 'where-we-begin', 
    yt: 'playlist', 
    title: 'Where should we begin? - Podcast Series', 
    description: 'Profound conversations about relationships and mental health',
    category: 'Relationships',
    icon: '💬',
    isPlaylist: true,
    playlistId: 'PL_loxoCVsWqx55JcIyGDzJXqWBV1Xbvyf'
  },
  { 
    id: 'burnout-masterclass', 
    yt: 'playlist', 
    title: 'BURNOUT! My YouTube Master Class Series', 
    description: 'Comprehensive guide to understanding and overcoming burnout',
    category: 'Burnout',
    icon: '🔥',
    isPlaylist: true,
    playlistId: 'PL_loxoCVsWqx55JcIyGDzJXqWBV1Xbvyf'
  },
  { 
    id: 'panic-attacks', 
    yt: 'playlist', 
    title: 'How to Stop Panic Attacks', 
    description: 'Practical techniques for managing panic and anxiety',
    category: 'Anxiety',
    icon: '🫂',
    isPlaylist: true,
    playlistId: 'PLiUrrIiqidTWhubkHEJcr6iTLVRxXZmPE'
  }
]

export function SelfHelp() {
  const [activeVideo, setActiveVideo] = useState(null)
  const [filter, setFilter] = useState('All')
  const [meditationTimer, setMeditationTimer] = useState({
    isActive: false,
    timeLeft: 180, // 3 minutes in seconds
    isPaused: false
  })

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [meditationAudio, setMeditationAudio] = useState(null)

  // Meditation timer functions
  useEffect(() => {
    let interval = null
    if (meditationTimer.isActive && !meditationTimer.isPaused && meditationTimer.timeLeft > 0) {
      interval = setInterval(() => {
        setMeditationTimer(timer => ({
          ...timer,
          timeLeft: timer.timeLeft - 1
        }))
      }, 1000)
    } else if (meditationTimer.timeLeft === 0) {
      // Timer finished
      setMeditationTimer({
        isActive: false,
        timeLeft: 180,
        isPaused: false
      })
      if (meditationAudio) {
        meditationAudio.pause()
        meditationAudio.currentTime = 0
      }
      alert('🎉 Meditation session completed! Great job!')
    }
    return () => clearInterval(interval)
  }, [meditationTimer.isActive, meditationTimer.isPaused, meditationTimer.timeLeft, meditationAudio])

  const startMeditation = () => {
    setMeditationTimer(prev => ({ ...prev, isActive: true, isPaused: false }))
    
    // Create and play meditation audio
    const audio = new Audio('/audio/meditation-bell.mp3')
    audio.loop = true
    audio.volume = 0.3
    audio.play().catch(e => console.log('Audio play failed:', e))
    setMeditationAudio(audio)
  }

  const pauseMeditation = () => {
    setMeditationTimer(prev => ({ ...prev, isPaused: !prev.isPaused }))
    if (meditationAudio) {
      if (meditationTimer.isPaused) {
        meditationAudio.play()
      } else {
        meditationAudio.pause()
      }
    }
  }

  const stopMeditation = () => {
    setMeditationTimer({
      isActive: false,
      timeLeft: 180,
      isPaused: false
    })
    if (meditationAudio) {
      meditationAudio.pause()
      meditationAudio.currentTime = 0
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.selfHelp}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.iconContainer}>
              <div className={styles.selfHelpIcon}>
                <span>🧘‍♀️</span>
              </div>
        </div>
            <div className={styles.titleSection}>
              <h1 className={styles.title}>Self-Help Center</h1>
              <p className={styles.subtitle}>
                Your personal wellness toolkit with guided exercises, calming sounds, and helpful resources to support your mental health journey.
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Hero Section - Quick Meditation & Calming Sounds */}
          <div className={styles.heroSection}>
            {/* Quick Meditation */}
            <section className={`${styles.section} ${styles.quickMeditation}`}>
              <div className={styles.meditationHeader}>
                <div className={styles.meditationIcon}>🧘‍♂️</div>
                <h2 className={styles.sectionTitle}>Quick Meditation</h2>
                <div className={styles.meditationDuration}>3 minutes</div>
              </div>
              
              <div className={styles.meditationContent}>
                <div className={styles.meditationSteps}>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>1</span>
                    <span>Inhale slowly through nose (4s)</span>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>2</span>
                    <span>Hold breath (4s)</span>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>3</span>
                    <span>Exhale gently through mouth (6s)</span>
                  </div>
                  <div className={styles.step}>
                    <span className={styles.stepNumber}>4</span>
                    <span>Repeat for 10 breaths</span>
                  </div>
                </div>

                {meditationTimer.isActive ? (
                  <div className={styles.meditationTimer}>
                    <div className={styles.timerDisplay}>
                      <div className={styles.timeLeft}>{formatTime(meditationTimer.timeLeft)}</div>
                      <div className={styles.timerLabel}>
                        {meditationTimer.isPaused ? '⏸️ Paused' : '🧘‍♀️ Meditating'}
                      </div>
                    </div>
                    <div className={styles.timerControls}>
                      <button 
                        className={styles.timerButton}
                        onClick={pauseMeditation}
                      >
                        {meditationTimer.isPaused ? '▶️ Resume' : '⏸️ Pause'}
                      </button>
                      <button 
                        className={styles.timerButton}
                        onClick={stopMeditation}
                      >
                        ⏹️ Stop
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className={styles.meditationButton}
                    onClick={startMeditation}
                  >
                    <span className={styles.buttonIcon}>🕐</span>
                    Start 3-minute session
                  </button>
                )}
              </div>
            </section>

            {/* Calming Sounds */}
            <section className={`${styles.section} ${styles.calmingSounds}`}>
              <div className={styles.soundsHeader}>
                <div className={styles.soundsIcon}>🎵</div>
                <h2 className={styles.sectionTitle}>Calming Sounds</h2>
              </div>
              
              <div className={styles.soundGrid}>
                {sounds.map(s => (
                  <div key={s.id} className={styles.soundCard}>
                    <div className={styles.soundIcon}>{s.icon}</div>
                    <div className={styles.soundInfo}>
                      <div className={styles.soundTitle}>{s.title}</div>
                      <audio 
                        controls 
                        loop
                        src={s.url} 
                        className={styles.audioPlayer}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Self Help Library */}
          <section className={`${styles.section} ${styles.videoLibrary}`}>
            <div className={styles.libraryHeader}>
              <div className={styles.libraryIcon}>🎥</div>
              <h2 className={styles.sectionTitle}>Self Help Library</h2>
              <p className={styles.librarySubtitle}>Guided videos for your wellness journey</p>
            </div>
            
            <div className={styles.videoGrid}>
              {videos.map(v => (
                <div key={v.id} className={styles.videoCard}>
                  <div className={styles.videoIcon}>{v.icon}</div>
                  <div className={styles.videoContent}>
                    <h3 className={styles.videoTitle}>{v.title}</h3>
                    <div className={styles.videoTag}>{v.tag}</div>
                    <button 
                      className={styles.videoButton}
                      onClick={()=>setActiveVideo(v)}
                    >
                      <span>▶️</span>
                      Open Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Counselor's Corner */}
          <section className={`${styles.section} ${styles.counselorsCorner}`}>
            <div className={styles.cornerHeader}>
              <div className={styles.cornerIcon}>👨‍⚕️</div>
              <div className={styles.cornerTitleSection}>
                <h2 className={styles.sectionTitle}>Counselor's Corner</h2>
                <p className={styles.cornerSubtitle}>Recommended by Certified Psychologists</p>
              </div>
            </div>
            
            <div className={styles.recommendedVideos}>
              {counselorRecommendedVideos.map(video => (
                <div key={video.id} className={styles.recommendedVideoCard}>
                  <div className={styles.videoHeader}>
                    <div className={styles.videoIcon}>{video.icon}</div>
                    <div className={styles.videoInfo}>
                      <h3 className={styles.videoTitle}>{video.title}</h3>
                      <p className={styles.videoDescription}>{video.description}</p>
                      <div className={styles.videoCategory}>{video.category}</div>
                    </div>
                  </div>
                  <button 
                    className={styles.watchButton}
                    onClick={() => setActiveVideo({
                      ...video,
                      title: video.title,
                      yt: video.isPlaylist ? video.playlistId : video.yt,
                      isPlaylist: video.isPlaylist
                    })}
                  >
                    <span>🎥</span>
                    Watch {video.isPlaylist ? 'Playlist' : 'Video'}
                  </button>
            </div>
          ))}
        </div>
      </section>

          {/* Additional Resources */}
          <div className={styles.resourcesRow}>
            {/* Sleep Tips */}
            <section className={`${styles.section} ${styles.sleepTips}`}>
              <div className={styles.tipsHeader}>
                <div className={styles.tipsIcon}>😴</div>
                <h2 className={styles.sectionTitle}>Sleep Hygiene</h2>
              </div>
              
              <div className={styles.tipsList}>
                <ul>
                  {sleepTips.map((tip,i)=>(
                    <li key={i} className={styles.tipItem}>
                      <span className={styles.tipBullet}>•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Gratitude Journal */}
            <section className={`${styles.section} ${styles.gratitudeJournal}`}>
              <div className={styles.journalHeader}>
                <div className={styles.journalIcon}>📔</div>
                <h2 className={styles.sectionTitle}>Gratitude Journal</h2>
              </div>
              
              <p className={styles.journalDescription}>
                Take a moment to reflect on the positive moments in your day. Answer three simple questions to cultivate gratitude and improve your mental well-being.
              </p>
              
              <Link to="/student/gratitude-journal" className={styles.journalButton}>
                <span className={styles.buttonIcon}>✨</span>
                Start Gratitude Journal
              </Link>
            </section>
          </div>
        </main>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className={styles.modalBackdrop} onClick={()=>setActiveVideo(null)}>
          <div className={styles.modal} onClick={e=>e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{activeVideo.title}</h3>
              <button 
                className={styles.closeButton}
                onClick={()=>setActiveVideo(null)}
              >
                ✕ Close
              </button>
            </div>
            <div className={styles.videoContainer}>
              {activeVideo.mp4 ? (
                <video
                  controls
                  playsInline
                  className={styles.videoPlayer}
                >
                  <source src={activeVideo.mp4} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : activeVideo.isPlaylist ? (
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${activeVideo.yt}&rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1`}
                  className={styles.videoPlayer}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <iframe
                  title={activeVideo.title}
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.yt}?rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1&autoplay=1`}
                  className={styles.videoPlayer}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


