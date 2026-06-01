# backend/db/models.py
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from backend.db.database import Base


class ScanResult(Base):
    """One row per scan run — metadata about the scan itself."""
    __tablename__ = "scan_results"

    id          = Column(Integer, primary_key=True, index=True)
    market      = Column(String(4), nullable=False)   # "US" or "IN"
    started_at  = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True))
    stocks_scanned = Column(Integer, default=0)
    signals_found  = Column(Integer, default=0)
    ai_summary  = Column(Text, nullable=True)


class StockSignal(Base):
    """One row per stock per scan that passed the minimum score threshold."""
    __tablename__ = "stock_signals"

    id          = Column(Integer, primary_key=True, index=True)
    scan_id     = Column(Integer, nullable=False)     # FK to ScanResult.id
    market      = Column(String(4), nullable=False)   # "US" or "IN"
    ticker      = Column(String(20), nullable=False)
    name        = Column(String(120), nullable=True)
    price       = Column(Float, nullable=True)
    currency    = Column(String(4), default="USD")
    change_pct  = Column(Float, nullable=True)        # % change today
    volume      = Column(Float, nullable=True)
    volume_spike = Column(Float, nullable=True)       # ratio vs 30d avg
    score       = Column(Float, nullable=False)       # 0–100 composite
    signals     = Column(Text, nullable=True)         # JSON string of raw sub-scores
    insider_buy = Column(Boolean, default=False)      # US only
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    