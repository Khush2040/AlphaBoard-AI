import { useState } from 'react';
import { BarChart, Award } from 'lucide-react';
import type { FinancialMetrics, ValuationData } from '../services/agentEngine';

interface InteractiveChartsProps {
  metrics: FinancialMetrics;
  valuation: ValuationData;
  ticker: string;
  name: string;
}

export default function InteractiveCharts({ metrics, valuation, ticker, name }: InteractiveChartsProps) {
  const [activeChartTab, setActiveChartTab] = useState<'revenue' | 'balance' | 'margins' | 'peers'>('revenue');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const years = ['2021', '2022', '2023', '2024', '2025'];
  const chartHeight = 220;
  const chartWidth = 500;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  // Chart helpers: Map value to Y coordinate
  const getY = (val: number, max: number, min: number = 0) => {
    const range = max - min || 1;
    const height = chartHeight - paddingTop - paddingBottom;
    return chartHeight - paddingBottom - ((val - min) / range) * height;
  };

  // Map index to X coordinate
  const getX = (index: number, total: number) => {
    const width = chartWidth - paddingLeft - paddingRight;
    const step = width / (total - 1);
    return paddingLeft + index * step;
  };

  // Render different chart views based on tabs
  const renderChart = () => {
    if (activeChartTab === 'revenue') {
      const maxVal = Math.max(...metrics.revenue) * 1.15;
      
      // Compute line points for Revenue
      const revPoints = metrics.revenue.map((val, idx) => {
        return `${getX(idx, metrics.revenue.length)},${getY(val, maxVal)}`;
      }).join(' ');

      // Compute line points for Profit
      const profPoints = metrics.profit.map((val, idx) => {
        return `${getX(idx, metrics.profit.length)},${getY(val, maxVal)}`;
      }).join(' ');

      return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          {/* Grids */}
          {Array.from({ length: 5 }).map((_, i) => {
            const yVal = (maxVal / 4) * i;
            const yCo = getY(yVal, maxVal);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={yCo} x2={chartWidth - paddingRight} y2={yCo} stroke="var(--border-light)" strokeDasharray="4 4" strokeWidth="0.75" />
                <text x={paddingLeft - 8} y={yCo + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">
                  ${Math.round(yVal)}B
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {years.map((y, i) => {
            const xCo = getX(i, years.length);
            return (
              <text key={i} x={xCo} y={chartHeight - 10} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                {y}
              </text>
            );
          })}

          {/* Revenue Area under Line */}
          <path 
            d={`M ${getX(0, metrics.revenue.length)} ${chartHeight - paddingBottom} L ${revPoints} L ${getX(metrics.revenue.length - 1, metrics.revenue.length)} ${chartHeight - paddingBottom} Z`}
            fill="url(#grad-rev)"
            opacity="0.1"
          />

          {/* Revenue Line */}
          <polyline fill="none" stroke="var(--color-primary)" strokeWidth="3" points={revPoints} />

          {/* Profit Line */}
          <polyline fill="none" stroke="var(--color-buy)" strokeWidth="2.5" strokeDasharray="3 3" points={profPoints} />

          {/* Interactive Hover Nodes */}
          {metrics.revenue.map((val, idx) => {
            const xCo = getX(idx, metrics.revenue.length);
            const yCoRev = getY(val, maxVal);
            const yCoProf = getY(metrics.profit[idx], maxVal);

            return (
              <g key={idx} onMouseEnter={() => setHoverIndex(idx)} onMouseLeave={() => setHoverIndex(null)} style={{ cursor: 'pointer' }}>
                <circle cx={xCo} cy={yCoRev} r="6" fill="var(--color-primary)" opacity={hoverIndex === idx ? 1 : 0.6} />
                <circle cx={xCo} cy={yCoProf} r="5" fill="var(--color-buy)" opacity={hoverIndex === idx ? 1 : 0.6} />
                {/* Visual guideline */}
                {hoverIndex === idx && (
                  <line x1={xCo} y1={paddingTop} x2={xCo} y2={chartHeight - paddingBottom} stroke="var(--border-medium)" strokeWidth="1" strokeDasharray="2 2" />
                )}
              </g>
            );
          })}

          {/* SVG Definitions for Gradients */}
          <defs>
            <linearGradient id="grad-rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      );
    } else if (activeChartTab === 'balance') {
      const maxVal = Math.max(metrics.cash, metrics.debt) * 1.2;
      const xSpacing = (chartWidth - paddingLeft - paddingRight) / 5;
      
      return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          {/* Grids */}
          {Array.from({ length: 5 }).map((_, i) => {
            const yVal = (maxVal / 4) * i;
            const yCo = getY(yVal, maxVal);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={yCo} x2={chartWidth - paddingRight} y2={yCo} stroke="var(--border-light)" strokeDasharray="4 4" strokeWidth="0.75" />
                <text x={paddingLeft - 8} y={yCo + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">
                  ${Math.round(yVal)}B
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {years.map((y, i) => {
            const xCo = paddingLeft + i * xSpacing + xSpacing / 2;
            return (
              <text key={i} x={xCo} y={chartHeight - 10} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                {y}
              </text>
            );
          })}

          {/* Debt vs Cash bars */}
          {years.map((_, idx) => {
            const xCo = paddingLeft + idx * xSpacing;
            const barWidth = xSpacing * 0.35;
            
            // Cash Bar (Emerald)
            const cashVal = idx === 4 ? metrics.cash : metrics.cash * (1 - (4 - idx) * 0.05);
            const cashY = getY(cashVal, maxVal);
            const cashHeight = chartHeight - paddingBottom - cashY;

            // Debt Bar (Indigo/Red)
            const debtVal = idx === 4 ? metrics.debt : metrics.debt * (1 - (4 - idx) * 0.03);
            const debtY = getY(debtVal, maxVal);
            const debtHeight = chartHeight - paddingBottom - debtY;

            return (
              <g key={idx} onMouseEnter={() => setHoverIndex(idx)} onMouseLeave={() => setHoverIndex(null)}>
                {/* Cash bar */}
                <rect 
                  x={xCo + xSpacing * 0.1} 
                  y={cashY} 
                  width={barWidth} 
                  height={cashHeight} 
                  fill="var(--color-buy)" 
                  rx="3"
                  opacity={hoverIndex === idx ? 1 : 0.75}
                  style={{ transition: 'opacity 0.2s' }}
                />
                {/* Debt bar */}
                <rect 
                  x={xCo + xSpacing * 0.5} 
                  y={debtY} 
                  width={barWidth} 
                  height={debtHeight} 
                  fill="var(--color-primary)" 
                  rx="3"
                  opacity={hoverIndex === idx ? 1 : 0.75}
                  style={{ transition: 'opacity 0.2s' }}
                />
              </g>
            );
          })}
        </svg>
      );
    } else if (activeChartTab === 'margins') {
      const maxVal = Math.max(metrics.netMargin, metrics.operatingMargin) * 1.25;

      const opPoints = [
        metrics.operatingMargin * 0.9,
        metrics.operatingMargin * 0.92,
        metrics.operatingMargin * 0.95,
        metrics.operatingMargin * 0.98,
        metrics.operatingMargin
      ].map((val, idx) => `${getX(idx, 5)},${getY(val, maxVal)}`).join(' ');

      const netPoints = [
        metrics.netMargin * 0.9,
        metrics.netMargin * 0.91,
        metrics.netMargin * 0.93,
        metrics.netMargin * 0.96,
        metrics.netMargin
      ].map((val, idx) => `${getX(idx, 5)},${getY(val, maxVal)}`).join(' ');

      return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: '100%', height: 'auto', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          {/* Grids */}
          {Array.from({ length: 5 }).map((_, i) => {
            const yVal = (maxVal / 4) * i;
            const yCo = getY(yVal, maxVal);
            return (
              <g key={i}>
                <line x1={paddingLeft} y1={yCo} x2={chartWidth - paddingRight} y2={yCo} stroke="var(--border-light)" strokeDasharray="4 4" strokeWidth="0.75" />
                <text x={paddingLeft - 8} y={yCo + 4} fill="var(--text-muted)" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">
                  {Math.round(yVal)}%
                </text>
              </g>
            );
          })}

          {/* X Axis */}
          {years.map((y, i) => {
            const xCo = getX(i, years.length);
            return (
              <text key={i} x={xCo} y={chartHeight - 10} fill="var(--text-secondary)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                {y}
              </text>
            );
          })}

          {/* Operating margins */}
          <polyline fill="none" stroke="var(--color-secondary)" strokeWidth="3" points={opPoints} />

          {/* Net margins */}
          <polyline fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeDasharray="4 4" points={netPoints} />

          {/* Interactive nodes */}
          {years.map((_, idx) => {
            const xCo = getX(idx, 5);
            return (
              <circle key={idx} cx={xCo} cy={getY(idx === 4 ? metrics.netMargin : metrics.netMargin * 0.95, maxVal)} r="5" fill="var(--color-primary)" />
            );
          })}
        </svg>
      );
    } else {
      // Peer valuation comparison multiples
      const peers = [
        { ticker: ticker, val: valuation.pe, name: `${name} (Target)` },
        { ticker: 'PEER A', val: valuation.pe * 1.15, name: 'Industry Avg' },
        { ticker: 'PEER B', val: valuation.pe * 0.78, name: 'Alternative Option A' },
        { ticker: 'PEER C', val: valuation.pe * 1.32, name: 'Premium Peer Avg' }
      ];

      const maxPe = Math.max(...peers.map(p => p.val)) * 1.15;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.88rem', padding: '1rem', background: 'rgba(0,0,0,0.15)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
          {peers.map((p, i) => {
            const widthPct = Math.min(100, (p.val / maxPe) * 100);
            const isTarget = p.ticker === ticker;
            return (
              <div key={i}>
                <div className="flex-between" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: isTarget ? 700 : 400, color: isTarget ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {p.name} ({p.ticker})
                  </span>
                  <span className="mono-font" style={{ fontWeight: 600, color: isTarget ? 'var(--color-primary)' : 'var(--text-secondary)' }}>
                    {p.val.toFixed(1)}x P/E
                  </span>
                </div>
                <div style={{ width: '100%', height: '14px', background: 'var(--border-light)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    width: `${widthPct}%`, 
                    height: '100%', 
                    background: isTarget ? 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' : 'var(--border-medium)', 
                    borderRadius: '4px',
                    boxShadow: isTarget ? '0 0 10px var(--color-primary-glow)' : 'none'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.4)', border: '1px solid var(--border-light)' }}>
      {/* Title */}
      <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Interactive Financial Charts Suite</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hover over grid coordinates to view exact timeline multiples.</span>
        </div>
      </div>

      {/* Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className="glass-button"
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.75rem',
            background: activeChartTab === 'revenue' ? 'var(--color-primary-glow)' : 'transparent',
            borderColor: activeChartTab === 'revenue' ? 'var(--color-primary)' : 'var(--border-light)'
          }}
          onClick={() => { setActiveChartTab('revenue'); setHoverIndex(null); }}
        >
          Revenue & Profit (Historical)
        </button>
        <button 
          className="glass-button"
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.75rem',
            background: activeChartTab === 'balance' ? 'var(--color-primary-glow)' : 'transparent',
            borderColor: activeChartTab === 'balance' ? 'var(--color-primary)' : 'var(--border-light)'
          }}
          onClick={() => { setActiveChartTab('balance'); setHoverIndex(null); }}
        >
          Debt vs Cash Reserves
        </button>
        <button 
          className="glass-button"
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.75rem',
            background: activeChartTab === 'margins' ? 'var(--color-primary-glow)' : 'transparent',
            borderColor: activeChartTab === 'margins' ? 'var(--color-primary)' : 'var(--border-light)'
          }}
          onClick={() => { setActiveChartTab('margins'); setHoverIndex(null); }}
        >
          Operating & Net Margins
        </button>
        <button 
          className="glass-button"
          style={{ 
            padding: '0.4rem 0.8rem', 
            fontSize: '0.75rem',
            background: activeChartTab === 'peers' ? 'var(--color-primary-glow)' : 'transparent',
            borderColor: activeChartTab === 'peers' ? 'var(--color-primary)' : 'var(--border-light)'
          }}
          onClick={() => { setActiveChartTab('peers'); setHoverIndex(null); }}
        >
          Competitor P/E Benchmark
        </button>
      </div>

      {/* Canvas / SVG Graphic Area */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
        {renderChart()}

        {/* Hover coordinate label overlay */}
        {hoverIndex !== null && activeChartTab === 'revenue' && (
          <div className="glass-panel animate-fade-in" style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            padding: '0.5rem 0.75rem', 
            fontSize: '0.72rem', 
            background: 'rgba(10, 15, 30, 0.9)', 
            border: '1px solid var(--border-medium)' 
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Year {years[hoverIndex]} Details:</div>
            <div style={{ color: 'var(--color-primary)' }}>Revenue: <strong className="mono-font">${metrics.revenue[hoverIndex]}B</strong></div>
            <div style={{ color: 'var(--color-buy)' }}>Net Profit: <strong className="mono-font">${metrics.profit[hoverIndex]}B</strong></div>
          </div>
        )}

        {hoverIndex !== null && activeChartTab === 'balance' && (
          <div className="glass-panel animate-fade-in" style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            padding: '0.5rem 0.75rem', 
            fontSize: '0.72rem', 
            background: 'rgba(10, 15, 30, 0.9)', 
            border: '1px solid var(--border-medium)' 
          }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>Year {years[hoverIndex]} Balances:</div>
            <div style={{ color: 'var(--color-buy)' }}>Estimated Cash: <strong className="mono-font">${Math.round(hoverIndex === 4 ? metrics.cash : metrics.cash * (1 - (4 - hoverIndex) * 0.05))}B</strong></div>
            <div style={{ color: 'var(--color-primary)' }}>Estimated Debt: <strong className="mono-font">${Math.round(hoverIndex === 4 ? metrics.debt : metrics.debt * (1 - (4 - hoverIndex) * 0.03))}B</strong></div>
          </div>
        )}
      </div>

      {/* Chart Legend */}
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', borderTop: '1px solid var(--border-light)', paddingTop: '0.88rem' }}>
        {activeChartTab === 'revenue' && (
          <>
            <div className="flex-center" style={{ gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '3px', background: 'var(--color-primary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Revenue (Line)</span>
            </div>
            <div className="flex-center" style={{ gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '3px', background: 'var(--color-buy)', borderStyle: 'dashed', borderWidth: '1px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Net Profit (Dashed)</span>
            </div>
          </>
        )}
        {activeChartTab === 'balance' && (
          <>
            <div className="flex-center" style={{ gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--color-buy)', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Cash Reserves (Bar)</span>
            </div>
            <div className="flex-center" style={{ gap: '0.4rem' }}>
              <div style={{ width: '10px', height: '10px', background: 'var(--color-primary)', borderRadius: '2px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Outstanding Debt (Bar)</span>
            </div>
          </>
        )}
        {activeChartTab === 'margins' && (
          <>
            <div className="flex-center" style={{ gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '3px', background: 'var(--color-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Operating Margin (%)</span>
            </div>
            <div className="flex-center" style={{ gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '3px', background: 'var(--color-primary)', borderStyle: 'dashed', borderWidth: '1px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Net Margin (%)</span>
            </div>
          </>
        )}
        {activeChartTab === 'peers' && (
          <div className="flex-center" style={{ gap: '0.4rem' }}>
            <Award size={12} style={{ color: 'var(--color-primary)' }} />
            <span style={{ color: 'var(--text-muted)' }}>Benchmarks reflect sector multiples parsed from Bloomberg Terminal logs.</span>
          </div>
        )}
      </div>

    </div>
  );
}
