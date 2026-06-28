# LLM Development Log — AlphaBoard AI

**Purpose:** This document records the actual AI-assisted development sessions used to build AlphaBoard AI. Each entry includes the prompt given to the AI, a summary of the response, the decision made, and the resulting feature or code change.

**AI Tool Used:** Google Gemini (via Antigravity IDE)  
**Date Range:** June 28–29, 2026

---

## 1. Project Planning

**Prompt to AI:**
> "You are a Principal AI Engineer, Product Designer, Senior Full Stack Engineer, LangGraph Architect, Financial Research Analyst, UI/UX Expert, and Software Architect. Build a COMPLETE production-grade AI application called AlphaBoard AI. This is an enterprise AI Investment Research Platform. User enters a company name. Multiple AI agents collaborate, debate, vote. A final investment recommendation is generated."

**AI Response Summary:**
The AI proposed a complete system architecture with 15 React components, a centralized agent engine service, and a CSS design system. It recommended React + Vite + TypeScript over Next.js to avoid server-side complexity for an internship demo.

**Decision Made:**
Accepted the React + Vite architecture. Prioritized client-side execution to eliminate backend deployment requirements.

**Resulting Feature:**
Full project scaffold with `App.tsx` routing shell, `agentEngine.ts` service layer, and `index.css` design system.

---

## 2. Prompt Engineering

**Prompt to AI:**
> "Create prompts for each AI agent. The Financial Analyst should analyze balance sheets. The Risk Officer should scan for red flags. The Chairman should aggregate votes and produce a final memo."

**AI Response Summary:**
The AI designed structured JSON-output prompts for 5 Gemini API calls: Planner, Valuation Expert, Risk Officer, Advocates Panel, and Chairman. Each prompt includes role assignment, specific metrics to evaluate, and a strict JSON response schema.

**Decision Made:**
Used `responseMimeType: 'application/json'` in the Gemini API config to enforce structured output. Added `.trim()` preprocessing for edge cases.

**Resulting Code:**
```typescript
// agentEngine.ts
async function callGeminiAPI(prompt: string, apiKey: string): Promise<any> {
  const response = await fetch(url, {
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });
  return JSON.parse(result.candidates[0].content.parts[0].text.trim());
}
```

---

## 3. Architecture Discussions

**Prompt to AI:**
> "Should we use real LangGraph.js or simulate the multi-agent workflow client-side?"

**AI Response Summary:**
The AI recommended a client-side simulation that mirrors the exact LangGraph data contract (shared state schema, node types, edge routing). This avoids backend deployment costs while maintaining the same interface for a future LangGraph migration.

**Decision Made:**
Built client-side orchestrator with `AgentNode` types matching LangGraph node structure. Documented the migration path in ADR-001.

**Resulting Feature:**
`generateGeminiAnalysis()` function that coordinates 5 sequential/parallel Gemini API calls with real-time progress callbacks.

---

## 4. UI Design

**Prompt to AI:**
> "The UI must look like Bloomberg Terminal + Perplexity + Stripe Dashboard. Dark mode, glassmorphic, animated, production-ready."

**AI Response Summary:**
The AI created a CSS variable system with 30+ design tokens, glassmorphic card styles using `backdrop-filter: blur()`, animated gradient blobs, floating particles, and a typing text effect for the hero section.

**Decision Made:**
Used Vanilla CSS over Tailwind to maintain precise control over backdrop-filter compositing and print stylesheet overrides.

**Resulting Feature:**
`index.css` with `.glass-panel`, `.floating-navbar`, `.hero-gradient-text`, and `@media print` rules. Full dark/light theme toggle via CSS Custom Properties.

---

## 5. Debugging

**Prompt to AI:**
> "Build is failing with: `error TS1484: 'CompanyAnalysis' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`"

**AI Response Summary:**
The AI explained that TypeScript's `verbatimModuleSyntax` requires type-only imports to use `import type { X }` syntax, separate from value imports.

**Decision Made:**
Split all component imports to separate value imports from type imports.

**Resulting Fix:**
```typescript
// Before (error)
import { generateCompanyAnalysis, CompanyAnalysis } from '../services/agentEngine';

// After (fixed)
import { generateCompanyAnalysis } from '../services/agentEngine';
import type { CompanyAnalysis } from '../services/agentEngine';
```

---

## 6. Refactoring

**Prompt to AI:**
> "The `getPortfolioAllocations` function is missing an else return. Also, rename `prompt-library/` to `ai-prompt-specifications/` and `llm-transcripts/` to `ai-engineering-logs/` for professionalism."

**AI Response Summary:**
The AI fixed the missing return branch and wrote a Node.js rename script to restructure the documentation folders. It also replaced the single `engineering-decisions.md` file with an `engineering-decisions/` directory containing individual ADR files.

**Decision Made:**
Adopted Architecture Decision Record (ADR) format for engineering decisions. Each ADR documents Context, Decision, and Consequences.

**Resulting Feature:**
- `docs/engineering-decisions/ADR-001.md` — Client-side simulation rationale
- `docs/engineering-decisions/ADR-002.md` — Native SVG chart rationale
- `docs/engineering-decisions/ADR-003.md` — Vanilla CSS rationale

---

## 7. Feature Design

### 7a. Gemini API Integration

**Prompt to AI:**
> "Instead of showing static recommendations, let Gemini generate them. Create multi-agent prompts. Call Gemini multiple times with different system prompts."

**AI Response Summary:**
The AI built `generateGeminiAnalysis()` with 5 API calls: Planner → Financial+Risk (parallel) → Debate → Chairman. Each call uses a specialized system prompt and returns structured JSON. A graceful fallback to the simulated engine activates on API failure.

**Decision Made:**
Used `Promise.all()` for the Financial and Risk agents (independent), then sequential calls for Debate and Chairman (dependent on prior results).

**Resulting Feature:**
Real AI analysis with live progress updates in the Research Pipeline. API key configurable via a glassmorphic modal in the Navbar.

### 7b. Voice Search

**Prompt to AI:**
> "Add voice search using the browser's SpeechRecognition API."

**AI Response Summary:**
The AI added a mic button to both the Landing Page hero search bar and the Navbar command palette. It uses `webkitSpeechRecognition` with feature detection, auto-submits the transcript after 600ms, and shows a pulsing red "Listening…" banner during recording.

**Decision Made:**
Zero external dependencies — uses browser-native API only. Shows a warning banner in unsupported browsers.

**Resulting Feature:**
🎤 Voice input button in search bar + command palette (Ctrl+K). Speak a company name to auto-analyze.

### 7c. Explainability Panel

**Prompt to AI:**
> "When the AI recommends BUY, let users expand a panel showing which agents contributed, which sources were used, the confidence level, the biggest risks, and the strongest positive signals."

**AI Response Summary:**
The AI built a collapsible "Why This Recommendation?" panel with chevron toggle, displaying agent vote grid, cited sources, SWOT positive signals, and active red flags.

**Decision Made:**
Placed the panel prominently at the top of the dashboard terminal to emphasize explainability as a core differentiator.

**Resulting Feature:**
Collapsible explainability widget in `CompanyDashboard.tsx`.

---

## Build Verification

All sessions concluded with a successful production build:

```
> tsc -b && vite build
✓ 99 modules transformed.
✓ built in 1.02s — zero errors, zero warnings.
```

---

## Summary

This development log demonstrates genuine AI-assisted development practices:

1. **AI was used for**: architecture planning, prompt engineering, component scaffolding, debugging TypeScript errors, and feature design.
2. **Human decisions included**: technology stack selection, UX priorities, fallback strategies, and documentation structure.
3. **Every AI suggestion was reviewed**, tested via TypeScript compilation, and verified through manual browser testing before acceptance.
