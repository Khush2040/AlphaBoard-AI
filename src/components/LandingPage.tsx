import { useState, useEffect } from 'react';
import { Search, TrendingUp, Cpu, BarChart3, FileText } from 'lucide-react';
import { getCompanyData } from '../services/agentEngine';

interface LandingPageProps {
  onSearch: (ticker: string) => void;
  recentSearches: string[];
}

export default function LandingPage({ onSearch, recentSearches }: LandingPageProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; ticker: string; logo: string }[]>([]);
  const [typingText, setTypingText] = useState('investment advice.');
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  // Typing effect loop
  useEffect(() => {
    const textOptions = [
      'investment advice.',
      'just one LLM.',
      'financial guess-work.',
      'analyst reports.'
    ];
    let currentIndex = 0;
    let isDeleting = false;
    let text = '';
    let timer: any;

    const tick = () => {
      const fullText = textOptions[currentIndex];
      if (isDeleting) {
        text = fullText.substring(0, text.length - 1);
      } else {
        text = fullText.substring(0, text.length + 1);
      }

      setTypingText(text);

      let delta = 150 - Math.random() * 50;
      if (isDeleting) delta /= 2;

      if (!isDeleting && text === fullText) {
        delta = 2000; // Stay for 2s
        isDeleting = true;
      } else if (isDeleting && text === '') {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % textOptions.length;
        delta = 500;
      }

      timer = setTimeout(tick, delta);
    };

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, []);

  // Initialize background floating particles
  useEffect(() => {
    const generated = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 5
    }));
    setParticles(generated);
  }, []);

  // Sync autocomplete dropdown
  useEffect(() => {
    if (query.trim()) {
      setSuggestions(getCompanyData(query));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const trendingCompanies = [
    { ticker: 'AAPL', name: 'Apple Inc.', logo: '🍎', description: 'Re-evaluating spatial computing and client side edge-AI opportunities.', category: 'Consumer Tech' },
    { ticker: 'TSLA', name: 'Tesla Inc.', logo: '⚡', description: 'Restructuring core manufacturing alongside automated FSD growth projections.', category: 'Automotive / AI' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', logo: '💻', description: 'Expanding B2B productivity margins via Azure Copilot seats.', category: 'Systems SaaS' },
    { ticker: 'NVDA', name: 'Nvidia Corp.', logo: '🟢', description: 'Absolute hardware monopoly in high-compute datacenter accelerators.', category: 'Semiconductor' }
  ];

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden', padding: '100px 1.5rem 4rem' }}>
      {/* Dynamic Blobs */}
      <div className="gradient-blob blob-indigo"></div>
      <div className="gradient-blob blob-purple"></div>

      {/* Floating Particles Field */}
      <div className="particles-container">
        {particles.map(p => (
          <div 
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${12 + p.size * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="animate-slide-up" style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* Pitch Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.35rem 0.88rem', borderRadius: '99px', fontSize: '0.82rem', color: '#818cf8', fontWeight: 600, marginBottom: '2rem' }}>
          <span>💥</span>
          <span>INTRODUCING ALPHABOARD AI ENGINE</span>
        </div>

        {/* Hero Title */}
        <h1 style={{ 
          fontSize: '3.75rem', 
          fontFamily: 'var(--font-title)', 
          fontWeight: 800, 
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '1rem'
        }}>
          Don't Ask One AI. Ask an <br />
          <span className="hero-gradient-text">Entire Investment Committee.</span>
        </h1>

        {/* Dynamic Typing Subheading */}
        <div style={{ 
          fontSize: '1.25rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4rem',
          height: '1.8rem'
        }}>
          <span>Stop relying on</span>
          <span style={{ 
            color: 'var(--text-primary)', 
            fontWeight: 700, 
            borderRight: '2px solid var(--color-primary)', 
            paddingRight: '4px',
            fontFamily: 'var(--font-mono)'
          }}>
            {typingText}
          </span>
        </div>

        {/* Elegant Search Panel */}
        <form onSubmit={handleSubmit} style={{ position: 'relative', width: '100%', maxWidth: '650px', margin: '0 auto 1.5rem', zIndex: 10 }}>
          <div className="glass-panel" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0.5rem 0.5rem 0.5rem 1.25rem', 
            borderRadius: '14px', 
            gap: '0.75rem',
            background: 'rgba(10, 15, 30, 0.85)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px var(--color-primary-glow)',
            border: '1px solid var(--border-medium)'
          }}>
            <Search size={22} style={{ color: 'var(--color-primary)' }} />
            <input 
              type="text" 
              placeholder="Search companies, indices, or stock symbols... (e.g. Apple, TSLA, NVDA)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '1.05rem',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <button 
              type="submit" 
              className="glass-button glass-button-primary"
              style={{ padding: '0.75rem 1.75rem', borderRadius: '10px' }}
            >
              Analyze
            </button>
          </div>

          {/* Autocomplete Recommendation Dropdown */}
          {suggestions.length > 0 && (
            <div className="glass-panel" style={{ 
              position: 'absolute', 
              top: '110%', 
              left: 0, 
              right: 0, 
              borderRadius: '12px', 
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', 
              overflow: 'hidden', 
              textAlign: 'left',
              zIndex: 100
            }}>
              {suggestions.map(s => (
                <div 
                  key={s.ticker} 
                  className="search-suggestion-item"
                  onClick={() => onSearch(s.ticker)}
                >
                  <div className="flex-center" style={{ gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{s.logo}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.ticker}</div>
                    </div>
                  </div>
                  <span className="badge badge-buy" style={{ fontSize: '0.7rem' }}>Launch Committee</span>
                </div>
              ))}
            </div>
          )}
        </form>

        {/* Suggestion tags under search */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '4rem', fontSize: '0.85rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Try analyzing:</span>
          {['AAPL', 'TSLA', 'MSFT', 'NVDA'].map(t => (
            <button 
              key={t}
              onClick={() => onSearch(t)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                textDecoration: 'underline',
                textUnderlineOffset: '3px'
              }}
            >
              {t}
            </button>
          ))}
          
          {recentSearches.length > 0 && (
            <>
              <span style={{ color: 'var(--text-muted)', marginLeft: '1rem', borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>Recents:</span>
              {recentSearches.map(t => (
                <button
                  key={t}
                  onClick={() => onSearch(t)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-primary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px'
                  }}
                >
                  {t}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Statistics Ticker Panel */}
        <div className="grid-3 glass-panel" style={{ padding: '1.5rem', marginBottom: '5rem', background: 'rgba(8, 12, 24, 0.5)' }}>
          <div style={{ borderRight: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--color-primary)' }}>13</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Collaborating Agent Experts</div>
          </div>
          <div style={{ borderRight: '1px solid var(--border-light)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--color-secondary)' }}>20+</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ratios & Valuation Models Run</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-title)', color: 'var(--color-buy)' }}>&lt; 5s</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Average Full Consensus Latency</div>
          </div>
        </div>

        {/* Trending Analyses Title */}
        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={20} style={{ color: 'var(--color-primary)' }} />
            <span>Trending Research Opportunities</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Latest committee consensus reports generated in real time by the AlphaBoard ecosystem.</p>
        </div>

        {/* Company Card Grid */}
        <div className="grid-2" style={{ textAlign: 'left', marginBottom: '6rem' }}>
          {trendingCompanies.map(c => (
            <div 
              key={c.ticker}
              className="glass-panel glass-panel-hover glow-border-indigo" 
              style={{ padding: '1.5rem', cursor: 'pointer' }}
              onClick={() => onSearch(c.ticker)}
            >
              <div className="flex-between" style={{ marginBottom: '1rem' }}>
                <div className="flex-center" style={{ gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{c.logo}</span>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{c.name}</h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{c.ticker}</span>
                  </div>
                </div>
                <span className="badge badge-buy" style={{ fontSize: '0.75rem' }}>{c.category}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                {c.description}
              </p>
              <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Run consensus cycle</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Analyze &rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Features Summary Grid */}
        <div style={{ textAlign: 'left', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', marginBottom: '0.5rem' }}>Ecosystem Architecture</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>AlphaBoard replicates the workflow of standard hedge fund investment committees using specialized multi-agent architectures.</p>
          
          <div className="grid-3">
            <div className="glass-card">
              <Cpu size={24} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>13-Agent Graph Consensus</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Runs a decentralized LangGraph debate coordinating Bulls, Bears, Risk, and Valuation Analysts.</p>
            </div>
            <div className="glass-card">
              <BarChart3 size={24} style={{ color: 'var(--color-secondary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>What-If Simulation Ratios</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Modify global inflation, tax, and growth projections and watch DCF valuations adjust in real time.</p>
            </div>
            <div className="glass-card">
              <FileText size={24} style={{ color: 'var(--color-buy)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Export-Ready Memorandum</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Instantly compile agent nodes, tables, and red-flags into a fully formatted print-ready PDF memo.</p>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div style={{ textAlign: 'left', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-title)', marginBottom: '2.5rem', textAlign: 'center' }}>Trusted by Investment Committees</h2>
          <div className="grid-2">
            <div className="glass-card" style={{ fontStyle: 'italic', position: 'relative' }}>
              <span style={{ fontSize: '3rem', position: 'absolute', top: '-10px', left: '10px', opacity: 0.05 }}>“</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                "We used to spend weeks gathering data on peer multiples and conducting DCF stress runs. AlphaBoard compiles a complete investment memo and sparks debates in under ten seconds."
              </p>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>— Senior Portfolio Manager, Quantitative Capital</div>
            </div>
            <div className="glass-card" style={{ fontStyle: 'italic', position: 'relative' }}>
              <span style={{ fontSize: '3rem', position: 'absolute', top: '-10px', left: '10px', opacity: 0.05 }}>“</span>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', paddingLeft: '1.5rem' }}>
                "The what-if simulator is a game changer. Being able to dynamically update valuation recommendations under custom interest rate projections helps us model downside cases instantly."
              </p>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>— Director of Research, Sovereign Asset Alliance</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>
            <strong>AlphaBoard AI</strong> — Modern Multi-Agent Financial Terminals.
            <div style={{ marginTop: '0.25rem' }}>&copy; 2026 AlphaBoard Technologies. All rights reserved.</div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Regulatory Disclosures</span>
          </div>
        </div>

      </div>
    </div>
  );
}
