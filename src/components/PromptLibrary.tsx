import { useState } from 'react';
import { BookOpen, Copy, Check, Terminal, Code, Cpu, Info } from 'lucide-react';
import type { CompanyAnalysis } from '../services/agentEngine';

interface PromptLibraryProps {
  analysisData: CompanyAnalysis;
}

interface AgentPromptDetails {
  id: string;
  name: string;
  role: string;
  systemPrompt: string;
  fewShots: string;
  parameters: string[];
}

export default function PromptLibrary({ analysisData }: PromptLibraryProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('planner');
  const [copied, setCopied] = useState(false);

  const agentsPrompts: AgentPromptDetails[] = [
    {
      id: 'planner',
      name: 'Planner Agent',
      role: 'Orchestrates the research DAG flow, parses inputs, and delegates sub-tasks to specialists.',
      parameters: ['companyName', 'ticker', 'timestamp'],
      systemPrompt: `You are the Lead Investment Coordinator & Planner Agent.
Your task is to orchestrate a deep financial analysis on {companyName} ({ticker}).
Generate a structured task-list map, locate current SEC filing registries, and schedule sub-processes for the Analyst group:
1. Financial & Cash Flow Statement Audit
2. News Sentiment & Sector Risk Profiling
3. Valuations, Multiples, and WACC calculations
4. Competitor benchmarking
5. ESG compliance checklists.

Output JSON format map containing tasks, targets, and expected context schemas. Do not write markdown text.`,
      fewShots: `Input: Apple Inc. (AAPL)
Output:
{
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "workflow": "StandardDAG_v2",
  "delegatedNodes": ["financial", "news", "market", "risk", "competition", "esg"]
}`
    },
    {
      id: 'financial',
      name: 'Financial Analyst',
      role: 'Performs balance sheet, margin expansion, and quantitative cash-flow analysis.',
      parameters: ['ticker', 'grossMargin', 'netMargin', 'peRatio', 'debtToEquity'],
      systemPrompt: `You are the Principal Financial Analyst for the Committee.
Examine the financial records of {ticker}. Review the gross margin ({grossMargin}%) and net margin ({netMargin}%).
Formulate a rigorous audit addressing:
- Growth velocity of revenues and net income.
- Balance sheet leverage (Debt-to-Equity: {debtToEquity}).
- P/E ratio valuation ({peRatio}) compared to historic trading multipliers.

Highlight positive catalysts and negative constraints, detailing cash conversion cycles and debt maturities.`,
      fewShots: `Input: AAPL (Gross margin: 44.5%, Debt-to-Equity: 1.45)
Output:
Gross profitability remains highly defensive. However, leverage of 1.45 indicates high share buyback coverage using term debt. Monitor operating cash flows relative to debt service ratios.`
    },
    {
      id: 'news',
      name: 'News Sentiment Specialist',
      role: 'Parses current event feeds and computes headlines sentiment scores.',
      parameters: ['companyName', 'recentNews'],
      systemPrompt: `You are the News Sentiment Specialist.
Scrape recent press releases and headlines for {companyName}.
Compute average news sentiment velocity (positive, neutral, negative bias).
Current feed summary: {recentNews}

Determine if media commentary is driven by operational growth, product cycles, or macroeconomic fears (such as antitrust regulatory headwinds).`,
      fewShots: `Input: Tesla Inc. (News: Autopilot regulatory audits, factory expansions)
Output:
Sentiment Bias: 52% Neutral, 28% Negative, 20% Positive. Factory expansions support long-term capacity, but intense regulatory probe over driver assistant systems introduces immediate legal risk.`
    },
    {
      id: 'market',
      name: 'Market Sentiment Agent',
      role: 'Monitors short interest, price trend support levels, and volume velocity.',
      parameters: ['ticker', 'stockPrice', 'priceChangePercent'],
      systemPrompt: `You are the Market Sentiment Analyst.
Audit the trading behavior of {ticker} at current price $ {stockPrice} ({priceChangePercent}%).
- Identify technical support and resistance bands.
- Monitor volume divergence signals.
- Track institutional fund accumulation changes.

Assess short-term capital flow trends and relative strength index (RSI) metrics.`,
      fewShots: `Input: MSFT ($420.50, +1.2%)
Output:
Accumulation trend remains strong, supported by the 50-day moving average. Immediate resistance resides at $435. Trading volumes indicate low seller exhaustion.`
    },
    {
      id: 'risk',
      name: 'Risk Auditor',
      role: 'Identifies operational, regulatory, credit, and supply chain red flags.',
      parameters: ['ticker', 'redFlags'],
      systemPrompt: `You are the Investment Risk Auditor.
Analyze security risks for {ticker}.
Evaluate potential structural, supply-chain, regulatory, and credit issues.
Current red flag warnings to inspect: {redFlags}

Assign a risk classification level (Low, Medium, High) and detail immediate triggers that could damage equity valuation.`,
      fewShots: `Input: AAPL (Warnings: Supply chain concentration in Asia, Antitrust suits)
Output:
Risk Level: MEDIUM. High revenue concentration in China manufacturing hubs represents a geopolitical supply barrier. App Store legal disputes present margin pressure risk.`
    },
    {
      id: 'competition',
      name: 'Competition Analyst',
      role: 'Benchmarks margins, market share, and product defensibility.',
      parameters: ['ticker', 'competitors'],
      systemPrompt: `You are the Competition Specialist.
Compare {ticker} with key industry peers: {competitors}.
Perform a competitive audit detailing:
- Market share defenses (Moat depth).
- Pricing power elasticity.
- R&D expenditure effectiveness.

State who holds the technology lead and relative margin advantage.`,
      fewShots: `Input: NVDA vs AMD/INTC
Output:
NVIDIA retains 85%+ market share in AI accelerators. AMD is priced competitively, but CUDA ecosystem lock-in represents an impenetrable moat for software integration.`
    },
    {
      id: 'esg',
      name: 'ESG Compliance Auditor',
      role: 'Checks environmental footprint, social policies, and corporate governance.',
      parameters: ['ticker', 'esgScore'],
      systemPrompt: `You are the ESG Compliance Expert.
Examine the environmental, social, and governance footprint of {ticker} (Score: {esgScore}/100).
Audit:
- Carbon emission offsets.
- Labor conditions in manufacturing supply lines.
- Board independence and voting structures.

Deliver compliance recommendations for SRI (Socially Responsible Investing) institutions.`,
      fewShots: `Input: MSFT (ESG: 82/100)
Output:
Top-tier governance ratings. Focus on carbon-neutral datacenters supports long-term ESG mandates. Supply line auditing is adequate.`
    },
    {
      id: 'valuation',
      name: 'Valuation Specialist',
      role: 'Operates WACC, discount rates, DCF, and fair value calculation engines.',
      parameters: ['ticker', 'intrinsicValue', 'discountRate'],
      systemPrompt: `You are the Valuation Expert.
Reconstruct the intrinsic valuation of {ticker} using multi-stage Discounted Cash Flow models.
- Set Base Discount Rate: {discountRate}%.
- Intrinsic value target: $ {intrinsicValue}.

Perform sensitivity calculations on WACC variance and terminal growth rates. Explain the margin of safety relative to current stock price.`,
      fewShots: `Input: Intrinsic: $210, Stock: $185
Output:
Stock trades at a 12% discount to intrinsic DCF fair value, representing a robust margin of safety for capital entry.`
    },
    {
      id: 'bull',
      name: 'Bull Advocate',
      role: 'Builds aggressive upside valuation arguments and growth expansion catalysts.',
      parameters: ['ticker', 'upsideRating'],
      systemPrompt: `You are the Bull Advocate inside the investment committee.
Formulate the strongest growth thesis for {ticker}.
Highlight:
- Addressable market (TAM) expansion.
- Pricing hikes and operating leverage.
- Capital allocation returns (ROIC).

Frame an upside targets projection.`,
      fewShots: `Thesis: AAPL ecosystem services expansion will offset iPhone hardware stagnation, driving gross margins toward 50%.`
    },
    {
      id: 'bear',
      name: 'Bear Advocate',
      role: 'Identifies downside margin pressures, slowing growth, and valuation bubbles.',
      parameters: ['ticker', 'downsideRisk'],
      systemPrompt: `You are the Bear Advocate inside the investment committee.
Expose all vulnerabilities in the growth thesis for {ticker}.
Highlight:
- Slowing growth rates.
- Multiple contraction indicators.
- Macro headwinds, customer churn, and competitor gains.

Draft a conservative downside fair value target.`,
      fewShots: `Thesis: TSLA trades at an extreme automotive multiplier while EV sales stagnate. Energy storage margins are insufficient to support a high P/E ratio.`
    },
    {
      id: 'advocate',
      name: "Devil's Advocate",
      role: 'Challenges consensus biases, stress-tests logical fallacies, and queries risk outliers.',
      parameters: ['ticker', 'consensusRating'],
      systemPrompt: `You are the Devil's Advocate.
Challenge the consensus bullish/bearish rating of the committee for {ticker}.
Identify:
- Logical fallacies in growth calculations.
- Blind spots in competitive moat assumptions.
- Outlier risk events (geopolitical disruptions, executive churn, regulatory bans).

Force the committee to defend their assumptions.`,
      fewShots: `Challenge: The committee assumes gross margins will remain static. In a severe trade embargo, supply components pricing will double. Defend the current safety margin.`
    },
    {
      id: 'factcheck',
      name: 'Fact-Checker Node',
      role: 'Cross-checks quantitative numbers and financial ratios for mathematical integrity.',
      parameters: ['ticker', 'financialData'],
      systemPrompt: `You are the Committee Fact-Checker Node.
Cross-reference every financial metric, PE ratio, and margin percentage quoted by prior nodes.
Verify that:
- Operating cash flows match capital expenditures delta.
- Ratios are mathematically accurate.
- Historic citations are verified.

List any quantitative discrepancies.`,
      fewShots: `Audit: Intrinsic valuation calculations verified. Margins match SEC 10-Q report filings. No mathematical issues found.`
    },
    {
      id: 'chairman',
      name: 'Committee Chairman',
      role: 'Aggregates votes, scores consensus confidence, and structures the final recommendation.',
      parameters: ['ticker', 'voteBuy', 'voteHold', 'voteSell', 'confidence'],
      systemPrompt: `You are the Chairman of the Investment Committee.
Aggregate all specialists arguments, debates, and risk profiles.
Review the final vote count:
- BUY: {voteBuy}
- HOLD: {voteHold}
- SELL: {voteSell}
Consensus Confidence Score: {confidence}%.

Generate a professional, executive-grade investment recommendation memo for institutional capital managers.`,
      fewShots: `Memo: BUY AAPL. The committee establishes a consensus buy target based on margin preservation and high services revenue momentum, backed by a 12% DCF margin of safety.`
    }
  ];

  const activeAgent = agentsPrompts.find(a => a.id === selectedAgentId) || agentsPrompts[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render prompt with live company details replaced
  const getRenderedPrompt = (systemText: string) => {
    let text = systemText;
    text = text.replace(/{companyName}/g, analysisData.name);
    text = text.replace(/{ticker}/g, analysisData.ticker);
    text = text.replace(/{grossMargin}/g, (analysisData.metrics.operatingMargin * 1.2).toFixed(1));
    text = text.replace(/{netMargin}/g, analysisData.metrics.netMargin.toString());
    text = text.replace(/{peRatio}/g, analysisData.valuation.pe.toString());
    text = text.replace(/{debtToEquity}/g, (analysisData.metrics.debt / (analysisData.metrics.cash || 1)).toFixed(2));
    text = text.replace(/{esgScore}/g, (analysisData.investmentScore - 5).toString());
    text = text.replace(/{discountRate}/g, '7.5');
    
    // Competitors fallback
    const competitors = ['MSFT', 'GOOGL', 'AMZN'];
    text = text.replace(/{competitors}/g, competitors.join(', '));
    
    // Parse redFlags object
    const flagList: string[] = [];
    if (analysisData.redFlags.accountingFraudRisk !== 'Low') flagList.push(`Accounting Fraud Risk: ${analysisData.redFlags.accountingFraudRisk}`);
    if (analysisData.redFlags.insiderSelling !== 'None') flagList.push(`Heavy Insider Selling`);
    if (analysisData.redFlags.debtIncrease) flagList.push('Rising Leverage');
    if (analysisData.redFlags.weakCashFlow) flagList.push('Cash Flow Divergence');
    if (flagList.length === 0) flagList.push('No anomalies detected');
    text = text.replace(/{redFlags}/g, flagList.join('; '));
    
    // Fallback news summary from sources
    const newsSummary = analysisData.sources.slice(0, 2).map(s => s.title).join(' | ');
    text = text.replace(/{recentNews}/g, newsSummary);
    
    // Fallback vote values
    const voteBuy = analysisData.votes.filter(v => v.vote === 'BUY').length;
    const voteHold = analysisData.votes.filter(v => v.vote === 'HOLD').length;
    const voteSell = analysisData.votes.filter(v => v.vote === 'SELL').length;
    
    text = text.replace(/{voteBuy}/g, voteBuy.toString());
    text = text.replace(/{voteHold}/g, voteHold.toString());
    text = text.replace(/{voteSell}/g, voteSell.toString());
    text = text.replace(/{confidence}/g, analysisData.finalConfidence.toString());

    return text;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={22} style={{ color: 'var(--color-primary)' }} />
          <span>Investment Committee Prompt Library</span>
        </h2>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Audit the system instructions, parameters, and structural Chain-of-Thought few-shots driving the 13 neural committee agents.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid-2" style={{ gridTemplateColumns: '0.65fr 1.35fr', alignItems: 'start' }}>
        
        {/* Left Side: Agents List */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ padding: '0.5rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Committee Nodes
          </div>
          {agentsPrompts.map(agent => (
            <button
              key={agent.id}
              className="glass-button"
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                border: 'none',
                background: selectedAgentId === agent.id ? 'var(--color-primary-glow)' : 'transparent',
                color: selectedAgentId === agent.id ? 'var(--color-primary)' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                padding: '0.5rem 0.75rem'
              }}
              onClick={() => setSelectedAgentId(agent.id)}
            >
              <Cpu size={12} style={{ marginRight: '0.5rem' }} />
              <span>{agent.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side: Detailed Prompt View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Agent Role Info */}
          <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '3px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-title)', marginBottom: '0.35rem' }}>
              {activeAgent.name} System Instructions
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{activeAgent.role}</p>
          </div>

          {/* Prompt Parameters Variables */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Info size={14} style={{ color: 'var(--color-hold)' }} />
              <span>Input Variables Mapping</span>
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {activeAgent.parameters.map(param => (
                <span
                  key={param}
                  className="mono-font"
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: 'var(--color-primary)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {"{"}{param}{"}"}
                </span>
              ))}
            </div>
          </div>

          {/* System Prompt View */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)', position: 'relative' }}>
            <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>System Instructions Prompt Template</span>
              <button
                className="glass-button"
                style={{ padding: '0.35rem 0.6rem', fontSize: '0.72rem', gap: '0.35rem' }}
                onClick={() => handleCopy(activeAgent.systemPrompt)}
              >
                {copied ? <Check size={12} style={{ color: 'var(--color-buy)' }} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre
              className="mono-font"
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                fontSize: '0.78rem',
                lineHeight: '1.4',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto'
              }}
            >
              {activeAgent.systemPrompt}
            </pre>
          </div>

          {/* Rendered Prompt Preview (with active values injected!) */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-buy)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Terminal size={14} />
              <span>Live Injected Prompt Preview ({analysisData.ticker})</span>
            </h4>
            <pre
              className="mono-font"
              style={{
                background: 'rgba(16, 185, 129, 0.02)',
                borderColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '1rem',
                borderRadius: '6px',
                fontSize: '0.78rem',
                lineHeight: '1.4',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto'
              }}
            >
              {getRenderedPrompt(activeAgent.systemPrompt)}
            </pre>
          </div>

          {/* Few-Shot Examples / Chain-of-Thought Prompting */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(8, 12, 24, 0.45)' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Code size={14} />
              <span>Chain-of-Thought Few-Shot Examples</span>
            </h4>
            <pre
              className="mono-font"
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--border-light)',
                fontSize: '0.78rem',
                lineHeight: '1.4',
                color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
                overflowX: 'auto'
              }}
            >
              {activeAgent.fewShots}
            </pre>
          </div>

        </div>
      </div>
    </div>
  );
}
