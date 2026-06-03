# Scoring Model

## Purpose

Convert raw market data into a consistent recommendation.

The recommendation engine is the final decision-maker.

AI models are used only for explanations.

---

# Final Recommendation Flow

Raw Market Data
↓
Technical Analysis
↓
Fundamental Analysis
↓
Sentiment Analysis
↓
Risk Analysis
↓
Score Aggregation
↓
BUY / WATCH / AVOID
↓
AI Explanation

---

# Overall Score Formula

Final Score =
(
Technical Score × 0.30
+
Fundamental Score × 0.35
+
Sentiment Score × 0.15
+
Risk Adjusted Score × 0.20
)

Range:

0 - 100

---

# Technical Score

Maximum:

100

Components:

Trend Strength = 30

Volume Expansion = 25

Moving Average Alignment = 20

RSI = 15

MACD = 10

Formula:

Technical Score =
Trend +
Volume +
MA +
RSI +
MACD

---

## Trend Strength

Strong Uptrend

30

Moderate Uptrend

20

Sideways

10

Downtrend

0

---

## Volume Expansion

Current Volume ≥ 3x Average

25

Current Volume ≥ 2x Average

20

Current Volume ≥ 1.5x Average

10

Otherwise

0

---

## Moving Average Alignment

Price > 50 DMA > 200 DMA

20

Price > 50 DMA

10

Otherwise

0

---

## RSI

50–70

15

40–50

10

70–80

5

Below 40

0

Above 80

0

---

## MACD

Bullish Crossover

10

Neutral

5

Bearish

0

---

# Fundamental Score

Maximum:

100

Components:

Revenue Growth = 25

Profit Growth = 25

Debt Quality = 20

Profitability = 15

Valuation = 15

---

## Revenue Growth

Greater Than 25%

25

10–25%

15

0–10%

5

Negative

0

---

## Profit Growth

Greater Than 25%

25

10–25%

15

0–10%

5

Negative

0

---

## Debt Quality

Debt To Equity < 0.5

20

0.5 - 1.0

10

Above 1.0

0

---

## Profitability

ROE > 15%

15

ROE 10–15%

10

ROE < 10%

0

---

## Valuation

Undervalued

15

Fairly Valued

10

Overvalued

0

---

# Sentiment Score

Maximum:

100

Components:

News Sentiment = 70

Market Sentiment = 30

---

## News Sentiment

Mostly Positive

70

Mixed

35

Negative

0

---

## Market Sentiment

Bullish Sector

30

Neutral Sector

15

Bearish Sector

0

---

# Risk Score

Maximum:

100

Lower Is Better

Components:

Volatility

Liquidity

Drawdown

Market Cap Risk

---

## Convert To Risk Adjusted Score

Risk Adjusted Score =

100 - Risk Score

Example:

Risk Score = 25

Risk Adjusted Score = 75

---

# Hard Filters

These execute BEFORE scoring.

Any failure causes rejection.

---

## Liquidity Filter

Average Daily Volume

Must Be Above Minimum Threshold

---

## Price Filter

Stock Must Trade Above:

₹10

or

$1

---

## Debt Filter

Debt To Equity

Must Be Less Than 2

---

## Market Cap Filter

Avoid Microcaps Below Configurable Threshold

---

# Recommendation Thresholds

Final Score ≥ 80

BUY

---

Final Score 60–79

WATCH

---

Final Score < 60

AVOID

---

# Confidence Calculation

Confidence =
Final Score
− Risk Penalty

Example:

Final Score = 88

Risk Penalty = 10

Confidence = 78

---

# Position Sizing Recommendation

Confidence ≥ 90

High Conviction

---

Confidence 80–89

Medium Conviction

---

Confidence < 80

Low Conviction

---

# AI Usage Rules

AI Must Never:

Generate Scores

Generate Confidence

Generate Recommendations

AI May:

Explain Recommendation

Summarize News

Summarize Risks

Generate Reports

---

# Future Enhancements

Possible Additions:

Institutional Ownership

Insider Buying

Promoter Activity

Options Flow

Sector Rotation

Relative Strength Ranking

These features should contribute additional scoring factors without changing the core architecture.
