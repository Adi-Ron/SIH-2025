import { useEffect, useMemo, useState } from 'react'
import styles from './Assessment.module.scss'

// Test configurations
const availableTests = [
  {
    id: 'phq',
    name: 'PHQ-9 Depression Screening',
    description: 'Assesses symptoms of depression over the past 2 weeks',
    icon: '😔',
    duration: '3-5 minutes',
    questions: 9,
    purpose: 'Identify depression symptoms and severity levels',
    benefits: 'Early detection, treatment planning, progress tracking'
  },
  {
    id: 'gad',
    name: 'GAD-7 Anxiety Assessment',
    description: 'Evaluates generalized anxiety disorder symptoms',
    icon: '😰',
    duration: '2-3 minutes',
    questions: 7,
    purpose: 'Screen for anxiety disorders and measure severity',
    benefits: 'Anxiety management, stress reduction strategies'
  },
  {
    id: 'ghq',
    name: 'GHQ-12 General Health',
    description: 'General psychological distress and well-being',
    icon: '🧠',
    duration: '4-6 minutes',
    questions: 12,
    purpose: 'Overall mental health and psychological well-being',
    benefits: 'Holistic health assessment, lifestyle recommendations'
  },
  {
    id: 'all',
    name: 'Complete Mental Health Assessment',
    description: 'Comprehensive evaluation combining all assessments',
    icon: '🎯',
    duration: '10-15 minutes',
    questions: 28,
    purpose: 'Full mental health screening and comprehensive analysis',
    benefits: 'Complete mental health picture, personalized recommendations'
  }
]

// Questions data
const phqQuestions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself - or that you are a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly or being fidgety/restless',
  'Thoughts that you would be better off dead or of hurting yourself'
]

const gadQuestions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
]

const ghqQuestions = [
  'Been able to concentrate on whatever you\'re doing?',
  'Lost much sleep over worry?',
  'Felt that you are playing a useful part in things?',
  'Felt capable of making decisions about things?',
  'Felt constantly under strain?',
  'Felt you couldn\'t overcome your difficulties?',
  'Been able to enjoy your normal day-to-day activities?',
  'Been able to face up to your problems?',
  'Been feeling unhappy and depressed?',
  'Been losing confidence in yourself?',
  'Been thinking of yourself as a worthless person?',
  'Felt reasonably happy, all things considered?'
]

export function Assessment() {
  const [currentView, setCurrentView] = useState('overview') // 'overview', 'test', 'results'
  const [selectedTest, setSelectedTest] = useState(null)
  const [testMode, setTestMode] = useState('all')

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Test state
  const [phq, setPhq] = useState(Array(phqQuestions.length).fill(0))
  const [gad, setGad] = useState(Array(gadQuestions.length).fill(0))
  const [ghq, setGhq] = useState(Array(ghqQuestions.length).fill(0))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [testCompleted, setTestCompleted] = useState(false)

  // Build question queue based on selected test
  const questionQueue = useMemo(() => {
    const phqQ = phqQuestions.map((q, i) => ({ type: 'phq', text: q, idx: i }))
    const gadQ = gadQuestions.map((q, i) => ({ type: 'gad', text: q, idx: i }))
    const ghqQ = ghqQuestions.map((q, i) => ({ type: 'ghq', text: q, idx: i }))
    
    if (testMode === 'phq') return phqQ
    if (testMode === 'gad') return gadQ
    if (testMode === 'ghq') return ghqQ
    
    // For 'all' mode, mix and shuffle
    const merged = [...phqQ, ...gadQ, ...ghqQ]
    for (let i = merged.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[merged[i], merged[j]] = [merged[j], merged[i]]
    }
    return merged
  }, [testMode])

  const totalQuestions = questionQueue.length
  const currentQ = questionQueue[currentQuestion]

  // Calculate scores
  const scores = useMemo(() => {
    const phqScore = phq.reduce((a, b) => a + b, 0)
    const gadScore = gad.reduce((a, b) => a + b, 0)
    const ghqScore = ghq.reduce((a, b) => a + b, 0)
    const totalScore = phqScore + gadScore + ghqScore
    
    return { phqScore, gadScore, ghqScore, totalScore }
  }, [phq, gad, ghq])

  // Test interpretation
  const interpretation = useMemo(() => {
    const { phqScore, gadScore, ghqScore, totalScore } = scores
    
    const phqLevel = phqScore >= 20 ? 'severe' : phqScore >= 15 ? 'moderately severe' : 
                    phqScore >= 10 ? 'moderate' : phqScore >= 5 ? 'mild' : 'minimal'
    
    const gadLevel = gadScore >= 15 ? 'severe' : gadScore >= 10 ? 'moderate' : 
                    gadScore >= 5 ? 'mild' : 'minimal'
    
    const ghqLevel = ghqScore >= 20 ? 'high distress' : ghqScore >= 12 ? 'moderate distress' : 
                    ghqScore >= 4 ? 'low distress' : 'minimal distress'
    
    const overallRisk = totalScore >= 35 ? 'high' : totalScore >= 20 ? 'moderate' : 'low'
    
    return { phqLevel, gadLevel, ghqLevel, overallRisk }
  }, [scores])

  const handleStartTest = (testId) => {
    setSelectedTest(availableTests.find(t => t.id === testId))
    setTestMode(testId)
    setCurrentView('test')
    setCurrentQuestion(0)
    // Reset all answers
    setPhq(Array(phqQuestions.length).fill(0))
    setGad(Array(gadQuestions.length).fill(0))
    setGhq(Array(ghqQuestions.length).fill(0))
    setTestCompleted(false)
  }

  const handleAnswer = (value) => {
    if (currentQ.type === 'phq') {
      setPhq(prev => { const newArr = [...prev]; newArr[currentQ.idx] = value; return newArr })
    } else if (currentQ.type === 'gad') {
      setGad(prev => { const newArr = [...prev]; newArr[currentQ.idx] = value; return newArr })
    } else {
      setGhq(prev => { const newArr = [...prev]; newArr[currentQ.idx] = value; return newArr })
    }
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setTestCompleted(true)
      setCurrentView('results')
      
      // Save assessment results to localStorage for dashboard integration
      try {
        const results = {
          phqScore: scores.phqScore,
          gadScore: scores.gadScore,
          ghqScore: scores.ghqScore,
          totalScore: scores.totalScore,
          interpretation: interpretation,
          testMode: testMode,
          completedAt: new Date().toISOString()
        };
        
        localStorage.setItem('lastAssessmentResults', JSON.stringify(results));
        localStorage.setItem('lastAssessmentDate', new Date().toISOString());
        
        // Trigger storage event for dashboard to update
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'lastAssessmentResults',
          newValue: JSON.stringify(results)
        }));
      } catch (error) {
        console.error('Error saving assessment results:', error);
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const getCurrentAnswer = () => {
    if (currentQ.type === 'phq') return phq[currentQ.idx]
    if (currentQ.type === 'gad') return gad[currentQ.idx]
    return ghq[currentQ.idx]
  }

  const getProgress = () => {
    return Math.round(((currentQuestion + 1) / totalQuestions) * 100)
  }

  // Overview View
  if (currentView === 'overview') {
    return (
      <div className={styles.assessment}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>🧠</div>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>Mental Health Assessment</h1>
                <p className={styles.subtitle}>
                  Take scientifically validated assessments to understand your mental health and get personalized insights.
                </p>
              </div>
            </div>
          </header>

          <main className={styles.mainContent}>
            <div className={styles.testsGrid}>
              {availableTests.map(test => (
                <div key={test.id} className={styles.testCard}>
                  <div className={styles.testHeader}>
                    <div className={styles.testIcon}>{test.icon}</div>
                    <div className={styles.testInfo}>
                      <h3 className={styles.testName}>{test.name}</h3>
                      <div className={styles.testMeta}>
                        <span className={styles.testDuration}>⏱️ {test.duration}</span>
                        <span className={styles.testQuestions}>📝 {test.questions} questions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.testDescription}>
                    <p>{test.description}</p>
                  </div>

                  <div className={styles.testDetails}>
                    <div className={styles.testDetail}>
                      <strong>Purpose:</strong> {test.purpose}
                    </div>
                    <div className={styles.testDetail}>
                      <strong>Benefits:</strong> {test.benefits}
                    </div>
                  </div>

                  <button 
                    className={styles.startButton}
                    onClick={() => handleStartTest(test.id)}
                  >
                    <span className={styles.buttonIcon}>🚀</span>
                    Start Assessment
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.assessmentInfo}>
              <div className={styles.infoCard}>
                <h3>🔒 Privacy & Confidentiality</h3>
                <p>Your responses are completely anonymous and stored securely. Results are for your personal insight only.</p>
              </div>
              <div className={styles.infoCard}>
                <h3>📊 Scientific Validity</h3>
                <p>All assessments are evidence-based tools used by mental health professionals worldwide.</p>
              </div>
              <div className={styles.infoCard}>
                <h3>💡 Personalized Insights</h3>
                <p>Receive detailed reports with actionable recommendations based on your results.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Test View
  if (currentView === 'test') {
    return (
      <div className={styles.assessment}>
        <div className={styles.container}>
          <header className={styles.testHeader}>
            <div className={styles.testHeaderContent}>
              <button 
                className={styles.backButton}
                onClick={() => setCurrentView('overview')}
              >
                ← Back to Tests
              </button>
              <div className={styles.testProgress}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <span className={styles.progressText}>
                  Question {currentQuestion + 1} of {totalQuestions}
                </span>
              </div>
            </div>
          </header>

          <main className={styles.testContent}>
            <div className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <div className={styles.questionType}>{currentQ.type.toUpperCase()}</div>
                <div className={styles.questionNumber}>
                  {currentQuestion + 1} / {totalQuestions}
                </div>
              </div>
              
              <div className={styles.questionText}>
                {currentQ.text}
              </div>

              <div className={styles.answerSection}>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={getCurrentAnswer()}
                  onChange={(e) => handleAnswer(Number(e.target.value))}
                  className={styles.answerSlider}
                />
                
                <div className={styles.answerLabels}>
                  <span>0 - Not at all</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3 - Nearly every day</span>
                </div>
                
                <div className={styles.selectedValue}>
                  Selected: <strong>{getCurrentAnswer()}</strong>
                </div>
              </div>

              <div className={styles.navigationButtons}>
                <button 
                  className={styles.navButton}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  ← Previous
                </button>
                <button 
                  className={`${styles.navButton} ${styles.primary}`}
                  onClick={handleNext}
                >
                  {currentQuestion === totalQuestions - 1 ? 'Complete Test' : 'Next →'}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Results View
  if (currentView === 'results') {
    const { phqLevel, gadLevel, ghqLevel, overallRisk } = interpretation
    const { phqScore, gadScore, ghqScore, totalScore } = scores

    return (
      <div className={styles.assessment}>
        <div className={styles.container}>
          <header className={styles.resultsHeader}>
            <div className={styles.resultsHeaderContent}>
              <button 
                className={styles.backButton}
                onClick={() => setCurrentView('overview')}
              >
                ← Back to Tests
              </button>
              <div className={styles.resultsTitle}>
                <h1>Assessment Results</h1>
                <p>Your {selectedTest.name} Report</p>
              </div>
            </div>
          </header>

          <main className={styles.resultsContent}>
            {/* Overall Risk Summary */}
            <div className={styles.riskSummary}>
              <div className={`${styles.riskCard} ${styles[overallRisk]}`}>
                <div className={styles.riskIcon}>
                  {overallRisk === 'high' ? '⚠️' : overallRisk === 'moderate' ? '⚡' : '✅'}
                </div>
                <div className={styles.riskContent}>
                  <h2>Overall Risk Level: {overallRisk.toUpperCase()}</h2>
                  <p>
                    {overallRisk === 'high' 
                      ? 'Your results suggest you may benefit from professional support. Consider reaching out to a mental health professional.'
                      : overallRisk === 'moderate'
                      ? 'Your results indicate some areas that may benefit from attention. Consider self-care strategies and monitoring.'
                      : 'Your results suggest good mental health. Continue maintaining your current wellness practices.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className={styles.scoresSection}>
              <h2>Detailed Assessment Results</h2>
              <div className={styles.scoresGrid}>
                {(testMode === 'phq' || testMode === 'all') && (
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreHeader}>
                      <span className={styles.scoreIcon}>😔</span>
                      <h3>PHQ-9 Depression</h3>
                    </div>
                    <div className={styles.scoreValue}>{phqScore}</div>
                    <div className={`${styles.scoreLevel} ${styles[phqLevel.replace(' ', '')]}`}>
                      {phqLevel.replace('ly', '').toUpperCase()}
                    </div>
                    <div className={styles.scoreDescription}>
                      {phqScore >= 20 ? 'Severe depression symptoms. Professional help recommended.'
                       : phqScore >= 15 ? 'Moderately severe symptoms. Consider professional support.'
                       : phqScore >= 10 ? 'Moderate depression symptoms. Self-care and monitoring recommended.'
                       : phqScore >= 5 ? 'Mild depression symptoms. Continue monitoring.'
                       : 'Minimal depression symptoms.'}
                    </div>
                  </div>
                )}

                {(testMode === 'gad' || testMode === 'all') && (
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreHeader}>
                      <span className={styles.scoreIcon}>😰</span>
                      <h3>GAD-7 Anxiety</h3>
                    </div>
                    <div className={styles.scoreValue}>{gadScore}</div>
                    <div className={`${styles.scoreLevel} ${styles[gadLevel.replace('ly', '')]}`}>
                      {gadLevel.replace('ly', '').toUpperCase()}
                    </div>
                    <div className={styles.scoreDescription}>
                      {gadScore >= 15 ? 'Severe anxiety symptoms. Professional help recommended.'
                       : gadScore >= 10 ? 'Moderate anxiety symptoms. Consider professional support.'
                       : gadScore >= 5 ? 'Mild anxiety symptoms. Stress management techniques recommended.'
                       : 'Minimal anxiety symptoms.'}
                    </div>
                  </div>
                )}

                {(testMode === 'ghq' || testMode === 'all') && (
                  <div className={styles.scoreCard}>
                    <div className={styles.scoreHeader}>
                      <span className={styles.scoreIcon}>🧠</span>
                      <h3>GHQ-12 General Health</h3>
                    </div>
                    <div className={styles.scoreValue}>{ghqScore}</div>
                    <div className={`${styles.scoreLevel} ${styles[ghqLevel.replace(' ', '')]}`}>
                      {ghqLevel.replace('distress', '').toUpperCase()}
                    </div>
                    <div className={styles.scoreDescription}>
                      {ghqScore >= 20 ? 'High psychological distress. Professional support recommended.'
                       : ghqScore >= 12 ? 'Moderate distress. Self-care and lifestyle improvements recommended.'
                       : ghqScore >= 4 ? 'Low distress. Continue current wellness practices.'
                       : 'Minimal distress. Good psychological well-being.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className={styles.recommendationsSection}>
              <h2>Personalized Recommendations</h2>
              <div className={styles.recommendationsGrid}>
                <div className={styles.recommendationCard}>
                  <div className={styles.recommendationIcon}>🧘‍♀️</div>
                  <h3>Self-Care Strategies</h3>
                  <ul>
                    <li>Practice mindfulness meditation daily</li>
                    <li>Maintain regular sleep schedule</li>
                    <li>Engage in physical activity</li>
                    <li>Connect with supportive friends and family</li>
                  </ul>
                </div>

                <div className={styles.recommendationCard}>
                  <div className={styles.recommendationIcon}>📚</div>
                  <h3>Resources</h3>
                  <ul>
                    <li>Use our Self-Help Center for guided exercises</li>
                    <li>Try our Calming Sounds for relaxation</li>
                    <li>Keep a Gratitude Journal</li>
                    <li>Access our Counselor's Corner for expert videos</li>
                  </ul>
                </div>

                <div className={styles.recommendationCard}>
                  <div className={styles.recommendationIcon}>👨‍⚕️</div>
                  <h3>Professional Support</h3>
                  <ul>
                    <li>Book a counseling session through our platform</li>
                    <li>Consider reaching out to campus mental health services</li>
                    <li>Speak with your primary care physician</li>
                    <li>Contact crisis support if needed</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button 
                className={styles.actionButton}
                onClick={() => setCurrentView('overview')}
              >
                Take Another Assessment
              </button>
              <button 
                className={`${styles.actionButton} ${styles.primary}`}
                onClick={() => window.location.href = '/student/self-help'}
              >
                Visit Self-Help Center
              </button>
              {overallRisk === 'high' && (
                <button 
                  className={`${styles.actionButton} ${styles.urgent}`}
                  onClick={() => window.location.href = '/student/crisis'}
                >
                  Crisis Support
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    )
  }

  return null
}