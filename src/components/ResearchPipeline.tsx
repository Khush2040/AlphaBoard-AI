import { useState, useEffect, useRef } from 'react';
import { Terminal, Check, Loader2 } from 'lucide-react';
import { generateCompanyAnalysis, generateGeminiAnalysis } from '../services/agentEngine';
import type { CompanyAnalysis } from '../services/agentEngine';

interface ResearchPipelineProps {
  companyName: string;
  apiKey: string;
  onComplete: (data: CompanyAnalysis) => void;
}

export default function ResearchPipeline({ companyName, apiKey, onComplete }: ResearchPipelineProps) {
  const steps = [
    'Searching global financial repositories...',
    'Reading annual reports & Form 10-K...',
    'Checking latest quarterly earnings calls...',
    'Analyzing CEO communications & press sentiment...',
    'Reading SEC filings & regulatory filings...',
    'Finding principal competitors & benchmarking multiples...',
    'Analyzing cash flow structures & leverage metrics...',
    'Checking insider trading logs & institutional flow...',
    'Initializing 13 expert AI agent personas...',
    'Opening LangGraph committee chat debate...',
    'Compiling final consensus report and memorandum...'
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);
  const hasStartedReal = useRef(false);

  // Cycle through steps for MOCK mode or run REAL AI mode
  useEffect(() => {
    if (apiKey) {
      if (hasStartedReal.current) return;
      hasStartedReal.current = true;
      
      const runReal = async () => {
        try {
          const data = await generateGeminiAnalysis(companyName, apiKey, (stepIdx, newLogs) => {
            setCurrentStepIndex(stepIdx);
            setConsoleLogs(prev => [...prev, ...newLogs]);
          });
          setCurrentStepIndex(steps.length - 1);
          setConsoleLogs(prev => [
            ...prev,
            `[Chairman] Consensus report finalized. Real AI analysis complete.`
          ]);
          setTimeout(() => {
            onComplete(data);
          }, 1200);
        } catch (err: any) {
          console.error("Gemini pipeline failed: ", err);
          setConsoleLogs(prev => [
            ...prev,
            `[Error] Gemini API pipeline failed: ${err.message || err}`,
            `[Planner] Recovering gracefully... Falling back to high-fidelity simulated calculations.`
          ]);
          
          // Trigger simulated countdown cycle
          setTimeout(() => {
            setConsoleLogs(prev => [...prev, `[Planner] Spinning up local simulated engine fallback...`]);
            let currentMockIdx = 0;
            const interval = setInterval(() => {
              if (currentMockIdx >= steps.length) {
                clearInterval(interval);
                const mockData = generateCompanyAnalysis(companyName);
                onComplete(mockData);
                return;
              }
              setCurrentStepIndex(currentMockIdx);
              const mockNodeLogs: Record<number, string[]> = {
                0: [`[Planner] Initiated simulated research fallback...`],
                1: [`[Financial] Financial statement arrays generated.`],
                2: [`[News] News database models loaded.`],
                3: [`[News] Sentiment gauges structured.`],
                4: [`[Risk] Insider threat checks completed.`],
                5: [`[Competition] Compiling peer multiple comparison tables.`],
                6: [`[Valuation] WACC models compiled.`],
                7: [`[Risk] Accounting red flags scan completed.`],
                8: [`[LangGraph] Committee chat nodes spin up.`],
                9: [`[Debate] Bull & Bear advocates debate finalized.`],
                10: [`[Chairman] final vote compiled. Consensus draft prepared.`]
              };
              setConsoleLogs(prev => [...prev, ...(mockNodeLogs[currentMockIdx] || [])]);
              currentMockIdx++;
            }, 600);
          }, 1500);
        }
      };
      
      runReal();
    } else {
      // Mock mode timer-based cycle
      if (currentStepIndex >= steps.length) {
        const timer = setTimeout(() => {
          const data = generateCompanyAnalysis(companyName);
          onComplete(data);
        }, 800);
        return () => clearTimeout(timer);
      }

      const duration = currentStepIndex === steps.length - 1 ? 900 : 450 + Math.random() * 200;
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, companyName, apiKey, onComplete, steps.length]);

  // Generate logs matching current research steps (MOCK mode only)
  useEffect(() => {
    if (apiKey) return; // real mode appends its own logs dynamically
    if (currentStepIndex >= steps.length) return;
    
    const nodeLogs: Record<number, string[]> = {
      0: [
        `[Planner] Initiated research pipeline for query: "${companyName}"`,
        `[Fetcher] Query resolved. Pulling structural company profiles...`,
        `[Fetcher] SEC Central Index Key (CIK) identified.`
      ],
      1: [
        `[Financial] Reading Form 10-K filings for fiscal year 2025...`,
        `[Financial] Extracted Cash reserves & Long term Debt values.`,
        `[Financial] Parsing cash flow statement: Cash Flow from Operations computed.`
      ],
      2: [
        `[News] Parsing transcripts from recent Q3/Q4 earnings conference calls...`,
        `[News] Identified guidance highlights: CEO reports positive product pipeline demand.`
      ],
      3: [
        `[News] Running sentiment classification over 150+ news channels and editorials...`,
        `[News] Computed news sentiment score index.`
      ],
      4: [
        `[Risk] Scanning Form 4 insider trading logs...`,
        `[Risk] Restructuring filings parsed. CEO key-man dependency checked.`
      ],
      5: [
        `[Competition] benchmarking margins against top industry peers...`,
        `[Competition] Competitor sector multiples compiled (P/E, EV/Sales).`
      ],
      6: [
        `[Valuation] Initiating Discounted Cash Flow (DCF) model...`,
        `[Valuation] Factoring Weighted Average Cost of Capital (WACC = 8.5%).`
      ],
      7: [
        `[Risk] Scanning corporate accounting files for red flags...`,
        `[Risk] Checked debt covenants and inventory turnover rates.`
      ],
      8: [
        `[LangGraph] Spin up Node Agent network: 13 instances created.`,
        `[LangGraph] Distributing shared context memory and files to agent nodes.`
      ],
      9: [
        `[Debate] Consensus debate node active. Agent threads communicating...`,
        `[Debate] Bull case notes submitted. Devil's Advocate raised regulatory objection.`,
        `[Debate] ESG scoring completed. Valuation node logged WACC metrics.`
      ],
      10: [
        `[Chairman] Voting cycle completed. Strong BUY consensus reached.`,
        `[Chairman] Compiling markdown draft. Formatting tables and red-flags...`,
        `[Chairman] PDF and Print layouts verified. Report ready.`
      ]
    };

    const newLogs = nodeLogs[currentStepIndex] || [];
    setConsoleLogs(prev => [...prev, ...newLogs]);
  }, [currentStepIndex, companyName, apiKey]);

  // Auto-scroll logs container
  useEffect(() => {
    const el = document.getElementById('pipeline-console-logs');
    if (el) el.scrollTop = el.scrollHeight;
  }, [consoleLogs]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 100px)', padding: '2rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '750px', padding: '2.5rem', background: 'rgba(8, 12, 24, 0.75)', border: '1px solid var(--border-medium)' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Running Committee Research for <span style={{ color: 'var(--color-primary)' }}>{companyName}</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            LangGraph agents are retrieving data, running calculations, and debating allocation choices.
          </p>
        </div>

        {/* Progress Tracker Slider bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="flex-between" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Overall Research Progress</span>
            <span className="mono-font" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', 
              transition: 'width 0.4s ease',
              boxShadow: '0 0 10px var(--color-primary)'
            }}></div>
          </div>
        </div>

        {/* Step Checklists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem', paddingLeft: '0.5rem' }}>
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isActive = idx === currentStepIndex;
            
            return (
              <div 
                key={step} 
                className="flex-between animate-fade-in"
                style={{ 
                  opacity: isCompleted || isActive ? 1 : 0.35,
                  transition: 'opacity 0.25s',
                  fontSize: '0.92rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {isCompleted ? (
                    <div className="flex-center" style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-buy-glow)', border: '1px solid var(--color-buy)' }}>
                      <Check size={12} style={{ color: 'var(--color-buy)' }} />
                    </div>
                  ) : isActive ? (
                    <Loader2 size={16} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
                  ) : (
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--border-medium)' }} />
                  )}
                  <span style={{ 
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400
                  }}>
                    {step}
                  </span>
                </div>
                
                {isActive && (
                  <span className="badge badge-buy animate-pulse-glow" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                    RUNNING
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Console logs */}
        <div className="glass-panel" style={{ 
          background: 'rgba(0,0,0,0.4)', 
          border: '1px solid var(--border-light)', 
          borderRadius: '8px',
          padding: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: '#cbd5e1'
        }}>
          <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Terminal size={12} />
              <span>COMMITTEE EXECUTOR TERMINAL LOGS</span>
            </span>
            <span style={{ fontSize: '0.7rem' }}>LANGGRAPH AGENT FLOW</span>
          </div>
          <div 
            id="pipeline-console-logs"
            style={{ 
              height: '140px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.25rem',
              scrollBehavior: 'smooth'
            }}
          >
            {consoleLogs.map((log, i) => (
              <div key={i} className="animate-fade-in" style={{ color: log.startsWith('[Risk]') ? '#f43f5e' : log.startsWith('[Financial]') ? '#10b981' : log.startsWith('[Debate]') ? '#a855f7' : '#cbd5e1' }}>
                {log}
              </div>
            ))}
            {currentStepIndex < steps.length && (
              <div style={{ color: 'var(--color-primary)' }} className="animate-pulse-glow">&gt; awaiting next node execution signal...</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
