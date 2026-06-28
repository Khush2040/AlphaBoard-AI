import { PieChart, Sparkles } from 'lucide-react';
import type { AgentVote } from '../services/agentEngine';

interface CommitteeVotingProps {
  votes: AgentVote[];
  confidenceScore: number;
  recommendation: string;
}

export default function CommitteeVoting({ votes, confidenceScore, recommendation }: CommitteeVotingProps) {
  // Count votes
  const buyCount = votes.filter(v => v.vote === 'BUY').length;
  const holdCount = votes.filter(v => v.vote === 'HOLD').length;
  const sellCount = votes.filter(v => v.vote === 'SELL').length;
  const passCount = votes.filter(v => v.vote === 'PASS').length;
  const totalVotes = votes.length || 1;

  // Donut chart stroke segments
  const buyPct = (buyCount / totalVotes) * 100;
  const holdPct = (holdCount / totalVotes) * 100;
  const sellPct = (sellCount / totalVotes) * 100;
  const passPct = (passCount / totalVotes) * 100;

  // Compute stroke dash offsets for Donut chart
  const radius = 50;
  const circumference = 2 * Math.PI * radius; // ~314.16
  
  const buyDash = (buyPct / 100) * circumference;
  const holdDash = (holdPct / 100) * circumference;
  const sellDash = (sellPct / 100) * circumference;
  const passDash = (passPct / 100) * circumference;

  let currentOffset = 0;
  const buyOffset = currentOffset;
  currentOffset += buyDash;
  const holdOffset = currentOffset;
  currentOffset += holdDash;
  const sellOffset = currentOffset;
  currentOffset += sellDash;
  const passOffset = currentOffset;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Upper Consensus Dashboard */}
      <div className="grid-3">
        {/* Consensus card */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 25, 48, 0.4)', border: '1px solid var(--border-medium)', position: 'relative', overflow: 'hidden' }}>
          <div className="glow-border-indigo" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit' }} />
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>COMMITTEE RECOMMENDATION</span>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 800, 
            fontFamily: 'var(--font-title)', 
            color: recommendation.includes('BUY') ? 'var(--color-buy)' : recommendation.includes('SELL') ? 'var(--color-sell)' : 'var(--color-hold)',
            marginBottom: '0.5rem'
          }}>
            {recommendation}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Determined by standard super-majority vote consensus of 13 agent nodes.
          </p>
        </div>

        {/* Confidence Meter */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)', border: '1px solid var(--border-light)' }}>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>CONFIDENCE INDEX</span>
            <span className="mono-font" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{confidenceScore}/100</span>
          </div>
          
          {/* Slider line */}
          <div style={{ width: '100%', height: '8px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ 
              width: `${confidenceScore}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', 
              borderRadius: '99px' 
            }} />
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Calculated from financial consistency metrics, news indicators, and agent voting consensus.
          </p>
        </div>

        {/* SVG Donut Chart */}
        <div className="glass-panel flex-center" style={{ padding: '1rem', background: 'rgba(8, 12, 24, 0.4)', border: '1px solid var(--border-light)', gap: '1.5rem' }}>
          <div style={{ position: 'relative', width: '110px', height: '110px' }}>
            <svg width="110" height="110" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
              {/* Background circle */}
              <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border-light)" strokeWidth="12" />
              
              {/* Buy segment */}
              {buyDash > 0 && (
                <circle 
                  cx="60" cy="60" r={radius} fill="none" 
                  stroke="var(--color-buy)" strokeWidth="12"
                  strokeDasharray={`${buyDash} ${circumference}`}
                  strokeDashoffset={-buyOffset}
                />
              )}
              {/* Hold segment */}
              {holdDash > 0 && (
                <circle 
                  cx="60" cy="60" r={radius} fill="none" 
                  stroke="var(--color-hold)" strokeWidth="12"
                  strokeDasharray={`${holdDash} ${circumference}`}
                  strokeDashoffset={-holdOffset}
                />
              )}
              {/* Sell segment */}
              {sellDash > 0 && (
                <circle 
                  cx="60" cy="60" r={radius} fill="none" 
                  stroke="var(--color-sell)" strokeWidth="12"
                  strokeDasharray={`${sellDash} ${circumference}`}
                  strokeDashoffset={-sellOffset}
                />
              )}
              {/* Pass segment */}
              {passDash > 0 && (
                <circle 
                  cx="60" cy="60" r={radius} fill="none" 
                  stroke="var(--color-pass)" strokeWidth="12"
                  strokeDasharray={`${passDash} ${circumference}`}
                  strokeDashoffset={-passOffset}
                />
              )}
            </svg>
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontFamily: 'var(--font-title)',
              pointerEvents: 'none'
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{votes.length}</span>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>VOTES</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.78rem' }}>
            <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-buy)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>BUY ({buyCount})</span>
            </div>
            <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-hold)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>HOLD ({holdCount})</span>
            </div>
            <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-sell)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>SELL ({sellCount})</span>
            </div>
            <div className="flex-center" style={{ gap: '0.5rem', justifyContent: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-pass)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>PASS ({passCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Vote Cards */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <PieChart size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Individual Agent Votes</span>
        </h3>
        
        <div className="grid-2">
          {votes.map((v) => {
            const isBuy = v.vote === 'BUY';
            const isSell = v.vote === 'SELL';
            const isHold = v.vote === 'HOLD';
            
            return (
              <div 
                key={v.agentId} 
                className="glass-card flex-between"
                style={{ 
                  alignItems: 'flex-start', 
                  gap: '1rem',
                  borderLeft: `3px solid ${isBuy ? 'var(--color-buy)' : isSell ? 'var(--color-sell)' : isHold ? 'var(--color-hold)' : 'var(--color-pass)'}`
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{v.agentName}</h4>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {v.agentId === 'advocate' ? 'Devil\'s Advocate' : 'Committee Member'}
                      </span>
                    </div>
                    
                    {/* Badge */}
                    <span className={`badge ${isBuy ? 'badge-buy' : isSell ? 'badge-sell' : isHold ? 'badge-hold' : 'badge-pass'}`}>
                      {v.vote}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
                    {v.reasoning}
                  </p>
                  
                  {/* Confidence mini-slider */}
                  <div>
                    <div className="flex-between" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      <span>Agent Certainty</span>
                      <span>{v.confidence}%</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'var(--border-light)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${v.confidence}%`, 
                        height: '100%', 
                        background: isBuy ? 'var(--color-buy)' : isSell ? 'var(--color-sell)' : isHold ? 'var(--color-hold)' : 'var(--color-pass)',
                        borderRadius: '99px' 
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
