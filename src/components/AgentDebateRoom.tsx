import { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, MessageSquare, Terminal } from 'lucide-react';
import type { AgentMessage } from '../services/agentEngine';

interface AgentDebateRoomProps {
  messages: AgentMessage[];
}

export default function AgentDebateRoom({ messages }: AgentDebateRoomProps) {
  const [visibleMessages, setVisibleMessages] = useState<AgentMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingAgent, setTypingAgent] = useState('');

  // Reset and play when messages change
  useEffect(() => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsPlaying(true);
    setIsTyping(false);
  }, [messages]);

  // Debate streaming loop
  useEffect(() => {
    if (!isPlaying) return;
    if (currentIndex >= messages.length) {
      setIsTyping(false);
      return;
    }

    // Set typing state first
    const speakingAgent = messages[currentIndex];
    setIsTyping(true);
    setTypingAgent(speakingAgent.agentName);

    const typingDuration = 800 + Math.random() * 600;
    const timer = setTimeout(() => {
      setVisibleMessages(prev => [...prev, speakingAgent]);
      setIsTyping(false);
      setCurrentIndex(prev => prev + 1);
    }, typingDuration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, messages]);

  // Auto-scroll chat container
  useEffect(() => {
    const chatEl = document.getElementById('debate-scroll-area');
    if (chatEl) {
      chatEl.scrollTop = chatEl.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  const handleRestart = () => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', border: '1px solid var(--border-light)' }}>
      
      {/* Header bar controls */}
      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} style={{ color: 'var(--color-primary)' }} />
            <span>AI Committee Debate Room</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slack-style chat capturing arguments raised between nodes.</span>
        </div>
        
        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="glass-button" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            onClick={() => setIsPlaying(prev => !prev)}
            disabled={currentIndex >= messages.length}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          
          <button 
            className="glass-button" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            onClick={handleRestart}
          >
            <RefreshCw size={12} />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Slack messages area */}
      <div 
        id="debate-scroll-area"
        style={{ 
          height: '350px', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          paddingRight: '0.5rem',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '1rem'
        }}
      >
        {visibleMessages.map((msg, i) => {
          const isChairman = msg.agentId === 'chairman';
          return (
            <div 
              key={i} 
              className="chat-message-row"
              style={{
                background: isChairman ? 'rgba(99, 102, 241, 0.04)' : 'transparent',
                padding: isChairman ? '0.5rem 0.75rem' : '0',
                borderRadius: isChairman ? '8px' : '0'
              }}
            >
              <div 
                className="agent-avatar" 
                style={{ 
                  backgroundColor: msg.avatarColor || 'var(--color-primary)',
                  boxShadow: `0 0 10px ${msg.avatarColor}40`
                }}
              >
                {msg.agentName.substring(0, 2)}
              </div>
              <div className="chat-bubble" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                <div className="chat-header">
                  <span className="chat-author" style={{ color: 'var(--text-primary)' }}>{msg.agentName}</span>
                  <span className="badge" style={{ 
                    fontSize: '0.62rem', 
                    padding: '0.05rem 0.35rem', 
                    background: 'var(--bg-tertiary)', 
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-light)'
                  }}>
                    {msg.agentId === 'advocate' ? 'Devil\'s Advocate' : msg.agentId === 'bear' ? 'Downside Risk' : msg.agentId === 'bull' ? 'Upside Bull' : 'Committee Member'}
                  </span>
                  <span className="chat-timestamp">{msg.timestamp}</span>
                </div>
                <div className="chat-body" style={{ color: 'var(--text-secondary)' }}>
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="chat-message-row animate-pulse-glow" style={{ opacity: 0.8 }}>
            <div className="agent-avatar" style={{ backgroundColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
              ..
            </div>
            <div className="chat-bubble" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.85rem' }}>
              <div className="chat-header" style={{ marginBottom: 0 }}>
                <span className="chat-author" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {typingAgent} is contributing analysis...
                </span>
                <span className="flex-center" style={{ gap: '3px', marginLeft: '0.5rem' }}>
                  <span className="dot" style={{ width: '4px', height: '4px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'float 1s infinite' }}></span>
                  <span className="dot" style={{ width: '4px', height: '4px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'float 1s infinite 0.2s' }}></span>
                  <span className="dot" style={{ width: '4px', height: '4px', background: 'var(--text-muted)', borderRadius: '50%', display: 'inline-block', animation: 'float 1s infinite 0.4s' }}></span>
                </span>
              </div>
            </div>
          </div>
        )}

        {visibleMessages.length === 0 && !isTyping && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
            <span>Debate lobby quiet. Click Play to start stream.</span>
          </div>
        )}
      </div>

      {/* Footer console stats */}
      <div className="flex-between" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Terminal size={10} />
          <span>Active Debate stream: {currentIndex}/{messages.length} messages</span>
        </span>
        {currentIndex === messages.length && (
          <span style={{ color: 'var(--color-buy)', fontWeight: 600 }}>&bull; Debate Complete</span>
        )}
      </div>

    </div>
  );
}
