import { useState } from 'react';
import { Milestone, Hammer, Clock, Terminal } from 'lucide-react';

export default function BuildJourney() {
  const [activeSubTab, setActiveSubTab] = useState<'journey' | 'decisions' | 'journal'>('journey');

  const journeyMilestones = [
    {
      date: 'Phase 1: Architecture & Design',
      title: 'Dark Mode Bloomberg Terminal Identity established',
      desc: 'Built the core glassmorphic css token architecture. Setup colors, typography (Geist Mono & Space Grotesk hybrid), glowing neon visual wrappers, and grid variables inside index.css.'
    },
    {
      date: 'Phase 2: Multi-Agent state graphs',
      title: '13-Agent LangGraph Orchestration Simulator coded',
      desc: 'Implemented the deterministic and stochastic math engines inside agentEngine.ts: DCF calculations, Porter\'s five forces scoring, and SWOT. Written the state transition parser that models WACC shocks.'
    },
    {
      date: 'Phase 3: Interactive Dashboard UI',
      title: 'SVG Financial Charts Suite & Debate Rooms completed',
      desc: 'Created the Slack-style debate streaming room, donut consensus voting graphs, and custom hover-interactive SVG line/bar charts without importing heavy external d3 modules.'
    },
    {
      date: 'Phase 4: Multi-Mode Routing',
      title: 'Compare Mode, Watchlists, and Portfolio Allocators added',
      desc: 'Configured the side-by-side asset comparison tables, portfolio allocation selectors (Aggressive, Moderate, Conservative weights), and LangGraph node visualizers.'
    },
    {
      date: 'Phase 5: User Session Control',
      title: 'Glassmorphic Login/Registration & Validation rules added',
      desc: 'Developed client-side credentials authentication with validation schemas (email pattern, pass limit, match audits) and guest bypass triggers.'
    }
  ];

  const engineeringDecisions = [
    {
      topic: '1. Client-Side LangGraph Simulation',
      decision: 'Simulate the multi-agent graph entirely in TypeScript instead of setting up a remote Python backend.',
      rationale: 'A remote Python backend (e.g., LangGraph Cloud or FastAPI) requires active LLM API keys (OpenAI/Anthropic) to run. For an enterprise showcase, running deterministic text streaming with real financial calculations in the browser ensures instant local spin-up, zero latency delays, and no API key configuration overhead.'
    },
    {
      topic: '2. Lightweight Native SVG Charts',
      decision: 'Constructed custom SVG charts instead of using Chart.js or Recharts wrappers.',
      rationale: 'Chart.js and Recharts bring significant bundle weight and often conflict with customized glassmorphic design systems. Drawing coordinates, hover tooltip indicators, and grid lines directly using React SVG hooks keeps the build incredibly light, offers complete styling freedom, and guarantees responsive render speeds.'
    },
    {
      topic: '3. CSS Variables over Tailwind utility classes',
      decision: 'Developed the styling using Vanilla CSS tokens inside index.css.',
      rationale: 'Tailwind utility classes are superb for simple grid layouts, but they result in bloated HTML markup that is difficult to read. Writing structured CSS classes (like .glass-panel, .floating-navbar) and variable maps enables high density visual controls mimicking Bloomberg Terminals with simple, clean JSX.'
    },
    {
      topic: '4. Rate Limiting & Prompt Security Sandbox',
      decision: 'Added simulated LLM token counters, processing latency, and sandbox prompt playgrounds.',
      rationale: 'In production systems, security filters and token cost controls are mandatory. The prompt sandbox allows engineering developers to test prompt injection behavior, verify how varying interest rates affect DCF estimations, and audit token limits before deploying prompts to production API layers.'
    }
  ];

  const journalEntries = [
    {
      time: '2026-06-28 17:15:32',
      event: 'Vite app initialization',
      type: 'INFO',
      msg: 'Scaffolded React + TypeScript workspace. Installed lucide-react.'
    },
    {
      time: '2026-06-28 18:24:10',
      event: 'Clean default boilerplate',
      type: 'INFO',
      msg: 'Deleted unused CSS files and assets. Set up primary grid layouts.'
    },
    {
      time: '2026-06-28 19:12:44',
      event: 'DCF Intrinsic engine verification',
      type: 'SUCCESS',
      msg: 'Verified DCF returns consistent intrinsic projections under 8.5% default discount rates.'
    },
    {
      time: '2026-06-28 19:18:03',
      event: 'Navbar layout compile check',
      type: 'WARNING',
      msg: 'TS2304: Cannot find name "X" inside Navbar.tsx.'
    },
    {
      time: '2026-06-28 19:24:50',
      event: 'Navbar compiler bug fixed',
      type: 'FIX',
      msg: 'Resolved missing X icon and removed unused Laptop imports. Compilation successful.'
    },
    {
      time: '2026-06-28 19:25:05',
      event: 'RecruiterMode type-only import adjusted',
      type: 'FIX',
      msg: 'Changed AgentNode import to type-only. Integrated averageLatency state.'
    },
    {
      time: '2026-06-28 19:44:48',
      event: 'AuthPage unused icon error',
      type: 'WARNING',
      msg: 'TS6133: "Sparkles" is declared but its value is never read.'
    },
    {
      time: '2026-06-28 19:45:09',
      event: 'AuthPage warning resolved',
      type: 'SUCCESS',
      msg: 'Removed unused Sparkles import. Production build compiles cleanly with zero errors in 416ms.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Milestone size={22} style={{ color: 'var(--color-primary)' }} />
          <span>AI Build Journey & Engineering Decisions</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Detailed record of architectural tradeoffs, milestone timelines, and chronological development commit logs.
        </p>
      </div>

      {/* Sub Tabs selectors */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '0.25rem', width: 'fit-content' }}>
        <button
          className="glass-button"
          type="button"
          style={{
            border: 'none',
            padding: '0.5rem 1.25rem',
            fontSize: '0.82rem',
            background: activeSubTab === 'journey' ? 'var(--color-primary-glow)' : 'transparent',
            color: activeSubTab === 'journey' ? 'var(--color-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setActiveSubTab('journey')}
        >
          <Milestone size={12} style={{ marginRight: '0.35rem' }} />
          <span>AI Build Journey</span>
        </button>
        <button
          className="glass-button"
          type="button"
          style={{
            border: 'none',
            padding: '0.5rem 1.25rem',
            fontSize: '0.82rem',
            background: activeSubTab === 'decisions' ? 'var(--color-primary-glow)' : 'transparent',
            color: activeSubTab === 'decisions' ? 'var(--color-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setActiveSubTab('decisions')}
        >
          <Hammer size={12} style={{ marginRight: '0.35rem' }} />
          <span>Engineering Decisions</span>
        </button>
        <button
          className="glass-button"
          type="button"
          style={{
            border: 'none',
            padding: '0.5rem 1.25rem',
            fontSize: '0.82rem',
            background: activeSubTab === 'journal' ? 'var(--color-primary-glow)' : 'transparent',
            color: activeSubTab === 'journal' ? 'var(--color-primary)' : 'var(--text-secondary)'
          }}
          onClick={() => setActiveSubTab('journal')}
        >
          <Clock size={12} style={{ marginRight: '0.35rem' }} />
          <span>Development Journal</span>
        </button>
      </div>

      {/* Rendering Active Tab Content */}
      <div className="animate-fade-in">
        {activeSubTab === 'journey' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px dashed var(--border-medium)' }}>
            
            {journeyMilestones.map((m, idx) => (
              <div key={idx} className="glass-panel animate-slide-up" style={{ padding: '1.25rem', position: 'relative' }}>
                {/* Timeline node dot */}
                <div style={{
                  position: 'absolute',
                  left: '-31px',
                  top: '20px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  boxShadow: '0 0 10px var(--color-primary)',
                  border: '3px solid #060810'
                }} />
                
                <span className="mono-font" style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>{m.date}</span>
                <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-title)', margin: '0.25rem 0 0.5rem 0' }}>{m.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{m.desc}</p>
              </div>
            ))}
            
          </div>
        )}

        {activeSubTab === 'decisions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {engineeringDecisions.map((d, idx) => (
              <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-title)', color: 'var(--color-secondary)' }}>{d.topic}</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', fontSize: '0.82rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Decision:</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{d.decision}</span>
                  
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Rationale:</span>
                  <span style={{ color: 'var(--text-muted)', lineHeight: '1.45' }}>{d.rationale}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'journal' && (
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Terminal size={14} />
              <span>Chronological Compiler Logs</span>
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
              {journalEntries.map((e, idx) => {
                let badgeColor = 'var(--text-muted)';
                if (e.type === 'SUCCESS' || e.type === 'FIX') badgeColor = 'var(--color-buy)';
                if (e.type === 'WARNING') badgeColor = 'var(--color-hold)';
                if (e.type === 'ERROR') badgeColor = 'var(--color-sell)';

                return (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', padding: '0.35rem 0.5rem', borderBottom: '1px solid var(--border-light)', background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{e.time}]</span>
                    <span style={{ color: badgeColor, fontWeight: 700, width: '70px', flexShrink: 0 }}>{e.type}</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600, width: '150px', flexShrink: 0 }}>{e.event}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{e.msg}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
