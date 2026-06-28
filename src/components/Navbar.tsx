import { useState, useEffect } from 'react';
import { Search, Sun, Moon, HelpCircle, Command, X } from 'lucide-react';
import { getCompanyData } from '../services/agentEngine';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  hasActiveAnalysis: boolean;
  activeTicker: string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onSearch: (ticker: string) => void;
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  hasActiveAnalysis,
  activeTicker,
  theme,
  toggleTheme,
  onSearch,
  user,
  onLogout
}: NavbarProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; ticker: string; logo: string }[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update autocomplete recommendations
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setSuggestions(getCompanyData(searchQuery));
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (ticker: string) => {
    onSearch(ticker);
    setSearchQuery('');
    setSuggestions([]);
    setShowCommandPalette(false);
  };

  return (
    <>
      <nav className="floating-navbar">
        {/* Brand Logo */}
        <div 
          className="flex-center" 
          style={{ gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => setCurrentTab('landing')}
        >
          <span style={{ fontSize: '1.75rem', animation: 'float 3s infinite ease-in-out' }}>📈</span>
          <div>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              fontFamily: 'var(--font-title)', 
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>AlphaBoard AI</span>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>COMMITTEE RESEARCH</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="glass-button" 
            style={{ 
              background: currentTab === 'landing' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: currentTab === 'landing' ? 'var(--color-primary)' : 'transparent',
              padding: '0.5rem 1rem',
              fontSize: '0.88rem'
            }}
            onClick={() => setCurrentTab('landing')}
          >
            Search
          </button>
          
          <button 
            className="glass-button"
            disabled={!hasActiveAnalysis}
            style={{ 
              background: currentTab === 'dashboard' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: currentTab === 'dashboard' ? 'var(--color-primary)' : 'transparent',
              padding: '0.5rem 1rem',
              fontSize: '0.88rem'
            }}
            onClick={() => setCurrentTab('dashboard')}
          >
            Terminal {activeTicker ? `(${activeTicker})` : ''}
          </button>
          
          <button 
            className="glass-button"
            style={{ 
              background: currentTab === 'compare' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: currentTab === 'compare' ? 'var(--color-primary)' : 'transparent',
              padding: '0.5rem 1rem',
              fontSize: '0.88rem'
            }}
            onClick={() => setCurrentTab('compare')}
          >
            Compare
          </button>
          
          <button 
            className="glass-button"
            style={{ 
              background: currentTab === 'portfolio' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              borderColor: currentTab === 'portfolio' ? 'var(--color-primary)' : 'transparent',
              padding: '0.5rem 1rem',
              fontSize: '0.88rem'
            }}
            onClick={() => setCurrentTab('portfolio')}
          >
            Portfolio Allocator
          </button>
        </div>

        {/* Right side controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Quick search input helper */}
          <div 
            className="glass-panel flex-between" 
            style={{ 
              padding: '0.4rem 0.75rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              gap: '1rem',
              background: 'rgba(0, 0, 0, 0.2)'
            }}
            onClick={() => setShowCommandPalette(true)}
          >
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Quick Search</span>
            <div className="flex-center" style={{ 
              gap: '0.15rem', 
              fontSize: '0.75rem', 
              background: 'var(--border-medium)', 
              padding: '0.1rem 0.35rem', 
              borderRadius: '4px',
              color: 'var(--text-secondary)'
            }}>
              <Command size={10} />
              <span>K</span>
            </div>
          </div>

          {/* Shortcut guide indicator */}
          <button 
            className="glass-button" 
            style={{ padding: '0.5rem', borderRadius: '50%', background: 'transparent', borderColor: 'transparent' }}
            onClick={() => setShowShortcuts(true)}
            title="Keyboard Shortcuts Guide"
          >
            <HelpCircle size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>

          {/* Theme Selector Toggle */}
          <button 
            className="glass-button" 
            style={{ padding: '0.5rem', borderRadius: '50%', background: 'transparent', borderColor: 'transparent' }}
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun size={18} style={{ color: 'var(--text-secondary)' }} />
            ) : (
              <Moon size={18} style={{ color: 'var(--text-secondary)' }} />
            )}
          </button>

          {/* User Profile Badge & Dropdown */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button 
                className="glass-button"
                style={{ 
                  padding: '0.4rem 0.88rem', 
                  gap: '0.5rem', 
                  background: 'rgba(99, 102, 241, 0.05)', 
                  borderColor: 'var(--color-primary)' 
                }}
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  background: 'var(--color-primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.7rem', 
                  fontWeight: 700, 
                  color: 'white' 
                }}>
                  {user.name.substring(0, 2).toUpperCase()}
                </div>
                <span style={{ 
                  fontSize: '0.82rem', 
                  maxWidth: '80px', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {user.name}
                </span>
              </button>
              
              {showUserDropdown && (
                <div className="glass-panel animate-fade-in" style={{ 
                  position: 'absolute', 
                  top: '115%', 
                  right: 0, 
                  width: '160px', 
                  padding: '0.35rem', 
                  borderRadius: '8px', 
                  zIndex: 100, 
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)', 
                  background: 'var(--bg-secondary)' 
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-light)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Logged in as <br /><strong style={{ overflowWrap: 'break-word' }}>{user.email}</strong>
                  </div>
                  <button 
                    className="glass-button" 
                    style={{ width: '100%', border: 'none', background: 'transparent', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => { setCurrentTab('portfolio'); setShowUserDropdown(false); }}
                  >
                    My Allocations
                  </button>
                  <button 
                    className="glass-button" 
                    style={{ width: '100%', border: 'none', background: 'transparent', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.8rem', color: 'var(--color-sell)' }}
                    onClick={() => { onLogout(); setShowUserDropdown(false); }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              className="glass-button glass-button-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.82rem', borderRadius: '8px' }}
              onClick={() => setCurrentTab('auth')}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="command-palette-overlay" onClick={() => setShowCommandPalette(false)}>
          <div className="command-palette-box" onClick={e => e.stopPropagation()}>
            <div className="flex-between" style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <div className="flex-center" style={{ gap: '0.5rem', width: '100%' }}>
                <Search size={18} style={{ color: 'var(--color-primary)' }} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search assets, sectors, or tickers... (e.g. AAPL, Tesla)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    width: '100%',
                    fontFamily: 'var(--font-sans)'
                  }}
                />
              </div>
              <button 
                onClick={() => setShowCommandPalette(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {suggestions.length > 0 ? (
                suggestions.map(s => (
                  <div 
                    key={s.ticker} 
                    className="search-suggestion-item"
                    onClick={() => handleSuggestionClick(s.ticker)}
                  >
                    <div className="flex-center" style={{ gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{s.logo}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--text-primary)' }}>{s.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.ticker}</div>
                      </div>
                    </div>
                    <span className="badge badge-pass" style={{ fontSize: '0.7rem' }}>Analyze</span>
                  </div>
                ))
              ) : searchQuery.trim().length > 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No default match found. Press Enter to research custom company <strong>"{searchQuery}"</strong>.
                  <div style={{ marginTop: '1rem' }}>
                    <button 
                      className="glass-button glass-button-primary"
                      onClick={() => handleSuggestionClick(searchQuery)}
                    >
                      Run Custom Research Pipeline
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Recommendations</div>
                  {['AAPL', 'TSLA', 'MSFT', 'NVDA'].map(t => {
                    const company = getCompanyData(t)[0];
                    if (!company) return null;
                    return (
                      <div 
                        key={t} 
                        className="search-suggestion-item"
                        onClick={() => handleSuggestionClick(t)}
                      >
                        <div className="flex-center" style={{ gap: '0.75rem' }}>
                          <span style={{ fontSize: '1rem' }}>{company.logo}</span>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{company.name}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{company.ticker}</span>
                          </div>
                        </div>
                        <span className="badge badge-buy" style={{ fontSize: '0.7rem' }}>92% Score</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex-between" style={{ padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.1)', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Use arrow keys to navigate, Esc to close</span>
              <span>Select Ticker and click Analyze</span>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Guide Modal */}
      {showShortcuts && (
        <div className="command-palette-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="command-palette-box animate-slide-up" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="flex-between" style={{ padding: '1rem', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-title)' }}>Keyboard Shortcuts Reference</span>
              <button 
                onClick={() => setShowShortcuts(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Toggle Search Command Palette</span>
                <span className="mono-font" style={{ background: 'var(--border-medium)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Ctrl+K / ⌘+K</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Close Modal Overlay</span>
                <span className="mono-font" style={{ background: 'var(--border-medium)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Esc</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Cycle Dashboard Sidebar Tabs</span>
                <span className="mono-font" style={{ background: 'var(--border-medium)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Tab / Shift+Tab</span>
              </div>
              <div className="flex-between">
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Switch View Panels</span>
                <span className="mono-font" style={{ background: 'var(--border-medium)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>Alt + [1-4]</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
