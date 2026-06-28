import { useState } from 'react';
import { Briefcase, Sparkles } from 'lucide-react';
import { getPortfolioAllocations } from '../services/agentEngine';
import type { PortfolioAsset } from '../services/agentEngine';

export default function PortfolioMode() {
  const [amount, setAmount] = useState<number>(50000);
  const [risk, setRisk] = useState<'Low' | 'Medium' | 'High'>('Medium');

  const assets: PortfolioAsset[] = getPortfolioAllocations(amount, risk);

  // Compute stats
  const totalExpectedReturn = assets.length > 0 
    ? parseFloat((assets.reduce((sum, item) => sum + (item.expectedReturn * item.allocationPercent), 0) / 100).toFixed(1))
    : 0;

  // Colors list for segments
  const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-buy)', '#3b82f6'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Briefcase size={22} style={{ color: 'var(--color-primary)' }} />
          <span>AI Portfolio Allocation Engine</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Input your budget cap and investment risk posture to obtain optimal weight allocations.</p>
      </div>

      {/* Allocation Parameters box */}
      <div className="grid-2">
        {/* Capital & Risk Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)' }}>Allocation Profile Parameters</h3>
          
          {/* Amount input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Total Capital to Invest ($ USD)</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>$</span>
              <input 
                type="number" 
                className="glass-input" 
                style={{ width: '100%', paddingLeft: '2rem' }}
                value={amount}
                onChange={e => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
              />
            </div>
          </div>

          {/* Risk profile toggle buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Risk Appetite Profile</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['Low', 'Medium', 'High'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  className="glass-button"
                  style={{
                    flex: 1,
                    fontSize: '0.85rem',
                    background: risk === r ? 'var(--color-primary-glow)' : 'transparent',
                    borderColor: risk === r ? 'var(--color-primary)' : 'var(--border-light)'
                  }}
                  onClick={() => setRisk(r)}
                >
                  {r === 'Low' ? 'Conservative' : r === 'Medium' ? 'Moderate' : 'Aggressive'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Projection Summary */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(16, 25, 48, 0.4)', border: '1px solid var(--border-medium)', position: 'relative' }}>
          <div className="glow-border-indigo" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
            <span>AI Allocation Insights</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Allocated Portfolio</span>
              <span className="mono-font" style={{ fontWeight: 700, fontSize: '1.1rem' }}>${amount.toLocaleString()}</span>
            </div>
            <div className="flex-between">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Expected Annualized Yield</span>
              <span className="mono-font" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-buy)' }}>+{totalExpectedReturn}%</span>
            </div>
            <div className="flex-between">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Risk Classification</span>
              <span className="badge badge-hold" style={{ fontSize: '0.78rem' }}>
                {risk === 'Low' ? 'LOW RISK' : risk === 'Medium' ? 'BALANCED' : 'HIGH DIVERSIFIED GROWTH'}
              </span>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', lineHeight: '1.4' }}>
              *Projections represent standard Sharpe-ratio optimization loops and assume historical sector multiple correlation factors.
            </p>
          </div>
        </div>
      </div>

      {/* Stacked Allocation weights bar visual */}
      {assets.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)' }}>
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Portfolio Asset Allocation Weights</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click columns below to drill-down analysis.</span>
          </div>

          {/* Progress stack */}
          <div style={{ width: '100%', height: '24px', background: 'var(--border-light)', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '1.5rem' }}>
            {assets.map((a, i) => (
              <div 
                key={a.ticker}
                style={{ 
                  width: `${a.allocationPercent}%`, 
                  height: '100%', 
                  background: colors[i % colors.length], 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
                }}
                title={`${a.name}: ${a.allocationPercent}%`}
              >
                {a.ticker} ({a.allocationPercent}%)
              </div>
            ))}
          </div>

          {/* Allocation Details Grid */}
          <div className="grid-3" style={{ gap: '1rem' }}>
            {assets.map((a, i) => (
              <div key={a.ticker} className="glass-card" style={{ borderTop: `4px solid ${colors[i % colors.length]}` }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{a.ticker}</span>
                  <span className="mono-font" style={{ fontWeight: 600, fontSize: '0.85rem', color: colors[i % colors.length] }}>
                    {a.allocationPercent}%
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  {a.name}
                </div>
                <div className="flex-between" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Share:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>${a.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex-between" style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Exp Return:</span>
                  <span style={{ color: 'var(--color-buy)', fontWeight: 600 }}>+{a.expectedReturn}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
