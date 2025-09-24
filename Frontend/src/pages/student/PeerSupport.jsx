import { useState, useEffect, useRef } from 'react'
import styles from './PeerSupport.module.scss'

const CHANNELS = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    description: 'Dealing with anxiety and panic',
    icon: '🌊',
    members: 23
  },
  {
    id: 'depression',
    name: 'Depression Support',
    description: 'Support for depression & low moods',
    icon: '🌱',
    members: 31
  },
  {
    id: 'stress',
    name: 'Stress & Overwhelm',
    description: 'Managing stress and pressure',
    icon: '⚡',
    members: 18
  },
  {
    id: 'sleep',
    name: 'Sleep Issues',
    description: 'Insomnia and sleep problems',
    icon: '🌙',
    members: 15
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Family, friends, dating support',
    icon: '💜',
    members: 27
  },
  {
    id: 'selfcare',
    name: 'Self-Care',
    description: 'Building healthy habits',
    icon: '🌸',
    members: 34
  },
  {
    id: 'general',
    name: 'General Support',
    description: 'Open discussions & check-ins',
    icon: '💬',
    members: 42
  }
]

const INITIAL_MESSAGES = {
  anxiety: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '2 hours ago',
      text: 'Had my first panic attack in months today. The breathing techniques we talked about here really helped me get through it. Thank you all for the support! 💙',
      reactions: [{ emoji: '💙', count: 5, reacted: false }, { emoji: '🫂', count: 3, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '1 hour ago',
      text: 'That\'s amazing! I\'m so proud of you for using those techniques. It shows how much you\'ve grown.',
      reactions: [{ emoji: '👏', count: 2, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '45 min ago',
      text: 'Does anyone else feel like their anxiety gets worse in the evening? I\'ve been struggling with this pattern lately.',
      reactions: [{ emoji: '🤝', count: 4, reacted: false }]
    },
    {
      id: 4,
      username: 'Anonymous',
      timestamp: '30 min ago',
      text: 'Yes! Evening anxiety is real. I find that dimming lights and doing some gentle stretching helps me transition into a calmer mindset.',
      reactions: [{ emoji: '✨', count: 2, reacted: false }]
    }
  ],
  depression: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '3 hours ago',
      text: 'Having one of those days where getting out of bed feels impossible. But I\'m here, I\'m trying, and that\'s something.',
      reactions: [{ emoji: '💪', count: 8, reacted: false }, { emoji: '🌟', count: 4, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '2 hours ago',
      text: 'Being here and sharing is huge. You\'re stronger than you know. Some days just showing up is enough. 🌻',
      reactions: [{ emoji: '🌻', count: 6, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '1 hour ago',
      text: 'Small wins today: I made my bed, had a shower, and texted a friend back. Celebrating the little things.',
      reactions: [{ emoji: '🎉', count: 7, reacted: false }, { emoji: '👏', count: 3, reacted: false }]
    }
  ],
  stress: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '4 hours ago',
      text: 'Finals week is crushing me. Between work and school, I feel like I\'m drowning. How do you all manage overwhelming schedules?',
      reactions: [{ emoji: '🫂', count: 6, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '3 hours ago',
      text: 'Break everything into tiny tasks. I use the Pomodoro technique - 25 min work, 5 min break. Makes huge tasks feel manageable!',
      reactions: [{ emoji: '💡', count: 4, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '2 hours ago',
      text: 'Remember: You can\'t pour from an empty cup. Schedule breaks like you schedule study time. You deserve rest! 🌈',
      reactions: [{ emoji: '🌈', count: 5, reacted: false }, { emoji: '💜', count: 3, reacted: false }]
    }
  ],
  sleep: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '5 hours ago',
      text: '3 AM again... My mind just won\'t shut off. Anyone else dealing with racing thoughts at bedtime?',
      reactions: [{ emoji: '😴', count: 7, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '4 hours ago',
      text: 'Try the 4-7-8 breathing technique! Breathe in for 4, hold for 7, out for 8. It really helps calm my mind.',
      reactions: [{ emoji: '🧘', count: 5, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '3 hours ago',
      text: 'I keep a notebook by my bed to write down worrying thoughts. Gets them out of my head so I can sleep.',
      reactions: [{ emoji: '📝', count: 4, reacted: false }]
    }
  ],
  relationships: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '2 hours ago',
      text: 'Setting boundaries with family is so hard but so necessary. Finally told my mom I need space to process things on my own timeline.',
      reactions: [{ emoji: '👏', count: 9, reacted: false }, { emoji: '💪', count: 4, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '1 hour ago',
      text: 'That takes real courage! Boundaries are acts of self-love, not selfishness. Proud of you! 💜',
      reactions: [{ emoji: '💜', count: 6, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '45 min ago',
      text: 'Learning that it\'s okay to outgrow friendships. Not every relationship is meant to last forever, and that\'s okay.',
      reactions: [{ emoji: '🌱', count: 5, reacted: false }]
    }
  ],
  selfcare: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '1 hour ago',
      text: 'Self-care Sunday! Made myself a nice breakfast, went for a walk, and I\'m about to start a new book. What\'s everyone doing for themselves today?',
      reactions: [{ emoji: '🌟', count: 8, reacted: false }, { emoji: '📚', count: 3, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '45 min ago',
      text: 'Face mask and tea while watching my comfort show. Sometimes the simplest things are the most healing. ☕',
      reactions: [{ emoji: '☕', count: 6, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '30 min ago',
      text: 'Started saying no to plans when I\'m feeling drained. It\'s not selfish - it\'s necessary. Learning to protect my energy! ⚡',
      reactions: [{ emoji: '⚡', count: 7, reacted: false }]
    }
  ],
  general: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '30 min ago',
      text: 'Just wanted to say thank you to this community. Having a safe space to share without judgment means everything. You all are amazing! 💙',
      reactions: [{ emoji: '💙', count: 15, reacted: false }, { emoji: '🤗', count: 8, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '20 min ago',
      text: 'Weekly reminder: Your feelings are valid, your struggles are real, and you deserve support. You\'re not alone in this journey. 🌈',
      reactions: [{ emoji: '🌈', count: 12, reacted: false }, { emoji: '💜', count: 7, reacted: false }]
    },
    {
      id: 3,
      username: 'Anonymous',
      timestamp: '10 min ago',
      text: 'Having a rough day but reading everyone\'s messages here reminds me that healing isn\'t linear. Tomorrow is a new day. 🌅',
      reactions: [{ emoji: '🌅', count: 9, reacted: false }, { emoji: '🫂', count: 5, reacted: false }]
    }
  ]
}

const COMMON_REACTIONS = ['💙', '🫂', '👏', '💪', '🌟', '❤️', '🤗', '✨']

export function PeerSupport() {
  const [activeChannel, setActiveChannel] = useState('general')
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [newMessage, setNewMessage] = useState('')
  const [showReactionPicker, setShowReactionPicker] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, activeChannel])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      username: 'Anonymous',
      timestamp: 'just now',
      text: newMessage,
      reactions: []
    }

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...prev[activeChannel], userMessage]
    }))

    setNewMessage('')
  }

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: prev[activeChannel].map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.emoji === emoji)
          if (existingReaction) {
            if (existingReaction.reacted) {
              // Remove reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, count: r.count - 1, reacted: false }
                    : r
                ).filter(r => r.count > 0)
              }
            } else {
              // Add reaction
              return {
                ...msg,
                reactions: msg.reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, count: r.count + 1, reacted: true }
                    : r
                )
              }
            }
          } else {
            // New reaction
            return {
              ...msg,
              reactions: [...msg.reactions, { emoji, count: 1, reacted: true }]
            }
          }
        }
        return msg
      })
    }))
    setShowReactionPicker(null)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const activeChannelData = CHANNELS.find(c => c.id === activeChannel)
  const currentMessages = messages[activeChannel] || []

  return (
    <div className={styles.peerSupport}>
      <div className={styles.header}>
        <h1>Peer Support Channels</h1>
        <p>Connect anonymously with others who understand your journey</p>
        <div className={styles.anonymousIndicator}>
          🔒 Your identity is protected - All conversations are anonymous
        </div>
      </div>

      <div className={styles.channelsContainer}>
        <div className={styles.channelsList}>
          <h3>
            <span>💬</span> Support Channels
          </h3>
          {CHANNELS.map(channel => (
            <div
              key={channel.id}
              className={`${styles.channelItem} ${activeChannel === channel.id ? styles.active : ''}`}
              onClick={() => setActiveChannel(channel.id)}
            >
              <div className={styles.channelIcon}>
                {channel.icon}
              </div>
              <div className={styles.channelInfo}>
                <div className={styles.channelName}>{channel.name}</div>
                <div className={styles.channelDesc}>{channel.description}</div>
                <div className={styles.memberCount}>{channel.members} members online</div>
              </div>
          </div>
        ))}
      </div>

        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>
              <span>{activeChannelData?.icon}</span>
              {activeChannelData?.name}
            </h3>
            <div className={styles.onlineStatus}>
              {activeChannelData?.members} members online
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {currentMessages.map(message => (
              <div key={message.id} className={styles.messageGroup}>
                <div className={styles.messageHeader}>
                  <div className={styles.avatar}>
                    A
                  </div>
                  <span className={styles.username}>Anonymous</span>
                  <span className={styles.timestamp}>{message.timestamp}</span>
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{message.text}</div>
                  <div className={styles.messageReactions}>
                    {message.reactions.map(reaction => (
                      <button
                        key={reaction.emoji}
                        className={`${styles.reaction} ${reaction.reacted ? styles.reacted : ''}`}
                        onClick={() => handleReaction(message.id, reaction.emoji)}
                      >
                        <span className={styles.emoji}>{reaction.emoji}</span>
                        <span className={styles.count}>{reaction.count}</span>
                      </button>
                    ))}
                    <button
                      className={styles.addReaction}
                      onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                    >
                      +
                    </button>
                    {showReactionPicker === message.id && (
                      <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        {COMMON_REACTIONS.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(message.id, emoji)}
                            style={{
                              background: 'rgba(255,255,255,0.1)',
                              border: 'none',
                              borderRadius: '15px',
                              padding: '5px 8px',
                              cursor: 'pointer',
                              fontSize: '1rem'
                            }}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.messageInput}>
            <div className={styles.inputContainer}>
              <textarea
                className={styles.textInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Share your thoughts in ${activeChannelData?.name}...`}
                rows={1}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <span>Send</span>
                <span>📤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}