import { useState, useEffect } from 'react';
import { Terminal, Code, BookOpen, Layers, Star, Milestone } from 'lucide-react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ResearchPipeline from './components/ResearchPipeline';
import CompanyDashboard from './components/CompanyDashboard';
import CompareMode from './components/CompareMode';
import PortfolioMode from './components/PortfolioMode';
import RecruiterMode from './components/RecruiterMode';
import DeveloperMode from './components/DeveloperMode';
import AuthPage from './components/AuthPage';
import PromptLibrary from './components/PromptLibrary';
import BuildJourney from './components/BuildJourney';
import { 
  getSavedWatchlist, toggleWatchlist 
} from './services/agentEngine';
import type { CompanyAnalysis, WatchlistItem } from './services/agentEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [dashboardTab, setDashboardTab] = useState<'research' | 'recruiter' | 'developer' | 'prompts' | 'journey'>('research');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  
  // Auth state
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  // Gemini API key state (stored in session memory only)
  const [apiKey, setApiKey] = useState<string>('');

  // Research state
  const [isResearching, setIsResearching] = useState(false);
  const [searchedCompany, setSearchedCompany] = useState('');
  const [analysisData, setAnalysisData] = useState<CompanyAnalysis | null>(null);
  
  // Watchlist & History state
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load history, watchlist, and user auth on init
  useEffect(() => {
    const history = localStorage.getItem('alphaboard_history');
    if (history) setRecentSearches(JSON.parse(history));
    
    const sessionUser = localStorage.getItem('alphaboard_user');
    if (sessionUser) setUser(JSON.parse(sessionUser));

    setWatchlist(getSavedWatchlist());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('alphaboard_user');
    setUser(null);
    setCurrentTab('landing');
  };

  const handleAuthSuccess = (authUser: { email: string; name: string }) => {
    localStorage.setItem('alphaboard_user', JSON.stringify(authUser));
    setUser(authUser);
    setCurrentTab('landing');
  };

  const handleGuestBypass = () => {
    setCurrentTab('landing');
  };

  const toggleAppTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    setSearchedCompany(query);
    setIsResearching(true);
    setCurrentTab('landing'); // Render pipeline loading overlay
  };

  const handleResearchComplete = (data: CompanyAnalysis) => {
    setIsResearching(false);
    setAnalysisData(data);
    
    // Add to history
    const updatedHistory = [data.ticker, ...recentSearches.filter(t => t !== data.ticker)].slice(0, 5);
    setRecentSearches(updatedHistory);
    localStorage.setItem('alphaboard_history', JSON.stringify(updatedHistory));
    
    // Redirect to terminal dashboard
    setCurrentTab('dashboard');
    setDashboardTab('research');
  };

  const handleToggleWatchlist = (ticker: string, name: string, price: number, rec: string) => {
    const updated = toggleWatchlist(ticker, name, price, rec);
    setWatchlist(updated);
  };

  // Render content depending on active tab
  const renderTabContent = () => {
    if (isResearching) {
      return (
        <ResearchPipeline 
          companyName={searchedCompany}
          apiKey={apiKey}
          onComplete={handleResearchComplete} 
        />
      );
    }

    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage 
            onSearch={handleSearch} 
            recentSearches={recentSearches} 
          />
        );
      case 'auth':
        return (
          <AuthPage 
            onAuthSuccess={handleAuthSuccess}
            onGuestBypass={handleGuestBypass}
          />
        );
      case 'compare':
        return <CompareMode />;
      case 'portfolio':
        return <PortfolioMode />;
      case 'dashboard':
        if (!analysisData) return null;
        
        // Renders dashboard view with side nav controls
        return (
          <div className="layout-container animate-fade-in">
            {/* Sticky Sidebar Nav */}
            <aside className="sidebar-nav">
              
              {/* Dashboard Sub Tab selectors */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '2rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Research Nodes</div>
                
                <button
                  className="glass-button"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: dashboardTab === 'research' ? 'var(--color-primary-glow)' : 'transparent',
                    color: dashboardTab === 'research' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    padding: '0.6rem 0.88rem'
                  }}
                  onClick={() => setDashboardTab('research')}
                >
                  <BookOpen size={14} style={{ marginRight: '0.5rem' }} />
                  <span>Consensus Terminal</span>
                </button>

                <button
                  className="glass-button"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: dashboardTab === 'recruiter' ? 'var(--color-primary-glow)' : 'transparent',
                    color: dashboardTab === 'recruiter' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    padding: '0.6rem 0.88rem'
                  }}
                  onClick={() => setDashboardTab('recruiter')}
                >
                  <Layers size={14} style={{ marginRight: '0.5rem' }} />
                  <span>LangGraph Nodes</span>
                </button>

                <button
                  className="glass-button"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: dashboardTab === 'developer' ? 'var(--color-primary-glow)' : 'transparent',
                    color: dashboardTab === 'developer' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    padding: '0.6rem 0.88rem'
                  }}
                  onClick={() => setDashboardTab('developer')}
                >
                  <Code size={14} style={{ marginRight: '0.5rem' }} />
                  <span>Developer Sandbox</span>
                </button>

                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', margin: '1rem 0 0.4rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Showcase</div>
                
                <button
                  className="glass-button"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: dashboardTab === 'prompts' ? 'var(--color-primary-glow)' : 'transparent',
                    color: dashboardTab === 'prompts' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    padding: '0.6rem 0.88rem'
                  }}
                  onClick={() => setDashboardTab('prompts')}
                >
                  <BookOpen size={14} style={{ marginRight: '0.5rem' }} />
                  <span>Prompt Library</span>
                </button>

                <button
                  className="glass-button"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    border: 'none',
                    background: dashboardTab === 'journey' ? 'var(--color-primary-glow)' : 'transparent',
                    color: dashboardTab === 'journey' ? 'var(--color-primary)' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    padding: '0.6rem 0.88rem'
                  }}
                  onClick={() => setDashboardTab('journey')}
                >
                  <Milestone size={14} style={{ marginRight: '0.5rem' }} />
                  <span>Build Journey</span>
                </button>
              </div>

              {/* Watchlist management panel */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Watchlist</span>
                  <button 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onClick={() => handleToggleWatchlist(analysisData.ticker, analysisData.name, analysisData.valuation.fairValue, analysisData.finalRecommendation)}
                    title={watchlist.find(w => w.ticker === analysisData.ticker) ? 'Remove active company' : 'Watch active company'}
                  >
                    <Star 
                      size={14} 
                      style={{ 
                        color: watchlist.find(w => w.ticker === analysisData.ticker) ? 'var(--color-hold)' : 'var(--text-muted)',
                        fill: watchlist.find(w => w.ticker === analysisData.ticker) ? 'var(--color-hold)' : 'none'
                      }} 
                    />
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {watchlist.map(item => (
                    <div 
                      key={item.ticker} 
                      className="glass-card flex-between" 
                      style={{ padding: '0.5rem 0.75rem', cursor: 'pointer', background: item.ticker === analysisData.ticker ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                      onClick={() => handleSearch(item.ticker)}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{item.ticker}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>${item.price}</div>
                      </div>
                      <span className={`badge ${item.recommendation.includes('BUY') ? 'badge-buy' : 'badge-sell'}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.35rem' }}>
                        {item.recommendation.replace('STRONG ', '')}
                      </span>
                    </div>
                  ))}
                  {watchlist.length === 0 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '1rem 0' }}>
                      No assets watched.
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Quick status indicator */}
              <div className="glass-card" style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.02)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                <div className="flex-center" style={{ gap: '0.4rem', justifyContent: 'flex-start', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                  <Terminal size={10} />
                  <span>ACTIVE RUNTIME</span>
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                  State nodes are fully compiled. DCF calculates correctly.
                </div>
              </div>

            </aside>

            {/* Main Content Pane */}
            <main className="main-content">
              {dashboardTab === 'research' && (
                <CompanyDashboard 
                  analysis={analysisData} 
                  onWhatIfUpdate={setAnalysisData} 
                />
              )}
              {dashboardTab === 'recruiter' && (
                <RecruiterMode 
                  nodes={analysisData.nodes} 
                />
              )}
              {dashboardTab === 'developer' && (
                <DeveloperMode 
                  analysisData={analysisData} 
                />
              )}
              {dashboardTab === 'prompts' && (
                <PromptLibrary 
                  analysisData={analysisData} 
                />
              )}
              {dashboardTab === 'journey' && (
                <BuildJourney />
              )}
            </main>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Navbar always visible at the top */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        hasActiveAnalysis={analysisData !== null}
        activeTicker={analysisData ? analysisData.ticker : ''}
        theme={theme}
        toggleTheme={toggleAppTheme}
        onSearch={handleSearch}
        user={user}
        onLogout={handleLogout}
        apiKey={apiKey}
        setApiKey={setApiKey}
      />
      
      {/* Main routing tab container */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {renderTabContent()}
      </div>
    </>
  );
}
