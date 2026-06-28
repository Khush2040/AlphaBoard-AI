import { useState } from 'react';
import { Layers, Activity, Cpu, Clock, Code, Shield } from 'lucide-react';
import type { AgentNode } from '../services/agentEngine';

interface RecruiterModeProps {
  nodes: AgentNode[];
}

export default function RecruiterMode({ nodes }: RecruiterModeProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('planner');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Graph Node Positions (X, Y layout coordinates inside a viewBox)
  const nodePositions: Record<string, { x: number; y: number }> = {
    planner: { x: 50, y: 30 },
    financial: { x: 15, y: 130 },
    news: { x: 30, y: 130 },
    market: { x: 45, y: 130 },
    risk: { x: 60, y: 130 },
    competition: { x: 75, y: 130 },
    esg: { x: 90, y: 130 },
    valuation: { x: 50, y: 220 },
    bull: { x: 25, y: 310 },
    bear: { x: 50, y: 310 },
    advocate: { x: 75, y: 310 },
    factcheck: { x: 50, y: 400 },
    chairman: { x: 50, y: 490 }
  };

  // Compute Total Metrics
  const totalTokens = nodes.reduce((sum, n) => sum + n.tokensUsed, 0);
  const totalLatency = nodes.reduce((sum, n) => sum + n.latency, 0);
  const averageLatency = Math.round(totalLatency / (nodes.length || 1));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={22} style={{ color: 'var(--color-primary)' }} />
          <span>LangGraph Architecture Visualizer</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Under-the-hood structural audit: inspect the state transitions, nodes, prompt templates, and execution latency logs.</p>
      </div>

      {/* Stats Summary cards */}
      <div className="grid-4">
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Activity size={24} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>STATE ENGINE STATUS</div>
            <div className="mono-font" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-buy)' }}>RUN_SUCCESS</div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Cpu size={24} style={{ color: 'var(--color-secondary)' }} />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TOTAL TOKENS CONSUMED</div>
            <div className="mono-font" style={{ fontSize: '1rem', fontWeight: 700 }}>{totalTokens.toLocaleString()}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={24} style={{ color: 'var(--color-hold)' }} />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>TOTAL SYSTEM LATENCY</div>
            <div className="mono-font" style={{ fontSize: '1.05rem', fontWeight: 700 }}>
              {(totalLatency / 1000).toFixed(2)}s <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>(avg: {averageLatency}ms)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Code size={24} style={{ color: 'var(--color-buy)' }} />
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>PROMPT FLOW PIPELINE</div>
            <div className="mono-font" style={{ fontSize: '1rem', fontWeight: 700 }}>13 NODES / 24 EDGES</div>
          </div>
        </div>
      </div>

      {/* Main visual panel layout split */}
      <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 0.8fr', alignItems: 'start' }}>
        
        {/* SVG State Graph View */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-title)' }}>LangGraph State Transition Graph</h3>
          
          <div style={{ position: 'relative', width: '100%', height: '540px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
            <svg viewBox="0 0 800 540" style={{ width: '100%', height: '100%' }}>
              
              {/* Animated Edges (Lines between nodes) */}
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--border-medium)" />
                </marker>
                <marker id="arrow-glow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" />
                </marker>
              </defs>

              {/* Edge connectors mapping */}
              {/* Planner to Parallel nodes */}
              {['financial', 'news', 'market', 'risk', 'competition', 'esg'].map(target => {
                const start = nodePositions.planner;
                const end = nodePositions[target];
                const startX = (start.x / 100) * 800;
                const startY = (start.y / 100) * 540;
                const endX = (end.x / 100) * 800;
                const endY = (end.y / 100) * 540;

                const isPathActive = selectedNodeId === 'planner' || selectedNodeId === target;
                
                return (
                  <line 
                    key={target}
                    x1={startX} y1={startY + 15} 
                    x2={endX} y2={endY - 20} 
                    stroke={isPathActive ? 'var(--color-primary)' : 'var(--border-light)'} 
                    strokeWidth={isPathActive ? '1.5' : '0.8'}
                    strokeDasharray={isPathActive ? '4 2' : 'none'}
                    markerEnd={isPathActive ? 'url(#arrow-glow)' : 'url(#arrow)'}
                  />
                );
              })}

              {/* Parallel nodes to Valuation */}
              {['financial', 'news', 'market', 'risk', 'competition', 'esg'].map(source => {
                const start = nodePositions[source];
                const end = nodePositions.valuation;
                const startX = (start.x / 100) * 800;
                const startY = (start.y / 100) * 540;
                const endX = (end.x / 100) * 800;
                const endY = (end.y / 100) * 540;
                const isPathActive = selectedNodeId === source || selectedNodeId === 'valuation';

                return (
                  <line 
                    key={source}
                    x1={startX} y1={startY + 20} 
                    x2={endX} y2={endY - 20} 
                    stroke={isPathActive ? 'var(--color-primary)' : 'var(--border-light)'} 
                    strokeWidth={isPathActive ? '1.5' : '0.8'}
                    markerEnd={isPathActive ? 'url(#arrow-glow)' : 'url(#arrow)'}
                  />
                );
              })}

              {/* Valuation to Debate layers */}
              {['bull', 'bear', 'advocate'].map(target => {
                const start = nodePositions.valuation;
                const end = nodePositions[target];
                const startX = (start.x / 100) * 800;
                const startY = (start.y / 100) * 540;
                const endX = (end.x / 100) * 800;
                const endY = (end.y / 100) * 540;
                const isPathActive = selectedNodeId === 'valuation' || selectedNodeId === target;

                return (
                  <line 
                    key={target}
                    x1={startX} y1={startY + 20} 
                    x2={endX} y2={endY - 20} 
                    stroke={isPathActive ? 'var(--color-primary)' : 'var(--border-light)'} 
                    strokeWidth={isPathActive ? '1.5' : '0.8'}
                    markerEnd={isPathActive ? 'url(#arrow-glow)' : 'url(#arrow)'}
                  />
                );
              })}

              {/* Debate to Fact Checker */}
              {['bull', 'bear', 'advocate'].map(source => {
                const start = nodePositions[source];
                const end = nodePositions.factcheck;
                const startX = (start.x / 100) * 800;
                const startY = (start.y / 100) * 540;
                const endX = (end.x / 100) * 800;
                const endY = (end.y / 100) * 540;
                const isPathActive = selectedNodeId === source || selectedNodeId === 'factcheck';

                return (
                  <line 
                    key={source}
                    x1={startX} y1={startY + 20} 
                    x2={endX} y2={endY - 20} 
                    stroke={isPathActive ? 'var(--color-primary)' : 'var(--border-light)'} 
                    strokeWidth={isPathActive ? '1.5' : '0.8'}
                    markerEnd={isPathActive ? 'url(#arrow-glow)' : 'url(#arrow)'}
                  />
                );
              })}

              {/* Factcheck to Chairman */}
              <line 
                x1={(nodePositions.factcheck.x / 100) * 800} 
                y1={(nodePositions.factcheck.y / 100) * 540 + 20} 
                x2={(nodePositions.chairman.x / 100) * 800} 
                y2={(nodePositions.chairman.y / 100) * 540 - 20} 
                stroke={selectedNodeId === 'factcheck' || selectedNodeId === 'chairman' ? 'var(--color-primary)' : 'var(--border-light)'} 
                strokeWidth="1.5"
                markerEnd="url(#arrow-glow)"
              />

              {/* Nodes Circles/Labels */}
              {nodes.map(n => {
                const pos = nodePositions[n.id];
                const xCo = (pos.x / 100) * 800;
                const yCo = (pos.y / 100) * 540;
                const isActive = n.id === selectedNodeId;

                return (
                  <g 
                    key={n.id} 
                    transform={`translate(${xCo}, ${yCo})`}
                    onClick={() => setSelectedNodeId(n.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing indicator ring */}
                    {isActive && (
                      <circle cx="0" cy="0" r="24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" className="animate-pulse-glow" />
                    )}
                    
                    {/* Circle shape */}
                    <circle 
                      cx="0" cy="0" r="18" 
                      fill="var(--bg-tertiary)" 
                      stroke={isActive ? 'var(--color-primary)' : 'var(--border-medium)'} 
                      strokeWidth="2" 
                    />
                    
                    {/* Label inside circle */}
                    <text cx="0" cy="0" y="4" textAnchor="middle" fill={isActive ? 'var(--color-primary)' : 'var(--text-primary)'} fontSize="8" fontWeight="700" fontFamily="var(--font-mono)">
                      {n.id.substring(0, 3).toUpperCase()}
                    </text>

                    {/* Name subtitle tooltip below circle */}
                    <text cx="0" cy="0" y="32" textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="600" fontFamily="var(--font-sans)">
                      {n.name}
                    </text>
                  </g>
                );
              })}

            </svg>
          </div>
        </div>

        {/* Node Detail Inspector Inspector */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', border: '1px solid var(--border-light)', minHeight: '540px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={16} style={{ color: 'var(--color-primary)' }} />
            <span>Agent Node Inspector</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Identity details */}
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-primary)' }}>{selectedNode.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Node ID: <code className="mono-font" style={{ color: 'var(--color-secondary)' }}>{selectedNode.id}</code></div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>{selectedNode.role}</div>
            </div>

            {/* Run times */}
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div className="glass-card">
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LATENCY</div>
                <div className="mono-font" style={{ fontWeight: 700, color: 'var(--color-hold)' }}>{selectedNode.latency} ms</div>
              </div>
              <div className="glass-card">
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>TOKENS GENERATED</div>
                <div className="mono-font" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{selectedNode.tokensUsed} tokens</div>
              </div>
            </div>

            {/* Prompt template */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Prompt Template Schema</div>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--border-light)', 
                borderRadius: '6px', 
                padding: '0.75rem',
                fontSize: '0.72rem',
                color: '#cbd5e1',
                overflowX: 'auto',
                maxHeight: '120px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedNode.prompt}
              </pre>
            </div>

            {/* Response metadata */}
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Generated Node Response</div>
              <pre style={{ 
                background: 'rgba(0,0,0,0.3)', 
                border: '1px solid var(--border-light)', 
                borderRadius: '6px', 
                padding: '0.75rem',
                fontSize: '0.72rem',
                color: 'var(--color-buy)',
                overflowX: 'auto',
                maxHeight: '120px',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedNode.response}
              </pre>
            </div>
            
            {/* Headers API parameters simulated */}
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={12} style={{ color: 'var(--color-buy)' }} />
              <span>Sanitized parameters. Executed using dynamic state updates.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
