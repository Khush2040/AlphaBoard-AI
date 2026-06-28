// AlphaBoard AI - LangGraph Multi-Agent Research & Valuation Engine

export interface FinancialMetrics {
  revenue: number[]; // Last 5 years in Billions
  profit: number[];  // Last 5 years in Billions
  cashFlow: number[]; // Last 5 years in Billions
  debt: number; // Billions
  cash: number; // Billions
  sharesOutstanding: number; // Billions
  currentRatio: number;
  quickRatio: number;
  roe: number; // Percentage
  roic: number; // Percentage
  eps: number;  // Dollars
  revenueGrowth: number; // Annual %
  epsGrowth: number; // Annual %
  netMargin: number; // %
  operatingMargin: number; // %
}

export interface ValuationData {
  pe: number;
  peg: number;
  ps: number;
  pb: number;
  enterpriseValue: number; // Billions
  intrinsicValue: number; // DCF dollar value
  fairValue: number;
  valuationStatus: 'Undervalued' | 'Fair Value' | 'Overvalued';
}

export interface RedFlags {
  accountingFraudRisk: 'Low' | 'Medium' | 'High';
  insiderSelling: 'None' | 'Moderate' | 'Heavy';
  debtIncrease: boolean;
  weakCashFlow: boolean;
  negativeNews: boolean;
  creditDowngrade: boolean;
  ceoResignationRisk: 'Low' | 'Medium' | 'High';
  layoffs: string;
  productRecalls: boolean;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface SourceCitation {
  id: string;
  source: string;
  publication: string;
  date: string;
  url: string;
  title: string;
}

export interface AgentMessage {
  agentId: string;
  agentName: string;
  avatarColor: string;
  message: string;
  timestamp: string;
}

export interface AgentVote {
  agentId: string;
  agentName: string;
  vote: 'BUY' | 'HOLD' | 'SELL' | 'PASS';
  reasoning: string;
  confidence: number; // 0 to 100
}

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  latency: number; // ms
  tokensUsed: number;
  prompt: string;
  response: string;
  status: 'pending' | 'running' | 'completed';
}

export interface CompanyAnalysis {
  ticker: string;
  name: string;
  logo: string;
  description: string;
  sector: string;
  industry: string;
  ceo: string;
  headquarters: string;
  employees: number;
  marketCap: number; // Billions
  website: string;
  
  metrics: FinancialMetrics;
  valuation: ValuationData;
  redFlags: RedFlags;
  timeline: TimelineEvent[];
  sources: SourceCitation[];
  
  // Agent Details
  nodes: AgentNode[];
  debate: AgentMessage[];
  votes: AgentVote[];
  
  // Extra Scores
  investmentScore: number; // 0 - 100
  riskMeter: number; // 0 - 100
  moatScore: number; // 0 - 100
  innovationScore: number; // 0 - 100
  financialHealthScore: number; // 0 - 100
  newsSentiment: number; // 0 - 100
  sectorRanking: string;
  
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  
  porter: {
    newEntrants: { score: number; text: string };
    buyers: { score: number; text: string };
    suppliers: { score: number; text: string };
    substitutes: { score: number; text: string };
    rivalry: { score: number; text: string };
  };
  
  businessModel: {
    valueProp: string;
    customerSegments: string;
    channels: string;
    revenueStreams: string;
    keyPartners: string;
  };
  
  memo: string; // Markdown summary
  executiveSummary: string;
  finalRecommendation: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL';
  finalConfidence: number;
}

export interface WhatIfState {
  interestRate: number; // Base %
  inflation: number;    // Base %
  revenueGrowth: number; // % change delta
  margins: number;      // % change delta
  taxRate: number;      // %
  oilPrices: number;    // % change delta
}

// Search History, Favorites, Watchlist & Portfolio Types
export interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  recommendation: string;
}

export interface PortfolioAsset {
  ticker: string;
  name: string;
  allocationPercent: number;
  amount: number;
  expectedReturn: number;
  risk: 'Low' | 'Medium' | 'High';
}

// Mock Database Generator
export function getCompanyData(query: string): { name: string; ticker: string; logo: string }[] {
  const companies = [
    { name: 'Apple Inc.', ticker: 'AAPL', logo: '🍎' },
    { name: 'Tesla Inc.', ticker: 'TSLA', logo: '⚡' },
    { name: 'Microsoft Corporation', ticker: 'MSFT', logo: '💻' },
    { name: 'Nvidia Corporation', ticker: 'NVDA', logo: '🟢' },
    { name: 'Amazon.com Inc.', ticker: 'AMZN', logo: '📦' },
    { name: 'Alphabet Inc.', ticker: 'GOOGL', logo: '🔍' },
    { name: 'Meta Platforms Inc.', ticker: 'META', logo: '👥' },
    { name: 'Netflix Inc.', ticker: 'NFLX', logo: '🎥' },
    { name: 'JPMorgan Chase & Co.', ticker: 'JPM', logo: '🏦' },
    { name: 'Exxon Mobil Corp.', ticker: 'XOM', logo: '🛢️' }
  ];
  
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return companies.filter(c => c.name.toLowerCase().includes(q) || c.ticker.toLowerCase().includes(q));
}

// Generate Detailed Base Research for a specific company
export function generateCompanyAnalysis(nameOrTicker: string): CompanyAnalysis {
  let ticker = nameOrTicker.toUpperCase().trim();
  let name = nameOrTicker;
  let logo = '📈';
  
  const dataMap: Record<string, { name: string; logo: string; ceo: string; sector: string; industry: string; hq: string; emp: number; mcap: number; desc: string; web: string }> = {
    AAPL: {
      name: 'Apple Inc.',
      logo: '🍎',
      ceo: 'Tim Cook',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      hq: 'Cupertino, CA',
      emp: 164000,
      mcap: 3200,
      desc: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services globally. Known for its premium ecosystems, brand stickiness, and high margins.',
      web: 'https://www.apple.com'
    },
    TSLA: {
      name: 'Tesla Inc.',
      logo: '⚡',
      ceo: 'Elon Musk',
      sector: 'Automotive',
      industry: 'Electric Vehicles & Energy',
      hq: 'Austin, TX',
      emp: 140000,
      mcap: 720,
      desc: 'Tesla, Inc. designs, develops, manufactures, sells, and leases fully electric vehicles, energy generation and storage systems, and offers services related to its products. It stands at the forefront of autonomous driving (FSD), robotics, and battery innovation.',
      web: 'https://www.tesla.com'
    },
    MSFT: {
      name: 'Microsoft Corporation',
      logo: '💻',
      ceo: 'Satya Nadella',
      sector: 'Technology',
      industry: 'Systems & Application Software',
      hq: 'Redmond, WA',
      emp: 221000,
      mcap: 3100,
      desc: 'Microsoft Corporation is a global technology giant that produces computer software, consumer electronics, personal computers, and cloud services (Azure). It holds massive competitive moats in office productivity, corporate server systems, and pioneer generative AI investments through OpenAI.',
      web: 'https://www.microsoft.com'
    },
    NVDA: {
      name: 'Nvidia Corporation',
      logo: '🟢',
      ceo: 'Jensen Huang',
      sector: 'Technology',
      industry: 'Semiconductors',
      hq: 'Santa Clara, CA',
      emp: 29600,
      mcap: 2900,
      desc: 'Nvidia Corporation designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market. It is the absolute infrastructure leader powering the AI revolution with its CUDA platform.',
      web: 'https://www.nvidia.com'
    }
  };

  const lookupKey = Object.keys(dataMap).find(k => k === ticker || dataMap[k].name.toLowerCase().includes(ticker.toLowerCase())) || 'AAPL';
  const meta = dataMap[lookupKey];
  ticker = lookupKey;
  name = meta.name;
  logo = meta.logo;

  // Generate realistic Financial Metrics
  let baseRev = 200;
  let baseProf = 40;
  let baseCash = 35;
  let growth = 0.08;
  
  if (ticker === 'AAPL') { baseRev = 385; baseProf = 97; baseCash = 100; growth = 0.06; }
  else if (ticker === 'TSLA') { baseRev = 96; baseProf = 15; baseCash = 13; growth = 0.18; }
  else if (ticker === 'MSFT') { baseRev = 245; baseProf = 88; baseCash = 70; growth = 0.12; }
  else if (ticker === 'NVDA') { baseRev = 96; baseProf = 53; baseCash = 45; growth = 0.55; }

  const revenue = Array.from({ length: 5 }, (_, i) => Math.round(baseRev * Math.pow(1 - growth * 0.7, 4 - i)));
  const profit = Array.from({ length: 5 }, (_, i) => Math.round(baseProf * Math.pow(1 - growth * 0.8, 4 - i)));
  const cashFlow = Array.from({ length: 5 }, (_, i) => Math.round(baseCash * Math.pow(1 - growth * 0.6, 4 - i)));

  const debt = ticker === 'AAPL' ? 106 : ticker === 'TSLA' ? 3.5 : ticker === 'MSFT' ? 44 : 9.5;
  const cash = ticker === 'AAPL' ? 73 : ticker === 'TSLA' ? 29 : ticker === 'MSFT' ? 80 : 26;
  const sharesOutstanding = ticker === 'AAPL' ? 15.4 : ticker === 'TSLA' ? 3.18 : ticker === 'MSFT' ? 7.43 : 24.6;

  const currentRatio = parseFloat((cash * 1.5 / debt).toFixed(2)) || 1.8;
  const quickRatio = parseFloat((cash * 1.1 / debt).toFixed(2)) || 1.4;
  const roe = ticker === 'NVDA' ? 115 : ticker === 'AAPL' ? 154 : 38;
  const roic = ticker === 'NVDA' ? 82 : ticker === 'AAPL' ? 58 : 28;
  const eps = parseFloat((profit[4] / sharesOutstanding).toFixed(2));
  
  const netMargin = parseFloat(((profit[4] / revenue[4]) * 100).toFixed(1));
  const operatingMargin = parseFloat((netMargin * 1.35).toFixed(1));

  // Valuation model - DCF Intrinsic Value
  // Standard DCF: CF_0 * (1 + growth)^t discounted at WACC
  const wacc = 0.085; // 8.5%
  const terminalGrowth = 0.025; // 2.5%
  let dcfVal = 0;
  let projectionGrowth = growth;
  let tempCF = cashFlow[4];
  
  for (let t = 1; t <= 10; t++) {
    if (t > 5) projectionGrowth = Math.max(terminalGrowth, projectionGrowth * 0.8);
    tempCF = tempCF * (1 + projectionGrowth);
    dcfVal += tempCF / Math.pow(1 + wacc, t);
  }
  // Terminal value
  const terminalValue = (tempCF * (1 + terminalGrowth)) / (wacc - terminalGrowth);
  dcfVal += terminalValue / Math.pow(1 + wacc, 10);
  // Intrinsic Value per share
  const intrinsicValue = parseFloat(((dcfVal + cash - debt) / sharesOutstanding).toFixed(2));
  
  // Market Stock Price Mock
  let currentPrice = ticker === 'AAPL' ? 180 : ticker === 'TSLA' ? 175 : ticker === 'MSFT' ? 420 : 125;
  const fairValue = parseFloat((intrinsicValue * 0.95).toFixed(2));
  const ratio = currentPrice / intrinsicValue;
  const valuationStatus = ratio < 0.9 ? 'Undervalued' : ratio > 1.15 ? 'Overvalued' : 'Fair Value';

  const pe = parseFloat((currentPrice / eps).toFixed(1));
  const peg = parseFloat((pe / (growth * 100)).toFixed(2));
  const ps = parseFloat((meta.mcap / revenue[4]).toFixed(1));
  const pb = parseFloat((meta.mcap / (cash * 1.8)).toFixed(1));
  const enterpriseValue = Math.round(meta.mcap + debt - cash);

  const metrics: FinancialMetrics = {
    revenue,
    profit,
    cashFlow,
    debt,
    cash,
    sharesOutstanding,
    currentRatio,
    quickRatio,
    roe,
    roic,
    eps,
    revenueGrowth: parseFloat((growth * 100).toFixed(1)),
    epsGrowth: parseFloat((growth * 90).toFixed(1)),
    netMargin,
    operatingMargin
  };

  const valuation: ValuationData = {
    pe,
    peg,
    ps,
    pb,
    enterpriseValue,
    intrinsicValue,
    fairValue,
    valuationStatus
  };

  // Red Flags
  const redFlags: RedFlags = {
    accountingFraudRisk: ticker === 'TSLA' ? 'Medium' : 'Low',
    insiderSelling: ticker === 'TSLA' ? 'Heavy' : 'Moderate',
    debtIncrease: ticker === 'AAPL',
    weakCashFlow: false,
    negativeNews: ticker === 'TSLA',
    creditDowngrade: false,
    ceoResignationRisk: ticker === 'TSLA' ? 'Medium' : 'Low',
    layoffs: ticker === 'TSLA' ? '10% workforce in restructure' : 'Minor corporate attrition',
    productRecalls: ticker === 'TSLA'
  };

  // Timeline
  const timeline: TimelineEvent[] = [
    { year: '1997', title: 'Critical Turning Point', description: 'Steve Jobs returns, forming alliance with Microsoft to stabilize financials.' },
    { year: '2007', title: 'iPhone Revolution Launch', description: 'Reinvented consumer electronics, establishing the premium ecosystem.' },
    { year: '2015', title: 'Wearables Extension', description: 'Released Apple Watch, establishing high-margin consumer accessories.' },
    { year: '2020', title: 'M-Series Apple Silicon transition', description: 'Migrated custom hardware designs, driving vertical operational control.' },
    { year: '2024', title: 'AI Acceleration & Spatial Tech', description: 'Launched Apple Vision Pro and announced Apple Intelligence ecosystem.' }
  ];

  if (ticker === 'TSLA') {
    timeline[0] = { year: '2003', title: 'Tesla Founded', description: 'Established by Martin Eberhard and Marc Tarpenning to prove electric cars.' };
    timeline[1] = { year: '2008', title: 'Elon Musk Named CEO', description: 'Led Model S development, navigating credit crunch challenges.' };
    timeline[2] = { year: '2012', title: 'Model S Released', description: 'Set standard for modern premium EVs with OTA updates.' };
    timeline[3] = { year: '2017', title: 'Model 3 Production Hell', description: 'Successfully automated mass-market production of EVs.' };
    timeline[4] = { year: '2023', title: 'Cybertruck & AI Era', description: 'Introduced Cybertruck and scaled Dojo AI / FSD networks.' };
  } else if (ticker === 'MSFT') {
    timeline[0] = { year: '1975', title: 'Company Founded', description: 'Bill Gates and Paul Allen launch Microsoft.' };
    timeline[1] = { year: '2001', title: 'Xbox & Enterprise push', description: 'Launched Xbox console and established SQL/Exchange enterprise servers.' };
    timeline[2] = { year: '2014', title: 'Satya Nadella named CEO', description: 'Shifted focus entirely to Cloud-First, Mobile-First architecture.' };
    timeline[3] = { year: '2016', title: 'LinkedIn Acquisition', description: 'Acquired LinkedIn for $26.2B to expand corporate network services.' };
    timeline[4] = { year: '2023', title: 'Generative AI Leadership', description: 'Partnered with OpenAI, integrating Copilots across Office and Azure.' };
  } else if (ticker === 'NVDA') {
    timeline[0] = { year: '1993', title: 'Company Founded', description: 'Jensen Huang, Chris Malachowsky, and Curtis Priem launch semiconductor firm.' };
    timeline[1] = { year: '1999', title: 'GPU Invention', description: 'Invented the GeForce 256 GPU, revolutionizing gaming graphics.' };
    timeline[2] = { year: '2006', title: 'CUDA Architecture launch', description: 'Opened GPU programming to compute, laying AI software foundation.' };
    timeline[3] = { year: '2020', title: 'Mellanox Acquisition', description: 'Acquired Mellanox for high-speed AI data networking interconnects.' };
    timeline[4] = { year: '2024', title: 'World\'s AI Powerhouse', description: 'Reached $2.9T valuation, launching Blackwell GPU architecture.' };
  }

  // Sources Citations
  const sources: SourceCitation[] = [
    { id: '1', source: 'Securities and Exchange Commission', publication: 'Form 10-K Annual Report', date: '2025-11-05', url: 'https://www.sec.gov', title: `${name} Annual SEC filing` },
    { id: '2', source: 'Bloomberg Finance', publication: 'Bloomberg Professional Service', date: '2026-06-15', url: 'https://www.bloomberg.com', title: `${ticker} Sector Peer Multiples Analysis` },
    { id: '3', source: 'Reuters Editorial', publication: 'Reuters Business', date: '2026-06-20', url: 'https://www.reuters.com', title: `${name} Supply Chain adjustments in Southeast Asia` }
  ];

  // SWOT
  const swot = {
    strengths: [`Unmatched brand loyalty & ecosystem lock-in for ${name}`, `Exceptional balance sheet with $${cash}B in cash`, 'Robust high-margin services division'],
    weaknesses: ['High dependency on hardware upgrade cycles', 'Regulatory scrutiny in EU and US over app store practices', 'Relatively late entry to standalone generative AI models'],
    opportunities: ['Integration of edge-AI inside user client devices', 'Expanding healthcare services and wearable integrations', 'Next-generation spatial headset platforms (Vision line)'],
    threats: ['Macroeconomic slowing reducing luxury consumer spending', 'Intensified domestic competition in China markets', 'Antitrust litigation breaking platform monopoly structures']
  };

  if (ticker === 'TSLA') {
    swot.strengths = ['Industry-leading production manufacturing margins', 'Proprietary charging network infrastructure', 'Brand synonymity with innovation and environmental shift'];
    swot.weaknesses = ['High CEO key-person operational risk', 'Production quality control inconsistencies', 'High volatile automotive sales dependency'];
    swot.opportunities = ['Full Self Driving (FSD) licensing to legacy OEMs', 'Optimus humanoid robotics and automated logistics', 'Megapack utility scale storage market expansion'];
    swot.threats = ['Aggressive price-war competition from BYD / Chinese OEMs', 'Regulatory delays in Robotaxi approvals', 'Lithium/nickel commodity supply constraints'];
  } else if (ticker === 'MSFT') {
    swot.strengths = ['B2B software monopoly (Office/Windows)', 'Azure scale computing infrastructure', 'First-mover generative AI ecosystem integration'];
    swot.weaknesses = ['Legacy system maintenance weight', 'Consumer product segments lagging hardware benchmarks', 'Heavy AI data center capital expenditures'];
    swot.opportunities = ['Copilot adoption across billions of enterprise seats', 'Cybersecurity enterprise software integration', 'AI-assisted developer platforms (GitHub integration)'];
    swot.threats = ['Antitrust investigations regarding Teams integrations', 'Intense cloud computing wars with Amazon AWS and Google Cloud', 'Rising data center energy costs and carbon restrictions'];
  } else if (ticker === 'NVDA') {
    swot.strengths = ['GPU compute absolute hardware performance lead', 'CUDA software ecosystem network effect', 'Superior operating margins exceeding 50%'];
    swot.weaknesses = ['Revenue highly concentrated in hyperscaler data centers', 'High supply chain reliance on single source (TSMC)', 'Massive inventory risk if AI capital spending cools'];
    swot.opportunities = ['Custom silicon chips and cloud data center networking', 'Automotive robotics and autonomous vehicle software', 'Sovereign nation AI infrastructures'];
    swot.threats = ['Custom AI ASICs developed by Google (TPU), Amazon, and Microsoft', 'Geopolitical export restrictions (US-China relations)', 'Technological breakthroughs in alternate computing materials'];
  }

  // Porter's 5 forces
  const porter = {
    newEntrants: { score: 85, text: 'Barrier to entry is extremely high due to scale, supply chain vertical integrations, and massive R&D capital barriers.' },
    buyers: { score: 40, text: 'Individual consumer bargaining is low, but institutional buyers can select competitive channels or delay cycles.' },
    suppliers: { score: 70, text: 'Suppliers are highly specialized (e.g. TSMC, ASML), causing medium-high dependency, offset by client buying scale.' },
    substitutes: { score: 25, text: 'Few direct substitutes exist that provide equivalent ecosystem integration and productivity suites.' },
    rivalry: { score: 65, text: 'Rivalry is intense among tech hyperscalers for market share, platform features, and talent acquisition.' }
  };

  if (ticker === 'TSLA') {
    porter.newEntrants = { score: 45, text: 'Legacy automakers are converting and startups can launch EV platforms, though manufacturing scale is tough to build.' };
    porter.buyers = { score: 80, text: 'Buyers have high choice with dozens of EV brands launching, forcing price cuts across portfolios.' };
    porter.suppliers = { score: 75, text: 'Critical minerals (lithium, cobalt) have high price fluctuations; battery cells are sourced from specialized partners.' };
    porter.substitutes = { score: 60, text: 'Hybrids, ICE vehicles, and public transport offer viable transportation alternatives.' };
    porter.rivalry = { score: 90, text: 'Aggressive pricing competition from BYD, Geely, and legacy auto makers in transition creates brutal margin pressures.' };
  } else if (ticker === 'NVDA') {
    porter.newEntrants = { score: 95, text: 'Extremely high barrier; recreating CUDA software and leading-edge GPU silicon takes decades and billions in CapEx.' };
    porter.buyers = { score: 55, text: 'Hyperscalers purchase massive quantities, giving some clout, but supply shortages give Nvidia absolute pricing power.' };
    porter.suppliers = { score: 90, text: 'Absolute dependency on TSMC for chip fabrication and packaging (CoWoS) creates a critical single-point bottleneck.' };
    porter.substitutes = { score: 35, text: 'ASICs, NPUs, and TPUs serve custom tasks, but none match the general AI computation versatility of Nvidia GPUs.' };
    porter.rivalry = { score: 50, text: 'Competition exists from AMD and Intel, but Nvidia owns 85%+ market share of enterprise AI acceleration.' };
  }

  // Business Model
  const businessModel = {
    valueProp: `Premium hardware ecosystem and integrated services providing seamless digital operations.`,
    customerSegments: 'Global consumers, premium tier developers, creative professionals, corporate enterprises.',
    channels: 'Direct online store, retail Apple Stores, major carriers, third-party electronic distributors.',
    revenueStreams: 'Hardware sales (iPhone, Mac, iPad, Wearables), Services (App Store commissions, iCloud, Apple Music, ApplePay).',
    keyPartners: 'Contract manufacturers (Foxconn), component suppliers, cellular carriers, media/app content creators.'
  };

  if (ticker === 'TSLA') {
    businessModel.valueProp = 'Premium long-range electric vehicles with advanced driver assistance, integrated solar, and utility battery arrays.';
    businessModel.customerSegments = 'Mass-market consumers, commercial cargo networks, electrical utilities, residential power markets.';
    businessModel.channels = 'Direct-to-consumer web platform, company-owned galleries, mobile service vehicles.';
    businessModel.revenueStreams = 'Automotive vehicle sales, regulatory carbon credits, supercharger network usage, FSD subscriptions, energy storage sales.';
    businessModel.keyPartners = 'Battery cell suppliers (Panasonic, CATL), steel/mineral resource miners, municipal zoning commissions.';
  } else if (ticker === 'MSFT') {
    businessModel.valueProp = 'Complete suite of cloud compute resources, business operating systems, office applications, and corporate security.';
    businessModel.customerSegments = 'Global IT managers, enterprise organizations, remote employees, gaming enthusiasts.';
    businessModel.channels = 'Enterprise direct sales force, software resellers, consumer electronic pre-installs, digital marketplaces.';
    businessModel.revenueStreams = 'SaaS subscriptions (Office 365, Dynamics), Consumption-based cloud computing (Azure), Xbox gaming consoles and game passes.';
    businessModel.keyPartners = 'PC OEMs (Dell, HP, Lenovo), systems integrators, OpenAI partnership, game studios, semiconductor manufacturers.';
  } else if (ticker === 'NVDA') {
    businessModel.valueProp = 'Accelerated computing hardware and CUDA software environment for AI development, high-performance computing, and graphics.';
    businessModel.customerSegments = 'AI research organizations, cloud service providers (AWS, Azure), game developers, scientific labs.';
    businessModel.channels = 'Hyperscaler cloud networks, hardware OEMs (Supermicro, Dell), AI system integrators, developer download networks.';
    businessModel.revenueStreams = 'Data center compute GPU platforms, AI Enterprise software licensing, consumer gaming GPUs, professional visualization graphics.';
    businessModel.keyPartners = 'Foundry partner (TSMC), HBM memory manufacturers (SK Hynix, Micron), optical interconnect suppliers, AI researchers.';
  }

  // Latency & Token Usage helpers
  const getLat = () => Math.round(300 + Math.random() * 400);
  const getTok = () => Math.round(1500 + Math.random() * 800);

  // Agent Node Setup
  const nodes: AgentNode[] = [
    { id: 'planner', name: 'Research Planner', role: 'Coordinates research outline and priorities', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'financial', name: 'Financial Analyst', role: 'Evaluates balance sheet, margins, growth, and cash flow stability', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'news', name: 'News Analyst', role: 'Parses CEO communications, news logs, and sentiment indices', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'market', name: 'Market Analyst', role: 'Reviews sector dynamics, interest rates, and macro headwinds', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'risk', name: 'Risk Officer', role: 'Performs corporate accounting, cybersecurity, and operational audit', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'competition', name: 'Competition Analyst', role: 'Benchmarks peer multiples, market share, and moats', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'esg', name: 'ESG Analyst', role: 'Tracks governance ethics, regulatory audits, and sustainability', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'valuation', name: 'Valuation Expert', role: 'Calculates multiples and runs discounted cash flow models', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'bull', name: 'Bull Analyst', role: 'Drafts upside expansion catalyst memos', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'bear', name: 'Bear Analyst', role: 'Identifies downside structural failure factors', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'advocate', name: 'Devil\'s Advocate', role: 'Challenges investment thesis alignment and voting consensus', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'factcheck', name: 'Fact Checker', role: 'Audit log verification, source matching, and number check', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' },
    { id: 'chairman', name: 'Chairman AI', role: 'Coordinates executive summary, calculates scores, and counts votes', latency: getLat(), tokensUsed: getTok(), prompt: '', response: '', status: 'pending' }
  ];

  // Fill in Prompts and Responses
  nodes.forEach(n => {
    n.prompt = `SYSTEM: You are the ${n.name} inside the AlphaBoard investment committee. Analyze ${name} (${ticker}).\nINPUT STATE: Company metadata, financial tables, news logs, and peer benchmarks.\nTASK: Provide a specialized report evaluating ${ticker}'s ${n.role.toLowerCase()}.`;
  });

  nodes[0].response = `RE-PLANNING OUTLINE FOR ${ticker}:\n1. Financials: Assess historical CAGR and current cash conversion.\n2. Valuation: Run multi-stage DCF modeling under high interest rate stress.\n3. Competitors: Map market share shifts against peers.\n4. Risk & ESG: Map antitrust lawsuits and regulatory sanctions.\nProceeding to launch research nodes in parallel.`;
  
  nodes[1].response = `FINANCIAL HEALTH AUDIT FOR ${ticker}:\n- Revenue: 5-year trend shows solid growth. Gross margin sits at a strong level.\n- Balance Sheet: Net cash positive. Cash reserves are extremely robust at $${cash}B.\n- Leverage: Total debt of $${debt}B is comfortably covered by operating income (Interest coverage ratio > 15x).\n- Ratios: ROE of ${roe}% and ROIC of ${roic}% indicate exceptional capital efficiency. Quick Ratio is ${quickRatio}, signaling zero liquidity threats.`;
  
  nodes[2].response = `NEWS SENTIMENT PIPELINE FOR ${ticker}:\n- CEO Communications: Earnings call highlights solid demand. Emphasis on AI product integrations.\n- Press Releases: Strategic partnerships announced for cloud deployments. Positive reaction in markets.\n- Layoffs: ${redFlags.layoffs}.\n- General Sentiment: Index reads positive. Strong consumer sentiment, despite antitrust headlines.`;
  
  nodes[3].response = `MACRO ENVIRONMENT MATRIX:\n- Sector Dynamics: Technology sector remains a primary allocator of corporate CapEx.\n- Interest Rates: Yield curves indicate persistent higher rates, which favors cash-rich balance sheets like ${ticker}.\n- Inflation: Cost of goods sold is rising moderately, but ${ticker} exhibits pricing power to pass expenses to customers.`;
  
  nodes[4].response = `COMPREHENSIVE RISK LOG:\n- Regulatory Risk: Active Department of Justice (DOJ) and EU antitrust audits represent a persistent headache, though financial impact remains manageable.\n- Operational Risk: Key-person risk: ${redFlags.ceoResignationRisk === 'High' ? 'CRITICAL' : 'Low'}.\n- Supply Chain Risk: Geopolitical exposure in production clusters remains a vulnerability. Mitigated by diversified warehousing.`;
  
  nodes[5].response = `COMPETITOR BENCHMARKING:\n- Revenue Share: ${ticker} holds dominant positioning in its core segments.\n- Margin Comparison: Profit margin of ${netMargin}% exceeds sector median by over 800 basis points.\n- Moat: Premium brand equity and software ecosystem create high switching costs.`;
  
  nodes[6].response = `ESG AUDIT AND COMPLIANCE:\n- Environmental: Carbon neutrality pledges on track. Supply chain audits are tightening standards.\n- Social: Labor conditions in outsourced assembly plants remain a point of discussion. Diversity metrics are high.\n- Governance: Board independence is rated highly. CEO compensation is aligned with shareholder return targets.`;
  
  nodes[7].response = `VALUATION DISCLOSURE:\n- DCF Model: WACC of ${wacc * 100}%, growth projection of ${growth * 100}%. Intrinsic value calculated at $${intrinsicValue}.\n- Current Price: Market price sits around $${currentPrice}. Price/Earnings ratio is ${pe}x.\n- Verdict: Stock is currently evaluated as ${valuationStatus}. PEG ratio of ${peg} is ${peg < 1.5 ? 'attractive' : 'extended'}.`;
  
  nodes[8].response = `BULL CASE ADVOCACY:\n- Generative AI Integration: Edge-computing AI rollout in consumer devices will trigger a massive multi-year hardware replacement cycle.\n- Services Acceleration: High-margin recurring subscription segments are compounding at 12%+ YoY.\n- Capital Return: Continuous share buyback programs will artificially support EPS compounding.`;
  
  nodes[9].response = `BEAR CASE DETECTOR:\n- Upgrade Saturation: Smartphone and core hardware replacement cycles are lengthening beyond 36 months.\n- Cloud Margin Pressure: Hyperscale CapEx is ballooning, creating return-on-investment risks if cloud sales growth deceleration occurs.\n- Legal Liabilities: Regulatory breakup of app marketplaces would shave high-margin fees.`;
  
  nodes[10].response = `DEVIL'S ADVOCATE CRITIQUE:\n- If generative AI integrations fail to provide significant consumer utility, the premium pricing power of the upcoming product generation is compromised.\n- We are ignoring supply-chain single-points-of-failure (e.g. Taiwan chip fabrication dependency). A localized dispute would halt shipments immediately.`;
  
  nodes[11].response = `VERIFICATION AUDIT:\n- Cross-referenced cash reserves from 10-K filing page 62 ($${cash}B matches exactly).\n- Verified share count and EPS calculations: Math check shows correct division: Profit/Shares = $${eps}.\n- Checked for hallucinated sources: All cited reports verified.`;
  
  nodes[12].response = `CHAIRMAN AUDIT CONSOLIDATION:\n- Financial Health: Outstanding score.\n- Valuation: DCF verifies margin of safety.\n- Committee Consensus: Bull thesis outweighs bear arguments on AI catalysts and balance sheet strength.\nGenerating final recommendation.`;

  // Debate Room Conversation (Slack Style)
  const debate: AgentMessage[] = [
    { agentId: 'planner', agentName: 'Planner', avatarColor: '#6366f1', message: `Welcome everyone. Let's begin the debate on ${name} (${ticker}). Financial Analyst, start us off.`, timestamp: '10:00:15' },
    { agentId: 'financial', agentName: 'Financial Analyst', avatarColor: '#10b981', message: `I've reviewed the numbers. ${ticker}'s ROE is an impressive ${roe}%, and they have $${cash}B in cash. The balance sheet is practically bulletproof.`, timestamp: '10:01:05' },
    { agentId: 'bear', agentName: 'Bear Analyst', avatarColor: '#ef4444', message: `Wait, look at the growth numbers. Revenue growth has slowed to ${growth * 100}%. We can't value them like a high-growth startup anymore.`, timestamp: '10:01:45' },
    { agentId: 'bull', agentName: 'Bull Analyst', avatarColor: '#3b82f6', message: `Yes we can, if they successfully pull off the next-generation AI integrations. Edge-AI will spark a massive consumer hardware refresh cycle!`, timestamp: '10:02:30' },
    { agentId: 'valuation', agentName: 'Valuation Expert', avatarColor: '#f59e0b', message: `My multi-stage DCF model puts the intrinsic value at $${intrinsicValue}. With the market price at $${currentPrice}, the stock is currently ${valuationStatus.toLowerCase()}.`, timestamp: '10:03:10' },
    { agentId: 'risk', agentName: 'Risk Officer', avatarColor: '#ec4899', message: `Don't ignore the regulatory threats. The Department of Justice antitrust lawsuit is a major wildcard. A forced app-store breakup would hit high-margin service revenue.`, timestamp: '10:04:00' },
    { agentId: 'advocate', agentName: 'Devil\'s Advocate', avatarColor: '#8b5cf6', message: `Even if the DOJ doesn't split them, what if competitor hardware improves? Chinese automakers and phone manufacturers are moving rapidly. The moat is shrinking.`, timestamp: '10:04:55' },
    { agentId: 'esg', agentName: 'ESG Analyst', avatarColor: '#14b8a6', message: `On the positive side, their governance is strong and they are on track for net-zero emissions. Environmental rating is highly favorable.`, timestamp: '10:05:40' },
    { agentId: 'chairman', agentName: 'Chairman AI', avatarColor: '#6b7280', message: `Great points, team. It appears the core debate is between AI execution upside versus antitrust regulatory risks. Let's move to a vote.`, timestamp: '10:06:20' }
  ];

  // Committee Voting
  const votes: AgentVote[] = [
    { agentId: 'financial', agentName: 'Financial Analyst', vote: 'BUY', reasoning: 'Superior cash flow generation and elite ROE make it a low-risk compounder.', confidence: 95 },
    { agentId: 'news', agentName: 'News Analyst', vote: 'BUY', reasoning: 'Social sentiments are bullish and CEO interviews demonstrate clear roadmap focus.', confidence: 85 },
    { agentId: 'market', agentName: 'Market Analyst', vote: 'BUY', reasoning: 'High interest rate environments favor cash-generating sector leaders.', confidence: 80 },
    { agentId: 'risk', agentName: 'Risk Officer', vote: 'HOLD', reasoning: 'Antitrust lawsuits represent a major pending regulatory overhang.', confidence: 70 },
    { agentId: 'competition', agentName: 'Competition Analyst', vote: 'BUY', reasoning: 'Ecosystem switching costs are extremely high; peers struggle to compete.', confidence: 90 },
    { agentId: 'esg', agentName: 'ESG Analyst', vote: 'BUY', reasoning: 'Excellent governance marks and green energy commitments.', confidence: 85 },
    { agentId: 'valuation', agentName: 'Valuation Expert', vote: ratio < 0.95 ? 'BUY' : ratio > 1.15 ? 'SELL' : 'HOLD', reasoning: `Calculated DCF intrinsic value of $${intrinsicValue} supports the target valuation.`, confidence: 88 },
    { agentId: 'bull', agentName: 'Bull Analyst', vote: 'BUY', reasoning: 'Upcoming device-level generative AI features will trigger massive replacement cycle.', confidence: 95 },
    { agentId: 'bear', agentName: 'Bear Analyst', vote: 'HOLD', reasoning: 'Consumer hardware replacement timelines are lengthening.', confidence: 75 },
    { agentId: 'advocate', agentName: 'Devil\'s Advocate', vote: 'HOLD', reasoning: 'High geopolitical risks and supply chain concentrations are unaccounted for.', confidence: 80 }
  ];

  // Calculate Scores
  const investmentScore = ticker === 'AAPL' ? 84 : ticker === 'TSLA' ? 62 : ticker === 'MSFT' ? 88 : 91;
  const riskMeter = ticker === 'TSLA' ? 78 : ticker === 'AAPL' ? 32 : ticker === 'MSFT' ? 24 : 45;
  const moatScore = ticker === 'AAPL' ? 95 : ticker === 'TSLA' ? 70 : ticker === 'MSFT' ? 92 : 88;
  const innovationScore = ticker === 'NVDA' ? 98 : ticker === 'TSLA' ? 90 : ticker === 'AAPL' ? 85 : 88;
  const financialHealthScore = ticker === 'AAPL' ? 96 : ticker === 'TSLA' ? 72 : ticker === 'MSFT' ? 94 : 90;
  const newsSentiment = ticker === 'TSLA' ? 42 : ticker === 'AAPL' ? 78 : ticker === 'MSFT' ? 82 : 88;
  const sectorRanking = ticker === 'MSFT' ? '#1 in Tech Software' : ticker === 'AAPL' ? '#2 in Tech Hardware' : ticker === 'NVDA' ? '#1 in Semiconductors' : '#3 in Automotive';

  // Final Consensus
  const buyVotes = votes.filter(v => v.vote === 'BUY').length;
  const sellVotes = votes.filter(v => v.vote === 'SELL').length;
  const finalRecommendation = buyVotes >= 7 ? 'STRONG BUY' : buyVotes >= 5 ? 'BUY' : sellVotes >= 4 ? 'SELL' : 'HOLD';
  const finalConfidence = Math.round(
    (buyVotes * 10 - sellVotes * 10 + financialHealthScore + newsSentiment + moatScore) / 4
  );

  const memo = `### EXECUTIVE INVESTMENT MEMORANDUM: ${name} (${ticker})
  
**Final Recommendation: ${finalRecommendation}**  
**Committee Confidence Index: ${finalConfidence}/100**

---

#### 1. Investment Thesis Summary
${name} continues to exhibit high capital efficiency, characterized by an ROE of **${roe}%** and a massive net cash position of **$${cash - debt}B**. The committee is generally aligned that ${ticker} possesses a wide economic moat, driven primarily by high platform switching costs and a globally recognized premium brand. The key growth catalyst remains the integration of AI models at the client edge, which should accelerate upgrade cycles.

#### 2. Key Valuation Findings
Our quantitative valuation model places the intrinsic fair value of ${ticker} at **$${intrinsicValue} per share** (WACC of **8.5%**, Terminal Growth of **2.5%**). Relative to current market pricing, the asset represents a **${valuationStatus.toLowerCase()}** entry point. 

#### 3. Core Structural Risks
1. **Regulatory Pressure**: Antitrust litigation represents a continuous operational headwind that could cap platform pricing power.
2. **Geopolitical Concentration**: Hardware supply pipelines have significant reliance on East Asian manufacturing nodes. A localized disruption would immediately impact gross margin targets.
3. **Consumer Saturation**: Core upgrade intervals have expanded, forcing high dependency on digital subscription growth.`;

  const executiveSummary = `AlphaBoard\'s Investment Committee has analyzed ${name} (${ticker}) across 13 unique agent models. The resulting consensus recommends a **${finalRecommendation}** with a confidence score of **${finalConfidence}/100**. While the company exhibits premier financial health ($${cash}B cash, ROE of ${roe}%), regulatory headwinds and supply-chain dependencies constitute the primary risk factors.`;

  return {
    ticker,
    name,
    logo,
    description: meta.desc,
    sector: meta.sector,
    industry: meta.industry,
    ceo: meta.ceo,
    headquarters: meta.hq,
    employees: meta.emp,
    marketCap: meta.mcap,
    website: meta.web,
    
    metrics,
    valuation,
    redFlags,
    timeline,
    sources,
    
    nodes,
    debate,
    votes,
    
    investmentScore,
    riskMeter,
    moatScore,
    innovationScore,
    financialHealthScore,
    newsSentiment,
    sectorRanking,
    swot,
    porter,
    businessModel,
    
    memo,
    executiveSummary,
    finalRecommendation,
    finalConfidence
  };
}

// Recalculates metrics based on user sliders in the simulator
export function recalculateUnderWhatIf(
  base: CompanyAnalysis,
  whatIf: WhatIfState
): CompanyAnalysis {
  // Deep clone metrics and valuation to prevent mutability problems
  const metrics = JSON.parse(JSON.stringify(base.metrics)) as FinancialMetrics;
  const valuation = JSON.parse(JSON.stringify(base.valuation)) as ValuationData;
  const redFlags = JSON.parse(JSON.stringify(base.redFlags)) as RedFlags;
  
  // 1. Calculate how revenue growth changes
  // Slider ranges: base.revenueGrowth + whatIf.revenueGrowth
  const adjustedGrowth = (base.metrics.revenueGrowth / 100) + (whatIf.revenueGrowth / 100);
  metrics.revenueGrowth = parseFloat((adjustedGrowth * 100).toFixed(1));
  
  // Project revenue 5th year under new growth
  const base4thYearRev = metrics.revenue[3];
  metrics.revenue[4] = Math.round(base4thYearRev * (1 + adjustedGrowth));
  
  // 2. Adjust margins
  // Net margin changes based on margins slider and oil price drag
  const adjustedMargin = base.metrics.netMargin + whatIf.margins - (whatIf.oilPrices * 0.1);
  metrics.netMargin = parseFloat(adjustedMargin.toFixed(1));
  metrics.operatingMargin = parseFloat((adjustedMargin * 1.35).toFixed(1));
  
  // Adjust 5th year profit based on new revenue and margin
  metrics.profit[4] = Math.round((metrics.revenue[4] * adjustedMargin) / 100);
  metrics.eps = parseFloat((metrics.profit[4] / metrics.sharesOutstanding).toFixed(2));
  
  // 3. WACC increases with interest rates and inflation
  // Base WACC is 8.5%. It increases by interestRate delta and 0.5 * inflation delta
  const adjustedWacc = 0.085 + (whatIf.interestRate - 5.0) / 100 + (whatIf.inflation - 2.5) * 0.005;
  
  // Recalculate Cash Flow and DCF
  // Cash flow is adjusted proportionally to profit
  const profitRatio = metrics.profit[4] / base.metrics.profit[4];
  metrics.cashFlow[4] = Math.round(base.metrics.cashFlow[4] * profitRatio);
  
  let dcfVal = 0;
  let projectionGrowth = adjustedGrowth;
  let tempCF = metrics.cashFlow[4];
  const terminalGrowth = 0.025;
  
  for (let t = 1; t <= 10; t++) {
    if (t > 5) projectionGrowth = Math.max(terminalGrowth, projectionGrowth * 0.8);
    tempCF = tempCF * (1 + projectionGrowth);
    dcfVal += tempCF / Math.pow(1 + adjustedWacc, t);
  }
  const terminalValue = (tempCF * (1 + terminalGrowth)) / (adjustedWacc - terminalGrowth);
  dcfVal += terminalValue / Math.pow(1 + adjustedWacc, 10);
  
  // Intrinsic Value per share
  const intrinsicValue = parseFloat(((dcfVal + base.metrics.cash - base.metrics.debt) / base.metrics.sharesOutstanding).toFixed(2));
  valuation.intrinsicValue = intrinsicValue;
  valuation.fairValue = parseFloat((intrinsicValue * 0.95).toFixed(2));
  
  // Valuation multiplier ratios
  const currentPrice = base.ticker === 'AAPL' ? 180 : base.ticker === 'TSLA' ? 175 : base.ticker === 'MSFT' ? 420 : 125;
  valuation.pe = parseFloat((currentPrice / metrics.eps).toFixed(1));
  valuation.peg = parseFloat((valuation.pe / (adjustedGrowth * 100)).toFixed(2));
  
  const ratio = currentPrice / intrinsicValue;
  valuation.valuationStatus = ratio < 0.9 ? 'Undervalued' : ratio > 1.15 ? 'Overvalued' : 'Fair Value';
  
  // 4. Adjust Red Flags based on parameters
  if (whatIf.interestRate > 7.5) {
    redFlags.debtIncrease = true;
  }
  if (adjustedGrowth < 0.02) {
    redFlags.weakCashFlow = true;
  }
  
  // Recalculate scores
  const finHealth = Math.round(
    Math.min(100, Math.max(10, base.financialHealthScore + (whatIf.margins * 3) - (whatIf.interestRate - 5) * 4))
  );
  
  // Re-vote simulation
  const updatedVotes = base.votes.map(v => {
    let vote = v.vote;
    let reasoning = v.reasoning;
    
    if (v.agentId === 'financial') {
      if (finHealth < 60) {
        vote = 'HOLD';
        reasoning = `Financial health score has degraded to ${finHealth} under macro stress constraints.`;
      } else {
        vote = 'BUY';
      }
    } else if (v.agentId === 'valuation') {
      if (valuation.valuationStatus === 'Overvalued') {
        vote = 'SELL';
        reasoning = `Asset is highly overvalued relative to DCF valuation ($${intrinsicValue}).`;
      } else if (valuation.valuationStatus === 'Undervalued') {
        vote = 'BUY';
        reasoning = `DCF indicates a significant margin of safety at $${intrinsicValue}.`;
      } else {
        vote = 'HOLD';
        reasoning = `Asset is valued fairly at $${intrinsicValue} per share.`;
      }
    } else if (v.agentId === 'market') {
      if (whatIf.interestRate > 7.0 || whatIf.inflation > 5.0) {
        vote = 'SELL';
        reasoning = `High interest rates (${whatIf.interestRate}%) and severe inflation pressures create industry-wide headwind.`;
      } else {
        vote = 'BUY';
      }
    }
    
    return { ...v, vote, reasoning };
  });
  
  const buyVotes = updatedVotes.filter(v => v.vote === 'BUY').length;
  const sellVotes = updatedVotes.filter(v => v.vote === 'SELL').length;
  
  const finalRec = buyVotes >= 7 ? 'STRONG BUY' : buyVotes >= 5 ? 'BUY' : sellVotes >= 4 ? 'SELL' : 'HOLD';
  const finalConf = Math.round(
    (buyVotes * 10 - sellVotes * 10 + finHealth + base.newsSentiment + base.moatScore) / 4
  );

  const updatedSwot = { ...base.swot };
  if (whatIf.interestRate > 7.0) {
    updatedSwot.threats = [...updatedSwot.threats, 'Elevated cost of capital limiting strategic debt financing'];
  }
  
  return {
    ...base,
    metrics,
    valuation,
    redFlags,
    votes: updatedVotes,
    financialHealthScore: finHealth,
    finalRecommendation: finalRec,
    finalConfidence: finalConf,
    swot: updatedSwot
  };
}

// History & Watchlist Helper Managers
export function getSavedWatchlist(): WatchlistItem[] {
  const data = localStorage.getItem('alphaboard_watchlist');
  if (data) return JSON.parse(data);
  
  // Default values
  const defaults: WatchlistItem[] = [
    { ticker: 'AAPL', name: 'Apple Inc.', price: 180, change: 1.25, recommendation: 'STRONG BUY' },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: 175, change: -2.4, recommendation: 'HOLD' },
    { ticker: 'MSFT', name: 'Microsoft Corp.', price: 420, change: 0.85, recommendation: 'STRONG BUY' }
  ];
  localStorage.setItem('alphaboard_watchlist', JSON.stringify(defaults));
  return defaults;
}

export function toggleWatchlist(ticker: string, name: string, price: number, rec: string): WatchlistItem[] {
  const current = getSavedWatchlist();
  const exists = current.find(c => c.ticker === ticker);
  let updated: WatchlistItem[];
  
  if (exists) {
    updated = current.filter(c => c.ticker !== ticker);
  } else {
    updated = [...current, { ticker, name, price, change: parseFloat((Math.random() * 4 - 2).toFixed(2)), recommendation: rec }];
  }
  localStorage.setItem('alphaboard_watchlist', JSON.stringify(updated));
  return updated;
}

export function getPortfolioAllocations(amount: number, riskTolerance: 'Low' | 'Medium' | 'High'): PortfolioAsset[] {
  if (amount <= 0) return [];
  
  if (riskTolerance === 'Low') {
    return [
      { ticker: 'MSFT', name: 'Microsoft Corporation', allocationPercent: 40, amount: amount * 0.4, expectedReturn: 12, risk: 'Low' },
      { ticker: 'AAPL', name: 'Apple Inc.', allocationPercent: 35, amount: amount * 0.35, expectedReturn: 10, risk: 'Low' },
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', allocationPercent: 25, amount: amount * 0.25, expectedReturn: 8, risk: 'Low' }
    ];
  } else if (riskTolerance === 'Medium') {
    return [
      { ticker: 'NVDA', name: 'Nvidia Corporation', allocationPercent: 35, amount: amount * 0.35, expectedReturn: 28, risk: 'High' },
      { ticker: 'MSFT', name: 'Microsoft Corporation', allocationPercent: 30, amount: amount * 0.3, expectedReturn: 15, risk: 'Low' },
      { ticker: 'AAPL', name: 'Apple Inc.', allocationPercent: 20, amount: amount * 0.2, expectedReturn: 12, risk: 'Low' },
      { ticker: 'TSLA', name: 'Tesla Inc.', allocationPercent: 15, amount: amount * 0.15, expectedReturn: 18, risk: 'Medium' }
    ];
  } else {
    return [
      { ticker: 'NVDA', name: 'Nvidia Corporation', allocationPercent: 50, amount: amount * 0.5, expectedReturn: 35, risk: 'High' },
      { ticker: 'TSLA', name: 'Tesla Inc.', allocationPercent: 30, amount: amount * 0.3, expectedReturn: 25, risk: 'Medium' },
      { ticker: 'META', name: 'Meta Platforms Inc.', allocationPercent: 20, amount: amount * 0.2, expectedReturn: 20, risk: 'High' }
    ];
  }
}
