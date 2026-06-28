# AlphaBoard AI — Technical Report

**"Don't Ask One AI. Ask an Entire Investment Committee."**

**Version:** 1.0  
**Author:** Khush  
**Framework:** React 19 + TypeScript + Vite  
**AI Backend:** Google Gemini 1.5 Flash  
**Date:** June 2026

---

## Table of Contents

1. [Architecture](#1-architecture)
2. [AI Workflow](#2-ai-workflow)
3. [Developer Notes](#3-developer-notes)
4. [Design Decisions](#4-design-decisions)
5. [Challenges](#5-challenges)
6. [Testing](#6-testing)
7. [Future Work](#7-future-work)

---

## 1. Architecture

### System Overview

AlphaBoard AI is a production-grade investment research terminal that coordinates multiple AI agents to produce institutional-quality consensus reports. The system replaces the traditional single-prompt chatbot model with a structured, multi-agent committee workflow.

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Vanilla CSS with CSS Custom Properties |
| AI Engine | Google Gemini 1.5 Flash API |
| Charts | Native SVG (no external library) |
| State | React useState + localStorage |
| Build | Vite 8.1, TypeScript compiler |
| Icons | Lucide React |

### Component Architecture

```
App.tsx (Root Shell & Router)
├── Navbar.tsx (Navigation, Search, API Key, Voice, Auth)
├── LandingPage.tsx (Hero, Search Bar, Voice Input, Trending)
├── AuthPage.tsx (Login, Register, Guest Bypass)
├── ResearchPipeline.tsx (Live Progress Tracker)
├── CompanyDashboard.tsx (Consensus Terminal + Explainability)
│   ├── InteractiveCharts.tsx (SVG Revenue/Comparison Charts)
│   ├── CommitteeVoting.tsx (Agent Vote Matrix)
│   ├── AgentDebateRoom.tsx (Bull vs Bear Debate)
│   └── WhatIfSimulator.tsx (Macro Parameter Sliders)
├── CompareMode.tsx (Side-by-Side Company Analysis)
├── PortfolioMode.tsx (Asset Allocation Engine)
├── RecruiterMode.tsx (LangGraph Visual Flowchart)
├── DeveloperMode.tsx (JSON Viewer, Prompt Inspector)
├── PromptLibrary.tsx (Agent Prompt Blueprints)
└── BuildJourney.tsx (Development Timeline)
```

### Data Flow

```
User Input → Navbar/LandingPage
    ↓
ResearchPipeline (progress UI)
    ↓
agentEngine.ts → generateGeminiAnalysis()
    ↓
Gemini API Call 1: Planner (company metadata + financials)
    ↓
Gemini API Call 2+3: Valuation + Risk (parallel via Promise.all)
    ↓
Gemini API Call 4: Advocates Panel (Bull/Bear/Devil's Advocate)
    ↓
Gemini API Call 5: Chairman AI (votes, SWOT, confidence, memo)
    ↓
CompanyAnalysis object → CompanyDashboard renders full terminal
```

---

## 2. AI Workflow

### Multi-Agent Pipeline

The system makes 5 sequential Gemini API calls, each with a specialized system prompt:

| Step | Agent | Purpose | Execution |
|------|-------|---------|-----------|
| 1 | Planner | Company metadata, financials, news | Sequential |
| 2 | Valuation Expert | PE, PEG, DCF, intrinsic value | Parallel |
| 3 | Risk Officer | Red flags, ESG, insider activity | Parallel |
| 4 | Advocates Panel | Bull case, Bear case, Devil's Advocate | Sequential |
| 5 | Chairman AI | Final vote, SWOT, confidence, memo | Sequential |

### Prompt Engineering Strategy

Each agent receives a **structured JSON schema** in its prompt, forcing Gemini to return machine-parseable responses. Example:

```
You are the Valuation Expert & Financial Analyst.
Analyze these financials for NVDA: {...}.
Return strictly a JSON object:
{ "pe": 28.5, "intrinsicValue": 145.2, "vote": "BUY", ... }
```

Key techniques used:
- **Role assignment**: "You are the Risk Officer & ESG Specialist"
- **Structured output**: `responseMimeType: 'application/json'`
- **Chain-of-thought**: Each agent builds on prior agents' outputs
- **Parallel execution**: Independent agents run via `Promise.all`

### Graceful Fallback

If the Gemini API fails (missing key, rate limit, network error), the pipeline logs the error in the console and falls back to the high-fidelity simulated engine with realistic financial calculations (WACC, DCF, Porter's Five Forces).

---

## 3. Developer Notes

### Project Structure

```
├── src/
│   ├── App.tsx              — Root shell, routing, state management
│   ├── components/          — 15 React components
│   ├── services/
│   │   └── agentEngine.ts   — All business logic, types, Gemini API
│   └── index.css            — Complete design system (CSS variables)
├── docs/
│   ├── architecture/        — 4 system design documents
│   ├── ai-prompt-specifications/  — 6 agent prompt blueprints
│   ├── ai-engineering-logs/       — 7 LLM transcript logs
│   ├── ai-build-journey/          — 7-day development diary
│   ├── engineering-decisions/     — 3 Architecture Decision Records
│   └── screenshots/               — UI captures
├── README.md
├── REPORT.md                — This document
└── docs/LLM_Development_Log.md  — AI chat session transcripts
```

### Key Implementation Details

1. **Type Safety**: All data structures are typed via TypeScript interfaces (`CompanyAnalysis`, `AgentNode`, `FinancialMetrics`, etc.)
2. **Zero External Chart Libraries**: All charts are rendered using native SVG with computed coordinate paths
3. **CSS Variable System**: 30+ design tokens enable instant theme switching (dark/light)
4. **Voice Search**: Uses browser-native `SpeechRecognition` API — zero dependencies
5. **Print Stylesheet**: `@media print` rules format the terminal into a clean PDF

---

## 4. Design Decisions

### ADR-001: Client-Side Multi-Agent Simulation

**Context**: Running real LangGraph requires a Node.js backend with persistent state.

**Decision**: Built a TypeScript-based client-side orchestrator that mirrors the exact LangGraph data contract (shared state schema, node types, edge routing).

**Consequence**: Zero deployment cost, instant startup, but requires Gemini API key for real AI analysis.

### ADR-002: Native SVG Charts Over Chart.js/Recharts

**Context**: External charting libraries add 80-150KB to bundle size and conflict with glassmorphic styling.

**Decision**: Computed SVG coordinate paths manually using React hooks.

**Consequence**: Final JS bundle is 421KB (gzipped: 116KB) — significantly lighter than alternatives.

### ADR-003: Vanilla CSS Over Tailwind

**Context**: High-density Bloomberg-style terminal layouts require precise control over backdrop-filter, box-shadow, and CSS Grid that Tailwind utility chains make verbose.

**Decision**: Single `index.css` file with CSS Custom Properties and utility classes.

**Consequence**: Clean JSX markup, centralized theme tokens, robust print media rules.

### ADR-004: Gemini 1.5 Flash Over GPT-4

**Decision**: Selected for generous free tier, JSON response mode support, and fast latency.

---

## 5. Challenges

### Challenge 1: TypeScript Strict Mode Compilation

**Problem**: `verbatimModuleSyntax` required separate `import type` declarations.

**Solution**: Split all type imports using `import type { X }` syntax. Resolved 12+ TS1484 errors.

### Challenge 2: Gemini JSON Response Parsing

**Problem**: Gemini occasionally returns malformed JSON with trailing commas or markdown wrappers.

**Solution**: Added `.trim()` preprocessing and wrapped `JSON.parse` in try-catch with graceful fallback.

### Challenge 3: Parallel Agent State Coordination

**Problem**: Two parallel agents (Valuation + Risk) needed to complete before the Debate agent could run.

**Solution**: Used `Promise.all()` for parallel execution with sequential chaining for dependent steps.

### Challenge 4: Voice Search Cross-Browser Compatibility

**Problem**: `SpeechRecognition` is only available as `webkitSpeechRecognition` in Chrome.

**Solution**: Feature detection with fallback: `window.SpeechRecognition || window.webkitSpeechRecognition`.

### Challenge 5: Print Layout for PDF Export

**Problem**: Glassmorphic backgrounds with `backdrop-filter` don't render in print.

**Solution**: `@media print` rules override backgrounds to solid white and hide non-essential UI elements.

---

## 6. Testing

### Build Verification

```
> tsc -b && vite build

✓ 99 modules transformed.
dist/index.html                   1.40 kB │ gzip:   0.77 kB
dist/assets/index-B-HGjzYJ.css   12.57 kB │ gzip:   3.39 kB
dist/assets/index-DGxB9Vk2.js   421.53 kB │ gzip: 116.29 kB

✓ built in 1.02s
```

### Manual Testing Checklist

| Test Case | Result |
|-----------|--------|
| Landing page loads with animated hero | ✅ Pass |
| Company search autocomplete works | ✅ Pass |
| Voice search activates microphone | ✅ Pass |
| Research pipeline shows 11-step progress | ✅ Pass |
| Gemini API mode produces real analysis | ✅ Pass |
| Mock mode fallback works without API key | ✅ Pass |
| Committee voting displays agent votes | ✅ Pass |
| Bull vs Bear debate renders correctly | ✅ Pass |
| What-If simulator updates recommendations | ✅ Pass |
| Explainability panel expands/collapses | ✅ Pass |
| Compare mode shows side-by-side analysis | ✅ Pass |
| Portfolio allocation calculates correctly | ✅ Pass |
| PDF export formats cleanly | ✅ Pass |
| Dark/Light theme toggle works | ✅ Pass |
| Login/Register with validation works | ✅ Pass |
| Guest bypass skips auth | ✅ Pass |
| Developer Mode shows JSON + prompts | ✅ Pass |
| LangGraph node visualizer renders | ✅ Pass |
| Search history persists via localStorage | ✅ Pass |
| API key modal saves/clears correctly | ✅ Pass |

---

## 7. Future Work

### Short-Term Enhancements

- **Real-Time Data APIs**: Integrate Yahoo Finance and Alpha Vantage for live stock prices
- **Supabase Backend**: Persist analyses, user profiles, and search history server-side
- **RAG Pipeline**: Use vector embeddings to ground agent responses in real SEC filings
- **Streaming Responses**: Display Gemini output token-by-token as it generates

### Long-Term Vision

- **Full LangGraph.js Migration**: Replace client-side simulation with actual `@langchain/langgraph` orchestration
- **Portfolio Tracker**: Real-time portfolio monitoring with alert notifications
- **Mobile Application**: React Native companion app
- **Collaborative Research**: Multi-user research sessions with shared annotations
- **Knowledge Graph**: Build a company relationship graph for supply chain analysis
- **Earnings Calendar**: Automated pre-earnings research reports

---

## Summary

AlphaBoard AI demonstrates a production-grade approach to AI-assisted investment research. By decomposing the research process into specialized agents with distinct roles, the platform delivers transparent, explainable, and evidence-backed recommendations — moving beyond the limitations of single-prompt chatbot interfaces.

The project showcases expertise in:
- **Multi-agent AI system design**
- **Real-time API integration** (Gemini)
- **Modern React architecture** (TypeScript, component composition)
- **Professional UI/UX** (glassmorphism, animations, responsive design)
- **Software engineering practices** (ADRs, documentation, type safety)
