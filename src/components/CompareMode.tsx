import { useState } from 'react';
import { Layers, Plus, Trash2, Award } from 'lucide-react';
import { generateCompanyAnalysis, getCompanyData } from '../services/agentEngine';
import type { CompanyAnalysis } from '../services/agentEngine';

export default function CompareMode() {
  const [comparedTickers, setComparedTickers] = useState<string[]>(['AAPL', 'TSLA']);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ name: string; ticker: string; logo: string }[]>([]);

  // Resolve analysis structures
  const analyses: CompanyAnalysis[] = comparedTickers.map(t => generateCompanyAnalysis(t));

  const handleAddTicker = (ticker: string) => {
    if (comparedTickers.includes(ticker)) return;
    if (comparedTickers.length >= 3) {
      // Remove first and append new
      setComparedTickers([...comparedTickers.slice(1), ticker]);
    } else {
      setComparedTickers([...comparedTickers, ticker]);
    }
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleRemoveTicker = (ticker: string) => {
    if (comparedTickers.length <= 1) return; // Keep at least one
    setComparedTickers(comparedTickers.filter(t => t !== ticker));
  };

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSuggestions(getCompanyData(val));
    } else {
      setSuggestions([]);
    }
  };

  // Determine winner
  const getWinner = (): CompanyAnalysis | null => {
    if (analyses.length === 0) return null;
    return analyses.reduce((prev, current) => {
      return (current.investmentScore > prev.investmentScore) ? current : prev;
    });
  };

  const winner = getWinner();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title section and selector */}
      <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={22} style={{ color: 'var(--color-primary)' }} />
            <span>Side-by-Side Asset Benchmarking</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Compare financial ratios, safety alerts, and DCF intrinsic valuations of up to 3 tickers.</p>
        </div>

        {/* Quick Add Search Bar */}
        <div style={{ position: 'relative', width: '320px' }}>
          <div className="glass-panel flex-between" style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)' }}>
            <Plus size={16} style={{ color: 'var(--color-primary)' }} />
            <input 
              type="text" 
              placeholder="Add ticker to comparison..."
              value={searchQuery}
              onChange={e => handleQueryChange(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                marginLeft: '0.5rem',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>
          
          {suggestions.length > 0 && (
            <div className="glass-panel" style={{ 
              position: 'absolute', 
              top: '110%', 
              left: 0, 
              right: 0, 
              borderRadius: '8px', 
              zIndex: 50, 
              maxHeight: '200px', 
              overflowY: 'auto',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
            }}>
              {suggestions.map(s => (
                <div 
                  key={s.ticker} 
                  className="search-suggestion-item"
                  onClick={() => handleAddTicker(s.ticker)}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                >
                  <span>{s.logo} {s.name} ({s.ticker})</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+ Add</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Winner Spotlight Card */}
      {winner && (
        <div className="glass-panel animate-slide-up" style={{ padding: '1.5rem', background: 'rgba(16, 25, 48, 0.45)', border: '1px solid rgba(99, 102, 241, 0.25)', position: 'relative' }}>
          <div className="glow-border-indigo" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 'inherit' }} />
          <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>AI COMMITTEE WINNER DECISION</span>
            <Award size={18} style={{ color: 'var(--color-hold)' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{winner.logo}</span>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>{winner.name} ({winner.ticker})</h3>
              <span className="badge badge-buy" style={{ fontSize: '0.75rem' }}>Winner: {winner.investmentScore}/100 Investment Score</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Recommendation Summary:</strong> Based on historical margins ({winner.metrics.netMargin}% net profit), 
            robust capitalization (${winner.metrics.cash}B cash), and DCF margin of safety, the committee selects **{winner.ticker}** as the optimal risk-adjusted allocation candidate compared to other items in the deck.
          </p>
        </div>
      )}

      {/* Comparison Grid Table */}
      <div className="glass-panel" style={{ overflowX: 'auto', background: 'rgba(8, 12, 24, 0.4)', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-medium)', height: '45px' }}>
              <th style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, paddingLeft: '0.5rem' }}>METRICS BENCHMARK</th>
              {analyses.map(a => (
                <th key={a.ticker} style={{ padding: '0.5rem' }}>
                  <div className="flex-between">
                    <div className="flex-center" style={{ gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{a.logo}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{a.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{a.ticker}</div>
                      </div>
                    </div>
                    {analyses.length > 1 && (
                      <button 
                        onClick={() => handleRemoveTicker(a.ticker)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Remove from comparison"
                      >
                        <Trash2 size={14} hover-color="var(--color-sell)" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Recommendation */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>AI Recommendation</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem' }}>
                  <span className={`badge ${a.finalRecommendation.includes('BUY') ? 'badge-buy' : a.finalRecommendation.includes('SELL') ? 'badge-sell' : 'badge-hold'}`}>
                    {a.finalRecommendation}
                  </span>
                </td>
              ))}
            </tr>

            {/* Investment Score */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Investment Score</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                  {a.investmentScore}/100
                </td>
              ))}
            </tr>

            {/* DCF Intrinsic Value */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>DCF Intrinsic Value</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  ${a.valuation.intrinsicValue}
                </td>
              ))}
            </tr>

            {/* Valuation Status */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Valuation Status</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem' }}>
                  <span style={{
                    color: a.valuation.valuationStatus === 'Undervalued' ? 'var(--color-buy)' : a.valuation.valuationStatus === 'Overvalued' ? 'var(--color-sell)' : 'var(--color-hold)',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}>
                    {a.valuation.valuationStatus}
                  </span>
                </td>
              ))}
            </tr>

            {/* Cash vs Debt */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Cash vs Debt</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--color-buy)' }}>${a.metrics.cash}B</span>
                  <span style={{ color: 'var(--text-muted)' }}> / </span>
                  <span style={{ color: 'var(--color-sell)' }}>${a.metrics.debt}B</span>
                </td>
              ))}
            </tr>

            {/* Net Margin */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Net Profit Margin</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  {a.metrics.netMargin}%
                </td>
              ))}
            </tr>

            {/* PE Ratio */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>P/E Multiple</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  {a.valuation.pe}x
                </td>
              ))}
            </tr>

            {/* PEG Ratio */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>PEG Multiple</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  {a.valuation.peg}x
                </td>
              ))}
            </tr>

            {/* Financial Health Score */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Financial Health</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  {a.financialHealthScore}/100
                </td>
              ))}
            </tr>

            {/* News Sentiment */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>News Sentiment</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                  {a.newsSentiment}/100
                </td>
              ))}
            </tr>

            {/* Risk Meter */}
            <tr style={{ borderBottom: '1px solid var(--border-light)', height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Risk Index</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', color: 'var(--color-sell)', fontFamily: 'var(--font-mono)' }}>
                  {a.riskMeter}/100
                </td>
              ))}
            </tr>

            {/* Moat Score */}
            <tr style={{ height: '45px' }}>
              <td style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem' }}>Moat Score</td>
              {analyses.map(a => (
                <td key={a.ticker} style={{ padding: '0.5rem', color: 'var(--color-hold)', fontFamily: 'var(--font-mono)' }}>
                  {a.moatScore}/100
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
