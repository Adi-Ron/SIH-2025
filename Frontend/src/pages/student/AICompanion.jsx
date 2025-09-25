import { useState, useRef, useEffect } from 'react';
import styles from './AICompanion.module.scss';
import { BOT_MESSAGES, detectLanguage, replyFor } from '../../components/chatbot/botMessages.js';
import { AIAPI } from '../../services/api.js';

export function AICompanion() {
  const [input, setInput] = useState('');
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: BOT_MESSAGES['en'].hello }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    
    setMessages(prev => [...prev, { id: prev.length + 1, from: 'you', text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const detected = detectLanguage(text) || lang;
      try {
        const ai = await AIAPI.chat({ messages: [{ role: 'user', content: text }], lang: detected });
        setLang(detected);
        setMessages(prev => [...prev, { id: prev.length + 1, from: 'bot', text: ai.reply }]);
      } catch {
        const fallback = replyFor(text, detected);
        setLang(detected);
        setMessages(prev => [...prev, { id: prev.length + 1, from: 'bot', text: fallback }]);
      }
      setIsTyping(false);
    }, 800);
  }

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    setMessages([{ id: 1, from: 'bot', text: BOT_MESSAGES[newLang].hello }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };


  return (
    <div className={styles.aiCompanion}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.botAvatar}>
            <span className={styles.botIcon}>🤖</span>
          </div>
          <div className={styles.botInfo}>
            <h1 className={styles.botName}>AI Companion</h1>
            <p className={styles.botStatus}>
              <span className={styles.onlineIndicator}></span>
              Always here to listen and support you
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <select value={lang} onChange={handleLangChange} className={styles.langSelect}>
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="bn">বাংলা</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
      </div>

      <div className={styles.chatContainer}>
        <div className={styles.messagesArea}>
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`${styles.messageGroup} ${message.from === 'you' ? styles.userMessage : styles.botMessage}`}
            >
              {message.from === 'bot' && (
                <div className={styles.messageAvatar}>
                  <span className={styles.avatarIcon}>🤖</span>
                </div>
              )}
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  {message.text}
                </div>
                <div className={styles.messageTime}>
                  {message.from === 'bot' ? 'AI Companion' : 'You'} • just now
                </div>
              </div>
              {message.from === 'you' && (
                <div className={styles.messageAvatar}>
                  <span className={styles.avatarIcon}>👤</span>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className={`${styles.messageGroup} ${styles.botMessage}`}>
              <div className={styles.messageAvatar}>
                <span className={styles.avatarIcon}>🤖</span>
              </div>
              <div className={styles.messageContent}>
                <div className={`${styles.messageBubble} ${styles.typingIndicator}`}>
                  <div className={styles.typingDots}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className={styles.typingText}>AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>


        <div className={styles.inputArea}>
          <div className={styles.inputContainer}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={BOT_MESSAGES[lang].placeholder || "Type your message..."}
              className={styles.messageInput}
              rows={1}
              disabled={isTyping}
            />
            <button 
              className={styles.sendButton} 
              onClick={send} 
              disabled={!input.trim() || isTyping}
            >
              <span className={styles.sendIcon}>📤</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

