import { useState } from 'react';
import { 
  Building2, Calendar, Users, Globe, Landmark, Copy, Download, 
  Send, AlertTriangle, CheckCircle, FileText, Sparkles, BookOpen, Layers,
  ChevronDown, ChevronUp, TrendingUp
} from 'lucide-react';
import { recalculateUnderWhatIf } from '../services/agentEngine';
import type { CompanyAnalysis, WhatIfState } from '../services/agentEngine';
import InteractiveCharts from './InteractiveCharts';
import WhatIfSimulator from './WhatIfSimulator';
import AgentDebateRoom from './AgentDebateRoom';
import CommitteeVoting from './CommitteeVoting';

interface CompanyDashboardProps {
  analysis: CompanyAnalysis;
  onWhatIfUpdate: (updatedAnalysis: CompanyAnalysis) => void;
}

export default function CompanyDashboard({ analysis, onWhatIfUpdate }: CompanyDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'memo' | 'financials' | 'whatif' | 'debate' | 'peers' | 'risk'>('memo');
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [followUpResponse, setFollowUpResponse] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [explainExpanded, setExplainExpanded] = useState(false);

  // Recalculate based on What-If simulator callback
  const handleWhatIfRecalculate = (state: WhatIfState) => {
    const updated = recalculateUnderWhatIf(analysis, state);
    onWhatIfUpdate(updated);
  };

  // Follow-up question submission
  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim()) return;

    setIsAnswering(true);
    setFollowUpResponse('');

    setTimeout(() => {
      setIsAnswering(false);
      let reply = `Based on the compiled committee reports, the risk factors you mention are mitigated. ${analysis.ticker} holds a cash balance of $${analysis.metrics.cash}B, giving them massive leverage.`;
      
      if (followUpQuery.toLowerCase().includes('ceo') || followUpQuery.toLowerCase().includes('musk')) {
        reply = `The Risk Officer notes that key-person risk for CEO leadership is monitored closely. The board holds succession structures, though a sudden change would introduce short-term volatility.`;
      } else if (followUpQuery.toLowerCase().includes('dcf') || followUpQuery.toLowerCase().includes('value')) {
        reply = `Our DCF model uses a WACC of 8.5% and terminal growth of 2.5%. Stress-testing under higher interest rates alters the discount factor but the intrinsic value margin of safety remains positive.`;
      } else if (followUpQuery.toLowerCase().includes('competit')) {
        reply = `The Competition Analyst has evaluated their moat score at ${analysis.moatScore}/100. High switching costs and proprietary R&D maintain a multi-year lead over close peers.`;
      }

      setFollowUpResponse(reply);
    }, 1000);
  };

  // Copy Summary text
  const handleCopySummary = () => {
    navigator.clipboard.writeText(analysis.memo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print triggered layout
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview Header Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', border: '1px solid var(--border-medium)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          {/* Logo & Basic Metadata */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span style={{ fontSize: '3rem', animation: 'float 4s infinite ease-in-out' }}>{analysis.logo}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)' }}>{analysis.name}</h1>
                <span className="mono-font" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', background: 'var(--border-light)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                  {analysis.ticker}
                </span>
                <span className={`badge ${analysis.finalRecommendation.includes('BUY') ? 'badge-buy' : analysis.finalRecommendation.includes('SELL') ? 'badge-sell' : 'badge-hold'}`}>
                  {analysis.finalRecommendation}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem', maxWidth: '600px' }}>
                {analysis.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="glass-button" 
              style={{ padding: '0.5rem 0.88rem', fontSize: '0.82rem' }}
              onClick={handleCopySummary}
            >
              {copied ? <CheckCircle size={14} style={{ color: 'var(--color-buy)' }} /> : <Copy size={14} />}
              <span>{copied ? 'Copied Memo' : 'Copy Memo'}</span>
            </button>
            <button 
              className="glass-button" 
              style={{ padding: '0.5rem 0.88rem', fontSize: '0.82rem' }}
              onClick={handlePrint}
            >
              <Download size={14} />
              <span>Export Report</span>
            </button>
          </div>

        </div>

        {/* Inner Grid metadata cards */}
        <div className="grid-4" style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Building2 size={16} style={{ color: 'var(--color-primary)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>SECTOR / INDUSTRY</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{analysis.sector} / {analysis.industry}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={16} style={{ color: 'var(--color-secondary)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>CEO / FOUNDER</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{analysis.ceo}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={16} style={{ color: 'var(--color-buy)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>HEADCOUNT</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{analysis.employees.toLocaleString()} Employees</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Globe size={16} style={{ color: 'var(--text-secondary)' }} />
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>WEBSITE</div>
              <a href={analysis.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                {analysis.website.replace('https://', '')} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Ratios Metrics Dashboard Summary */}
      <div className="grid-4" style={{ gap: '1rem' }}>
        <div className="glass-card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>MARKET CAP</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>${analysis.marketCap}B</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enterprise Value: ${analysis.valuation.enterpriseValue}B</span>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>REVENUE (FY25)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>${analysis.metrics.revenue[4]}B</div>
          <span className="mono-font" style={{ fontSize: '0.72rem', color: 'var(--color-buy)' }}>+{analysis.metrics.revenueGrowth * 100}% Growth</span>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>NET INCOME (FY25)</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-title)' }}>${analysis.metrics.profit[4]}B</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Net Margin: {analysis.metrics.netMargin}%</span>
        </div>
        <div className="glass-card">
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>DCF INTRINSIC VALUE</div>
          <div className="mono-font" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>${analysis.valuation.intrinsicValue}</div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Current Status: {analysis.valuation.valuationStatus}</span>
        </div>
      </div>

      {/* Collapsible Explainability Panel: Why This Recommendation? */}
      <div 
        className="glass-panel animate-fade-in" 
        style={{ 
          padding: '1.25rem', 
          background: 'rgba(99, 102, 241, 0.03)', 
          borderColor: 'rgba(99, 102, 241, 0.25)',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.05)'
        }}
      >
        <button
          type="button"
          className="flex-between"
          style={{ 
            width: '100%', 
            background: 'transparent', 
            border: 'none', 
            cursor: 'pointer',
            padding: 0,
            color: 'inherit',
            textAlign: 'left'
          }}
          onClick={() => setExplainExpanded(!explainExpanded)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={18} style={{ color: 'var(--color-primary)', animation: 'pulse 2s infinite' }} />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Explainability Panel: Why This Recommendation?</span>
                <span className="mono-font" style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-primary)', background: 'var(--color-primary-glow)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Confidence: {analysis.finalConfidence}%
                </span>
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {explainExpanded ? 'Collapse explainability vectors' : 'Expand detailed breakdown of contributing agents, cited sources, strengths, and risk metrics'}
              </p>
            </div>
          </div>
          <div className="flex-center" style={{ gap: '0.5rem', color: 'var(--color-primary)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{explainExpanded ? 'Collapse' : 'Expand'}</span>
            {explainExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {explainExpanded && (
          <div className="animate-slide-up" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
            <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 0.8fr', gap: '1.5rem', alignItems: 'start' }}>
              
              {/* Left Column: Agents & Sources */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Contributing Agents */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Layers size={12} style={{ color: 'var(--color-primary)' }} />
                    <span>Contributing Committee Agents</span>
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {analysis.votes.map(v => (
                      <div 
                        key={v.agentId} 
                        className="glass-card flex-between"
                        style={{ padding: '0.6rem 0.88rem', background: 'rgba(0,0,0,0.15)', borderColor: 'var(--border-light)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.vote === 'BUY' ? 'var(--color-buy)' : v.vote === 'SELL' ? 'var(--color-sell)' : 'var(--color-hold)' }} />
                          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{v.agentName}</span>
                        </div>
                        <span className="mono-font" style={{ fontSize: '0.72rem', color: v.vote === 'BUY' ? 'var(--color-buy)' : v.vote === 'SELL' ? 'var(--color-sell)' : 'var(--color-hold)', background: 'rgba(255,255,255,0.02)', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}>
                          {v.vote} ({v.confidence}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cited Sources */}
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <BookOpen size={12} style={{ color: 'var(--color-hold)' }} />
                    <span>Cited Research Sources</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {analysis.sources.map(s => (
                      <div 
                        key={s.id} 
                        className="glass-card flex-between"
                        style={{ padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.1)' }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.title}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.publication} &bull; {s.date}</span>
                        </div>
                        <a 
                          href={s.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="mono-font" 
                          style={{ fontSize: '0.7rem', color: 'var(--color-primary)', textDecoration: 'none', background: 'var(--color-primary-glow)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}
                        >
                          {s.id}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Signals & Risks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Strongest Signals */}
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.01)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-buy)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <TrendingUp size={12} />
                    <span>Strongest Positive Signals</span>
                  </h4>
                  <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {analysis.swot.strengths.slice(0, 3).map((st, idx) => (
                      <li key={idx} style={{ lineHeight: '1.4' }}>{st}</li>
                    ))}
                    {analysis.swot.opportunities.slice(0, 1).map((op, idx) => (
                      <li key={idx} style={{ lineHeight: '1.4', color: 'var(--text-muted)' }}>TAM Catalyst: {op}</li>
                    ))}
                  </ul>
                </div>

                {/* Biggest Risks */}
                <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.01)', borderColor: 'rgba(244, 63, 94, 0.15)' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-sell)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <AlertTriangle size={12} />
                    <span>Key Downside Risks</span>
                  </h4>
                  <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {analysis.swot.threats.slice(0, 2).map((th, idx) => (
                      <li key={idx} style={{ lineHeight: '1.4' }}>{th}</li>
                    ))}
                    {Object.entries(analysis.redFlags)
                      .filter(([_, val]) => val === 'High' || val === 'Heavy' || val === true)
                      .slice(0, 2)
                      .map(([key, _]) => (
                        <li key={key} style={{ lineHeight: '1.4', color: 'var(--color-sell)' }}>
                          Alert: {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} warning flag.
                        </li>
                      ))}
                  </ul>
                </div>

              </div>

            </div>
          </div>
        )}
      </div>

      {/* Main split dashboard tabs layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left inner navigation sidebar */}
        <div className="glass-panel" style={{ padding: '0.5rem', background: 'rgba(8, 12, 24, 0.3)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          {[
            { id: 'memo', label: 'Executive Memorandum' },
            { id: 'financials', label: 'Financial Ratios & Charts' },
            { id: 'whatif', label: 'Valuation & Stress Test' },
            { id: 'debate', label: 'Committee Room Debate' },
            { id: 'peers', label: 'Competitors & Moat' },
            { id: 'risk', label: 'Risk Audit & Red Flags' }
          ].map(tab => (
            <button
              key={tab.id}
              className="glass-button"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                border: 'none',
                background: activeSubTab === tab.id ? 'var(--color-primary-glow)' : 'transparent',
                color: activeSubTab === tab.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                padding: '0.6rem 0.88rem'
              }}
              onClick={() => setActiveSubTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Tab Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {activeSubTab === 'memo' && (
            <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)' }}>
              
              {/* Executive Summary Memorandum */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.5rem' }}>
                <div style={{ flex: 1, paddingRight: '1rem', borderRight: '1px solid var(--border-light)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} style={{ color: 'var(--color-primary)' }} />
                    <span>Committee Executive Summary</span>
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {analysis.executiveSummary}
                  </p>
                </div>
                
                {/* Visual score meters */}
                <div style={{ width: '220px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span>Investment Score</span>
                      <span className="mono-font" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{analysis.investmentScore}/100</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${analysis.investmentScore}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '99px' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span>Moat Strength</span>
                      <span className="mono-font" style={{ fontWeight: 600, color: 'var(--color-hold)' }}>{analysis.moatScore}/100</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${analysis.moatScore}%`, height: '100%', background: 'var(--color-hold)', borderRadius: '99px' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                      <span>Risk Exposure</span>
                      <span className="mono-font" style={{ fontWeight: 600, color: 'var(--color-sell)' }}>{analysis.riskMeter}/100</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${analysis.riskMeter}%`, height: '100%', background: 'var(--color-sell)', borderRadius: '99px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Memo Markdown text */}
              <div style={{ lineHeight: '1.6', fontSize: '0.92rem', color: '#e2e8f0', marginBottom: '2rem' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', color: '#cbd5e1' }}>
                  {analysis.memo}
                </pre>
              </div>

              {/* SWOT Matrix grid */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Landmark size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>SWOT Matrix Audit</span>
                </h3>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="glass-card" style={{ background: 'rgba(16, 185, 129, 0.02)', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-buy)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Strengths</div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {analysis.swot.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="glass-card" style={{ background: 'rgba(244, 63, 94, 0.02)', borderColor: 'rgba(244, 63, 94, 0.15)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-sell)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Weaknesses</div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {analysis.swot.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                  <div className="glass-card" style={{ background: 'rgba(99, 102, 241, 0.02)', borderColor: 'rgba(99, 102, 241, 0.15)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Opportunities</div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {analysis.swot.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                  <div className="glass-card" style={{ background: 'rgba(245, 158, 11, 0.02)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-hold)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Threats</div>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {analysis.swot.threats.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeSubTab === 'financials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Interactive Charts Suite */}
              <InteractiveCharts 
                metrics={analysis.metrics}
                valuation={analysis.valuation}
                ticker={analysis.ticker}
                name={analysis.name}
              />
              
              {/* Detailed Numbers spreadsheet card */}
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>Key Accounting Metrics Ratios</h3>
                
                <div className="grid-3" style={{ gap: '1rem' }}>
                  <div className="glass-card flex-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Current Ratio</span>
                    <span className="mono-font" style={{ fontWeight: 700 }}>{analysis.metrics.currentRatio}</span>
                  </div>
                  <div className="glass-card flex-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Quick Ratio</span>
                    <span className="mono-font" style={{ fontWeight: 700 }}>{analysis.metrics.quickRatio}</span>
                  </div>
                  <div className="glass-card flex-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>ROE</span>
                    <span className="mono-font" style={{ fontWeight: 700 }}>{analysis.metrics.roe}%</span>
                  </div>
                  <div className="glass-card flex-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>ROIC</span>
                    <span className="mono-font" style={{ fontWeight: 700 }}>{analysis.metrics.roic}%</span>
                  </div>
                  <div className="glass-card flex-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Operating Margin</span>
                    <span className="mono-font" style={{ fontWeight: 700 }}>{analysis.metrics.operatingMargin}%</span>
                  </div>
                  <div className="glass-card flex-between">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Calculated EPS</span>
                    <span className="mono-font" style={{ fontWeight: 700 }}>${analysis.metrics.eps}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'whatif' && (
            <WhatIfSimulator 
              onRecalculate={handleWhatIfRecalculate}
              baseRecommendation={analysis.finalRecommendation}
              baseConfidence={analysis.finalConfidence}
            />
          )}

          {activeSubTab === 'debate' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <AgentDebateRoom messages={analysis.debate} />
              <CommitteeVoting 
                votes={analysis.votes}
                confidenceScore={analysis.finalConfidence}
                recommendation={analysis.finalRecommendation}
              />
            </div>
          )}

          {activeSubTab === 'peers' && (
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
              
              {/* Porter's 5 forces */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Layers size={16} style={{ color: 'var(--color-primary)' }} />
                  <span>Porter's Five Forces Model Analysis</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Threat of New Entrants', data: analysis.porter.newEntrants },
                    { label: 'Bargaining Power of Buyers', data: analysis.porter.buyers },
                    { label: 'Bargaining Power of Suppliers', data: analysis.porter.suppliers },
                    { label: 'Threat of Substitutes', data: analysis.porter.substitutes },
                    { label: 'Competitive Rivalry', data: analysis.porter.rivalry }
                  ].map((force, i) => (
                    <div key={i} className="glass-card">
                      <div className="flex-between" style={{ marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{force.label}</span>
                        <span className="mono-font" style={{ 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          color: force.data.score > 70 ? 'var(--color-buy)' : force.data.score > 40 ? 'var(--color-hold)' : 'var(--color-sell)'
                        }}>
                          Score: {force.data.score}/100
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{force.data.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Model Canvas summary */}
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>Business Model Canvas Highlights</h3>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Value Propositions</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{analysis.businessModel.valueProp}</div>
                  </div>
                  <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Customer Segments</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{analysis.businessModel.customerSegments}</div>
                  </div>
                  <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Distribution Channels</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{analysis.businessModel.channels}</div>
                  </div>
                  <div className="glass-card">
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-primary)', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Revenue Streams</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{analysis.businessModel.revenueStreams}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeSubTab === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Red Flag Indicators dashboard grid */}
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={18} style={{ color: 'var(--color-sell)' }} />
                  <span>Real-time Safety & Fraud Red Flags Detector</span>
                </h3>

                <div className="grid-3" style={{ gap: '1rem' }}>
                  <div className={`red-flag-indicator ${analysis.redFlags.accountingFraudRisk === 'High' ? 'active' : ''}`}>
                    <div className="red-flag-dot" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Accounting Fraud Risk</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status: {analysis.redFlags.accountingFraudRisk}</div>
                    </div>
                  </div>
                  
                  <div className={`red-flag-indicator ${analysis.redFlags.insiderSelling === 'Heavy' ? 'active' : ''}`}>
                    <div className="red-flag-dot" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Heavy Insider Selling</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status: {analysis.redFlags.insiderSelling}</div>
                    </div>
                  </div>

                  <div className={`red-flag-indicator ${analysis.redFlags.debtIncrease ? 'active' : ''}`}>
                    <div className="red-flag-dot" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Sharp Debt Increase</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{analysis.redFlags.debtIncrease ? 'Leverage rising' : 'Clean'}</div>
                    </div>
                  </div>

                  <div className={`red-flag-indicator ${analysis.redFlags.weakCashFlow ? 'active' : ''}`}>
                    <div className="red-flag-dot" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Weak Cash Flow Conversion</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{analysis.redFlags.weakCashFlow ? 'Alert active' : 'Conversion stable'}</div>
                    </div>
                  </div>

                  <div className={`red-flag-indicator ${analysis.redFlags.ceoResignationRisk === 'High' ? 'active' : ''}`}>
                    <div className="red-flag-dot" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Key CEO Resignation Risk</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Status: {analysis.redFlags.ceoResignationRisk}</div>
                    </div>
                  </div>

                  <div className={`red-flag-indicator ${analysis.redFlags.productRecalls ? 'active' : ''}`}>
                    <div className="red-flag-dot" />
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Product Recalls / Liability</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{analysis.redFlags.productRecalls ? 'Active recall' : 'Clean'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historical Timeline Milestones */}
              <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-title)' }}>Key Corporate Timelines & Milestones</h3>
                
                <div className="timeline-track">
                  {analysis.timeline.map((event, idx) => (
                    <div key={idx} className="timeline-item">
                      <div className="timeline-dot" />
                      <div style={{ paddingLeft: '0.5rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>{event.year}</div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', marginTop: '0.15rem' }}>{event.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Bibliographic Cited Sources */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(8, 12, 24, 0.3)', border: '1px solid var(--border-light)' }}>
            <h4 style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={12} />
              <span>Cited Research Bibliographies ({analysis.sources.length})</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              {analysis.sources.map(s => (
                <div key={s.id} className="flex-between" style={{ color: 'var(--text-secondary)' }}>
                  <span>
                    &bull; [{s.id}] <strong>{s.source}</strong> - <em>{s.publication}</em> ({s.date})
                  </span>
                  <a href={s.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', marginLeft: '0.5rem' }}>
                    View source &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Follow-Up Questions sandbox */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(99, 102, 241, 0.03)', border: '1px solid rgba(99, 102, 241, 0.15)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
              <span>Ask Committee Follow-up Questions</span>
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Query the collective memory of the 13 agents regarding this report (e.g. key-person risks, WACC adjustments).
            </p>

            <form onSubmit={handleFollowUpSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input 
                type="text"
                className="glass-input"
                style={{ flex: 1, padding: '0.6rem 0.88rem', fontSize: '0.85rem' }}
                value={followUpQuery}
                onChange={e => setFollowUpQuery(e.target.value)}
                placeholder="Ask a question about this analysis report..."
              />
              <button 
                type="submit" 
                className="glass-button glass-button-primary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem', borderRadius: '8px' }}
                disabled={isAnswering}
              >
                <Send size={12} />
                <span>Ask</span>
              </button>
            </form>

            {/* Answer Display */}
            {(isAnswering || followUpResponse) && (
              <div className="glass-card animate-fade-in" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.88rem', fontSize: '0.85rem', color: 'var(--text-secondary)', border: '1px solid var(--border-light)' }}>
                {isAnswering ? (
                  <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
                    <div className="animate-spin" style={{ width: '12px', height: '12px', border: '2px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
                    <span>Committee is responding...</span>
                  </div>
                ) : (
                  <div>
                    <strong>Answer:</strong> {followUpResponse}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
