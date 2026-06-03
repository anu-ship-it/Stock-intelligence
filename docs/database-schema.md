# Database Schema

## Overview

The database is designed around historical analysis.

The system must preserve historical stock prices, scores, recommendations, and news so that backtesting remains possible.

Database:

SQLite

ORM:

Prisma

---

# Entity Relationship Overview

Market
│
└── Stock
│
├── DailyPrice
│
├── FinancialMetric
│
├── NewsArticle
│
├── TechnicalScore
│
├── FundamentalScore
│
├── SentimentScore
│
├── RiskScore
│
└── Recommendation

---

# Markets

Represents supported exchanges.

Table:

markets

Fields:

id

name

country

currency

createdAt

Example:

NSE

BSE

NYSE

NASDAQ

---

# Stocks

Master stock table.

Table:

stocks

Fields:

id

symbol

companyName

marketId

sector

industry

marketCap

isActive

createdAt

updatedAt

Examples:

TCS

INFY

AAPL

MSFT

---

# Daily Prices

Stores historical price data.

Table:

daily_prices

Fields:

id

stockId

date

open

high

low

close

volume

createdAt

Unique:

(stockId, date)

Purpose:

* Technical indicators
* Backtesting
* Historical analysis

---

# Financial Metrics

Stores company fundamentals.

Table:

financial_metrics

Fields:

id

stockId

reportDate

revenue

netIncome

debt

cash

eps

peRatio

pbRatio

roe

roce

createdAt

Purpose:

* Fundamental scoring

* Growth analysis

* Valuation analysis

---

# News Articles

Stores collected news.

Table:

news_articles

Fields:

id

stockId

headline

summary

source

publishedAt

url

createdAt

Purpose:

* Sentiment analysis

* News history

---

# Technical Scores

Table:

technical_scores

Fields:

id

stockId

scanDate

rsi

macd

volumeScore

trendScore

finalScore

createdAt

Range:

0 - 100

---

# Fundamental Scores

Table:

fundamental_scores

Fields:

id

stockId

scanDate

growthScore

valuationScore

debtScore

profitabilityScore

finalScore

createdAt

Range:

0 - 100

---

# Sentiment Scores

Table:

sentiment_scores

Fields:

id

stockId

scanDate

headlineScore

newsScore

finalScore

createdAt

Range:

0 - 100

---

# Risk Scores

Table:

risk_scores

Fields:

id

stockId

scanDate

volatilityScore

liquidityScore

drawdownScore

finalScore

createdAt

Range:

0 - 100

Lower is better.

---

# Recommendations

Final system output.

Table:

recommendations

Fields:

id

stockId

scanDate

recommendation

confidence

entryPrice

targetPrice

stopLoss

technicalScore

fundamentalScore

sentimentScore

riskScore

summary

createdAt

Values:

BUY

WATCH

AVOID

Purpose:

* Dashboard

* Reports

* Historical tracking

* Backtesting

---

# Watchlist

User selected stocks.

Table:

watchlist

Fields:

id

stockId

notes

createdAt

Purpose:

Manual monitoring.

---

# Scan History

Tracks scan executions.

Table:

scan_history

Fields:

id

startedAt

completedAt

totalStocks

successfulStocks

failedStocks

status

createdAt

Purpose:

Monitoring and debugging.

---

# AI Cache

Stores AI responses.

Table:

ai_cache

Fields:

id

cacheKey

model

promptHash

response

createdAt

Purpose:

Avoid repeated Ollama calls.

---

# Backtest Runs

Stores historical simulations.

Table:

backtest_runs

Fields:

id

strategyName

startDate

endDate

cagr

winRate

maxDrawdown

sharpeRatio

createdAt

Purpose:

Track strategy performance.

---

# Design Rules

Rule 1

Never overwrite historical data.

Always insert new records.

---

Rule 2

Scores must be timestamped.

Historical scores are required for backtesting.

---

Rule 3

Recommendations must be stored permanently.

Future analysis depends on comparing predictions with actual results.

---

Rule 4

AI summaries are optional.

Recommendations must work without AI.

---

Rule 5

Backtesting is a first-class feature.

Every table should support historical analysis.

---

# Expected Database Growth

After One Year:

Stocks:
10,000+

Daily Prices:
3,000,000+

News Articles:
100,000+

Recommendations:
100,000+

SQLite can comfortably handle this workload on a local machine.
