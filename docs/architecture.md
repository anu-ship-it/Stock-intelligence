# System Architecture

## Overview

Stock Intelligence is a desktop-based stock research platform designed for personal use.

The application collects stock data from multiple sources, analyzes it using technical and fundamental indicators, evaluates risk, generates recommendations, and produces AI-powered summaries.

The platform focuses on swing and position trading opportunities with a target holding period of 1–6 months.

---

# High-Level Architecture

┌─────────────────────┐
│ Electron Frontend   │
└──────────┬──────────┘
│ IPC
▼
┌─────────────────────┐
│ Backend API Layer   │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Service Layer       │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Analysis Engines    │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Recommendation      │
│ Engine              │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ Ollama AI Layer     │
└──────────┬──────────┘
│
▼
┌─────────────────────┐
│ SQLite Database     │
└─────────────────────┘

---

# Data Flow

Market Sources
↓
Scrapers
↓
SQLite Database
↓
Technical Analysis
↓
Fundamental Analysis
↓
Sentiment Analysis
↓
Risk Analysis
↓
Recommendation Engine
↓
AI Summary Generation
↓
Dashboard

---

# Layer Responsibilities

## Scraper Layer

Location:

scrapers/

Purpose:

Collect raw market data.

Responsibilities:

* Download stock data
* Download news data
* Normalize source formats
* Store raw information

Must NOT:

* Calculate indicators
* Generate recommendations
* Call AI models

---

## Repository Layer

Location:

backend/repositories/

Purpose:

Database access abstraction.

Responsibilities:

* Read data
* Write data
* Update records
* Delete records

Must NOT:

* Run business logic
* Calculate scores

---

## Service Layer

Location:

backend/services/

Purpose:

Orchestrate business workflows.

Responsibilities:

* Execute scans
* Trigger analyses
* Generate reports
* Coordinate engines

Must NOT:

* Contain heavy calculation logic

---

## Technical Engine

Location:

backend/engines/technical/

Purpose:

Calculate technical indicators.

Indicators:

* RSI
* MACD
* EMA
* SMA
* Volume Growth
* Trend Strength

Output:

Technical Score

Range:

0 - 100

---

## Fundamental Engine

Location:

backend/engines/fundamentals/

Purpose:

Evaluate company fundamentals.

Metrics:

* Revenue Growth
* Earnings Growth
* Debt Levels
* Profit Margins
* Market Capitalization

Output:

Fundamental Score

Range:

0 - 100

---

## Sentiment Engine

Location:

backend/engines/sentiment/

Purpose:

Evaluate news sentiment.

Input:

* Headlines
* News Articles

Output:

Sentiment Score

Range:

0 - 100

---

## Risk Engine

Location:

backend/engines/risk/

Purpose:

Measure downside risk.

Factors:

* Volatility
* Liquidity
* Drawdowns
* Debt Risk

Output:

Risk Score

Range:

0 - 100

Lower is better.

---

## Recommendation Engine

Location:

backend/engines/recommendation/

Purpose:

Generate final recommendation.

Inputs:

* Technical Score
* Fundamental Score
* Sentiment Score
* Risk Score

Output:

BUY
WATCH
AVOID

Confidence:

0 - 100

This is the most important component in the entire application.

---

## AI Layer

Location:

ai/

Purpose:

Explain recommendations.

Models:

* Qwen
* DeepSeek
* Llama

Responsibilities:

* Explain signals
* Summarize news
* Summarize market conditions

Must NOT:

* Decide whether a stock is BUY or AVOID

Recommendation decisions belong to the Recommendation Engine.

---

# Scan Workflow

User clicks:

Start Scan

↓

scan-orchestrator.service.ts

↓

Scrapers execute

↓

Data stored in SQLite

↓

Analysis engines run

↓

Scores generated

↓

Recommendation engine runs

↓

Top candidates selected

↓

AI summaries generated

↓

Results displayed

---

# AI Processing Strategy

Incorrect:

All Stocks
↓
AI Analysis

Correct:

All Stocks
↓
Scoring Engine
↓
Top 20 Stocks
↓
AI Analysis

Reason:

Reduces processing time dramatically.

---

# Failure Handling

If scraper fails:

* Log error
* Continue scan

If AI fails:

* Show recommendation without summary

If news unavailable:

* Continue using technical and fundamental scores

The system should degrade gracefully.

---

# Future Expansion

Possible additions:

* Portfolio Tracking
* Paper Trading
* Email Alerts
* Telegram Alerts
* Cloud Synchronization
* Additional Markets

These features must remain optional and not affect core architecture.
