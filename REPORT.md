# Consolidated Investment Committee Report

Consolidated documentation repository detailing the architecture, prompt engineering, developer build milestones, and system interfaces for AlphaBoard AI.

---

## 🏗️ Architectural Overview
AlphaBoard AI utilizes a client-side orchestrator that simulates a hierarchical 13-node state graph (mimicking a LangGraph DAG). 
The **Planner Node** delegating workloads in parallel to analyst specialists (Financial, News, Market, Risk, Moat, and ESG) who feed calculations into the **Valuation Node**. Upside and downside advocates (Bull and Bear Advocates) argue points checked by a **Fact-Checker** and challenged by the **Devil's Advocate**. The final vote matrix is summarized by the **Committee Chairman**.

## 📖 Key Showcases
1.  **Consensus Terminal:** High-density Bloomberg-style visual displays.
2.  **Explainability Banner:** Collin-style breakdown showing who voted, sources used, and why.
3.  **Prompt Library:** Sandbox displaying the actual neural prompts with live replacements.
4.  **Developer Mode:** Interactive playground and state debugger.
