import { useState } from 'react';
import { Sliders, RefreshCw, Info } from 'lucide-react';
import type { WhatIfState } from '../services/agentEngine';

interface WhatIfSimulatorProps {
  onRecalculate: (state: WhatIfState) => void;
  baseRecommendation: string;
  baseConfidence: number;
}

export default function WhatIfSimulator({ onRecalculate, baseRecommendation, baseConfidence }: WhatIfSimulatorProps) {
  const defaultState: WhatIfState = {
    interestRate: 5.0, // Base US Fed Fund Rate
    inflation: 2.5,    // Base CPI
    revenueGrowth: 0,  // Delta revenue growth percentage
    margins: 0,        // Delta net margin percentage
    taxRate: 21,       // Corporate Tax Rate
    oilPrices: 0       // Delta oil barrel cost
  };

  const [state, setState] = useState<WhatIfState>(defaultState);

  const handleSliderChange = (key: keyof WhatIfState, value: number) => {
    const updated = { ...state, [key]: value };
    setState(updated);
    onRecalculate(updated);
  };

  const handleReset = () => {
    setState(defaultState);
    onRecalculate(defaultState);
  };

  const isModified = JSON.stringify(state) !== JSON.stringify(defaultState);

  return (
    <div className="glass-panel what-if-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', border: '1px solid var(--border-light)' }}>
      {/* Header */}
      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={18} style={{ color: 'var(--color-primary)' }} />
            <span>Macro What-If Simulator</span>
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stress-test valuation models against macroeconomic swings.</span>
        </div>
        
        {isModified && (
          <button 
            className="glass-button" 
            style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            onClick={handleReset}
          >
            <RefreshCw size={10} />
            <span>Reset Projections</span>
          </button>
        )}
      </div>

      {/* Simulator Inputs Sliders */}
      <div>
        {/* Fed Interest Rate */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-secondary)' }}>Federal Funds Rate</span>
            <span className="mono-font" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{state.interestRate.toFixed(1)}%</span>
          </div>
          <input 
            type="range" 
            className="slider-input"
            min="1.0" 
            max="10.0" 
            step="0.1" 
            value={state.interestRate}
            onChange={e => handleSliderChange('interestRate', parseFloat(e.target.value))}
          />
          <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>1.0% (Liquidity flood)</span>
            <span>10.0% (Severe contraction)</span>
          </div>
        </div>

        {/* CPI Inflation Rate */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-secondary)' }}>CPI Inflation Rate</span>
            <span className="mono-font" style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>{state.inflation.toFixed(1)}%</span>
          </div>
          <input 
            type="range" 
            className="slider-input"
            min="0.0" 
            max="12.0" 
            step="0.1" 
            value={state.inflation}
            onChange={e => handleSliderChange('inflation', parseFloat(e.target.value))}
          />
          <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>0.0% (Deflationary risk)</span>
            <span>12.0% (Hyperinflation drag)</span>
          </div>
        </div>

        {/* Revenue Growth Delta */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-secondary)' }}>Revenue Growth adjustment</span>
            <span className="mono-font" style={{ color: state.revenueGrowth >= 0 ? 'var(--color-buy)' : 'var(--color-sell)', fontWeight: 600 }}>
              {state.revenueGrowth >= 0 ? `+${state.revenueGrowth}%` : `${state.revenueGrowth}%`}
            </span>
          </div>
          <input 
            type="range" 
            className="slider-input"
            min="-15" 
            max="15" 
            step="1" 
            value={state.revenueGrowth}
            onChange={e => handleSliderChange('revenueGrowth', parseInt(e.target.value))}
          />
          <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>-15% (Recession decline)</span>
            <span>+15% (Ecosystem expansion)</span>
          </div>
        </div>

        {/* Operating Margin Delta */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-secondary)' }}>Operating Margin adjustment</span>
            <span className="mono-font" style={{ color: state.margins >= 0 ? 'var(--color-buy)' : 'var(--color-sell)', fontWeight: 600 }}>
              {state.margins >= 0 ? `+${state.margins}%` : `${state.margins}%`}
            </span>
          </div>
          <input 
            type="range" 
            className="slider-input"
            min="-10" 
            max="10" 
            step="1" 
            value={state.margins}
            onChange={e => handleSliderChange('margins', parseInt(e.target.value))}
          />
          <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>-10% (Cost inflation)</span>
            <span>+10% (Operating leverage)</span>
          </div>
        </div>

        {/* Corporate Tax Rate */}
        <div className="slider-container">
          <div className="slider-header">
            <span style={{ color: 'var(--text-secondary)' }}>Corporate Income Tax</span>
            <span className="mono-font" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{state.taxRate}%</span>
          </div>
          <input 
            type="range" 
            className="slider-input"
            min="10" 
            max="35" 
            step="1" 
            value={state.taxRate}
            onChange={e => handleSliderChange('taxRate', parseInt(e.target.value))}
          />
          <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>10% (Tax cuts)</span>
            <span>35% (High regulatory rate)</span>
          </div>
        </div>

        {/* Oil barrel price index */}
        <div className="slider-container" style={{ marginBottom: '2rem' }}>
          <div className="slider-header">
            <span style={{ color: 'var(--text-secondary)' }}>Crude Oil price shock</span>
            <span className="mono-font" style={{ color: state.oilPrices >= 0 ? 'var(--color-sell)' : 'var(--color-buy)', fontWeight: 600 }}>
              {state.oilPrices >= 0 ? `+${state.oilPrices}%` : `${state.oilPrices}%`}
            </span>
          </div>
          <input 
            type="range" 
            className="slider-input"
            min="-50" 
            max="100" 
            step="5" 
            value={state.oilPrices}
            onChange={e => handleSliderChange('oilPrices', parseInt(e.target.value))}
          />
          <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span>-50% (Sufficient supply)</span>
            <span>+100% (Energy crisis hike)</span>
          </div>
        </div>

        {/* Real-time Indicator banner */}
        {isModified && (
          <div className="glass-card animate-fade-in" style={{ display: 'flex', gap: '0.75rem', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.88rem' }}>
            <Info size={16} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>Active Macro Stress Simulation</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Target valuation recommendation re-calculated as **{baseRecommendation}** with certainty score of **{baseConfidence}%**.
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
