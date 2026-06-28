import { useState } from 'react';
import { Code, Terminal, Send, Eye, Cpu } from 'lucide-react';
import type { CompanyAnalysis } from '../services/agentEngine';

interface DeveloperModeProps {
  analysisData: CompanyAnalysis;
}

export default function DeveloperMode({ analysisData }: DeveloperModeProps) {
  const [sandboxPrompt, setSandboxPrompt] = useState('SYSTEM: You are the Valuation Expert inside the investment committee.\nTASK: Recalculate DCF under 6.5% interest rate stress. Provide recommendation.');
  const [sandboxResponse, setSandboxResponse] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [sandboxTokens, setSandboxTokens] = useState<number | null>(null);
  const [sandboxLatency, setSandboxLatency] = useState<number | null>(null);

  // System logs mock
  const [systemLogs, setSystemLogs] = useState<string[]>([
    '[system] Init state loader successfully loaded.',
    `[system] Analysis context generated for ticker: ${analysisData.ticker}`,
    '[system] Executing node Planner... DONE in 320ms',
    '[system] Launching parallel threads: Financial, News, Risk... SUCCESS',
    `[system] Computing DCF Intrinsic Value: $${analysisData.valuation.intrinsicValue} per share.`,
    '[system] Launching debate sequence... STREAM_COMPLETED',
    '[system] Aggregating vote matrix counts... consensus BUY target established.'
  ]);

  const handleSimulateLLM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxPrompt.trim()) return;

    setIsSimulating(true);
    setSandboxResponse('');
    
    // Simulate API call
    setTimeout(() => {
      const lat = Math.round(350 + Math.random() * 400);
      const tok = Math.round(180 + Math.random() * 300);
      
      setSandboxLatency(lat);
      setSandboxTokens(tok);
      setIsSimulating(false);
      setSandboxResponse(`[SIMULATED LLM RESPONSE] (${lat}ms, ${tok} tokens)\nBased on the WACC reduction to 6.5%, the projected future free cash flows are discounted at a lower hurdle rate. The calculated intrinsic value expands to $${(analysisData.valuation.intrinsicValue * 1.12).toFixed(2)} per share. Consensus vote recommendation adjusts to STRONG BUY.`);
      setSystemLogs(prev => [...prev, `[sandbox] Simulated LLM query finished. consumed ${tok} tokens in ${lat}ms.`]);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={22} style={{ color: 'var(--color-primary)' }} />
          <span>Developer Debug Sandbox</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Console terminal logs, prompt sandbox, and reactive state tree inspector.</p>
      </div>

      {/* Main split layout grid */}
      <div className="grid-2" style={{ gridTemplateColumns: '1.1fr 0.9fr', alignItems: 'start' }}>
        
        {/* Left column: prompt sandbox & terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Prompt Sandbox */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={16} style={{ color: 'var(--color-secondary)' }} />
              <span>Prompt Sandbox Playground</span>
            </h3>

            <form onSubmit={handleSimulateLLM} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                className="glass-input"
                style={{ width: '100%', height: '100px', resize: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
                value={sandboxPrompt}
                onChange={e => setSandboxPrompt(e.target.value)}
                placeholder="Enter custom prompt schema..."
              />
              
              <div className="flex-between">
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {sandboxLatency && (
                    <span>Latency: <strong className="mono-font" style={{ color: 'var(--color-hold)' }}>{sandboxLatency}ms</strong> | </span>
                  )}
                  {sandboxTokens && (
                    <span>Tokens: <strong className="mono-font" style={{ color: 'var(--color-primary)' }}>{sandboxTokens}</strong></span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="glass-button glass-button-primary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.82rem', borderRadius: '6px' }}
                  disabled={isSimulating}
                >
                  <Send size={12} />
                  <span>{isSimulating ? 'Simulating Run...' : 'Simulate LLM Run'}</span>
                </button>
              </div>
            </form>

            {/* Sandbox Response Output */}
            {sandboxResponse && (
              <pre className="animate-fade-in" style={{ 
                marginTop: '1rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-light)',
                borderRadius: '6px',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                color: 'var(--color-buy)',
                whiteSpace: 'pre-wrap',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                {sandboxResponse}
              </pre>
            )}
          </div>

          {/* System Terminal Console */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.45)' }}>
            <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '0.9rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <Terminal size={14} />
                <span>Active Console Logs</span>
              </h3>
              <span className="mono-font" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SYSTEM STDOUT</span>
            </div>
            
            <div style={{ height: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#94a3b8' }}>
              {systemLogs.map((log, i) => (
                <div key={i} style={{ color: log.startsWith('[system]') ? '#94a3b8' : 'var(--color-secondary)' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: JSON State Inspector */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', minHeight: '480px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Reactive State Tree Inspector</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Full state dictionary computed by LangGraph:</div>
            
            <pre style={{ 
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--border-light)',
              borderRadius: '6px',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              color: '#38bdf8',
              overflowY: 'auto',
              maxHeight: '440px',
              whiteSpace: 'pre-wrap'
            }}>
              {JSON.stringify({
                ticker: analysisData.ticker,
                name: analysisData.name,
                sector: analysisData.sector,
                industry: analysisData.industry,
                ceo: analysisData.ceo,
                marketCap: analysisData.marketCap,
                metrics: {
                  revenue: analysisData.metrics.revenue,
                  profit: analysisData.metrics.profit,
                  currentRatio: analysisData.metrics.currentRatio,
                  netMargin: analysisData.metrics.netMargin,
                  debt: analysisData.metrics.debt
                },
                valuation: {
                  pe: analysisData.valuation.pe,
                  peg: analysisData.valuation.peg,
                  intrinsicValue: analysisData.valuation.intrinsicValue,
                  valuationStatus: analysisData.valuation.valuationStatus
                },
                scores: {
                  investmentScore: analysisData.investmentScore,
                  riskMeter: analysisData.riskMeter,
                  moatScore: analysisData.moatScore
                },
                consensus: {
                  finalRecommendation: analysisData.finalRecommendation,
                  finalConfidence: analysisData.finalConfidence
                }
              }, null, 2)}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
}
