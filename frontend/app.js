// app.js — PennyScope frontend
const API = "http://localhost:8000";

let currentView   = "dashboard";
let marketFilter  = "both";
let latestData    = {};   // { us: {...}, in: {...} }

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  setupNav();
  checkOllama();
  loadResults();
  setInterval(loadResults, 60_000);     // refresh every 60s
  setInterval(checkOllama, 30_000);
});

function setupNav() {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      el.classList.add("active");
      currentView = el.dataset.view;
      render();
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// API CALLS
// ─────────────────────────────────────────────────────────────────────────────
async function loadResults() {
  try {
    const res  = await fetch(`${API}/api/results/latest?market=both`);
    if (!res.ok) throw new Error(res.statusText);
    latestData = await res.json();
    updateTopbar();
    render();
  } catch (e) {
    showError(`Cannot reach backend at ${API}. Is it running?`);
  }
}

async function triggerScan() {
  const btn = document.getElementById("scanBtn");
  btn.disabled = true;
  btn.innerHTML = `<div class="spinner"></div> Scanning…`;

  const endpoint = marketFilter === "us"   ? "/api/scan/us"
                 : marketFilter === "in"   ? "/api/scan/in"
                 : "/api/scan/both";
  try {
    await fetch(`${API}${endpoint}`, { method: "POST" });
    // Poll until results update
    let polls = 0;
    const poll = setInterval(async () => {
      polls++;
      await loadResults();
      if (polls > 60) {   // 5 minute max wait
        clearInterval(poll);
        resetScanBtn();
      }
      // Check if a new scan finished
      const latest = latestData;
      if (latest?.us?.scan_info || latest?.in?.scan_info) {
        clearInterval(poll);
        resetScanBtn();
      }
    }, 5_000);
  } catch (e) {
    resetScanBtn();
  }
}

function resetScanBtn() {
  const btn = document.getElementById("scanBtn");
  btn.disabled = false;
  btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Run scan`;
}

async function checkOllama() {
  const dot   = document.getElementById("ollamaDot");
  const label = document.getElementById("ollamaLabel");
  try {
    const res = await fetch(`${API.replace("8000","11434")}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      dot.className = "dot online";
      label.textContent = "Ollama · online";
      return;
    }
  } catch {}
  dot.className = "dot offline";
  label.textContent = "Ollama · offline";
}

async function loadHistory() {
  const res  = await fetch(`${API}/api/history?limit=30`);
  return res.ok ? await res.json() : [];
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────────────────────────────────────
function updateTopbar() {
  const label = document.getElementById("lastScanLabel");
  const times = [];
  if (latestData?.us?.scan_info?.finished_at) times.push(new Date(latestData.us.scan_info.finished_at));
  if (latestData?.in?.scan_info?.finished_at) times.push(new Date(latestData.in.scan_info.finished_at));
  if (times.length) {
    const latest = new Date(Math.max(...times));
    label.textContent = `Last scan: ${timeAgo(latest)}`;
  } else {
    label.textContent = "No scan completed yet";
  }
}

function setMarketFilter(m) {
  marketFilter = m;
  ["Both","US","IN"].forEach(id => {
    document.getElementById(`toggle${id}`).classList.remove("active");
  });
  document.getElementById(`toggle${m.charAt(0).toUpperCase() + m.slice(1)}`).classList.add("active");
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER ROUTER
// ─────────────────────────────────────────────────────────────────────────────
function render() {
  const content = document.getElementById("content");
  if (currentView === "dashboard") renderDashboard(content);
  else if (currentView === "us")   renderMarketView(content, "us");
  else if (currentView === "in")   renderMarketView(content, "in");
  else if (currentView === "history") renderHistory(content);
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────
function renderDashboard(el) {
  const us = latestData?.us || {};
  const IN = latestData?.in || {};

  const usSig   = us.signals || [];
  const inSig   = IN.signals || [];
  const allSig  = [...usSig.map(s => ({...s, market:"US"})), ...inSig.map(s => ({...s, market:"IN"}))];
  allSig.sort((a,b) => b.score - a.score);

  const totalScanned = (us.scan_info?.stocks_scanned || 0) + (IN.scan_info?.stocks_scanned || 0);
  const totalSignals = allSig.length;
  const highSentiment = allSig.filter(s => s.score >= 65).length;
  const avgSpike = allSig.length
    ? (allSig.reduce((a,s) => a + (s.volume_spike || 1), 0) / allSig.length).toFixed(1)
    : "—";

  el.innerHTML = `
    <div class="metric-row">
      ${metric("Stocks scanned", totalScanned || "—", "")}
      ${metric("Buy signals", totalSignals || "—", "green")}
      ${metric("High score (65+)", highSentiment || "—", "amber")}
      ${metric("Avg vol spike", avgSpike !== "—" ? avgSpike + "×" : "—", "")}
    </div>

    <div class="two-col">
      <div class="panel">
        <div class="panel-title">Top picks <span>score · price · change</span></div>
        ${allSig.length ? allSig.slice(0,8).map(s => stockRow(s, true)).join("") : empty("Run a scan to see picks")}
      </div>

      <div class="panel">
        <div class="panel-title">Scan coverage</div>
        ${scanInfoBlock("US", us)}
        ${scanInfoBlock("IN", IN)}
      </div>
    </div>

    ${aiBox("US", us.summary)}
    ${aiBox("IN", IN.summary)}
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKET-SPECIFIC VIEW
// ─────────────────────────────────────────────────────────────────────────────
function renderMarketView(el, market) {
  const data = latestData?.[market] || {};
  const sigs = data.signals || [];
  const info = data.scan_info;
  const label = market === "us" ? "US Market (OTC / NYSE / NASDAQ)" : "IN Market (NSE / BSE)";
  const currency = market === "us" ? "USD" : "INR";

  el.innerHTML = `
    <div>
      <div class="section-title">${label}</div>
      <div class="section-sub">${info ? `${info.stocks_scanned} scanned · ${info.signals_found} signals · ${timeAgo(new Date(info.finished_at))}` : "No scan data yet"}</div>
    </div>

    <div class="metric-row">
      ${metric("Signals found", sigs.length || "—", "green")}
      ${metric("Top score", sigs[0]?.score?.toFixed(0) || "—", "green")}
      ${metric("Avg vol spike", sigs.length ? (sigs.reduce((a,s)=>a+(s.volume_spike||1),0)/sigs.length).toFixed(1)+"×" : "—", "")}
      ${metric("Insider buys", market === "us" ? sigs.filter(s=>s.insider_buy).length : "N/A", "amber")}
    </div>

    <div class="panel">
      <div class="panel-title">All signals <span>sorted by score</span></div>
      ${sigs.length ? sigs.map(s => stockRow({...s, market: market.toUpperCase()}, false)).join("") : empty("Run a scan first")}
    </div>

    ${aiBox(market.toUpperCase(), data.summary)}
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// HISTORY VIEW
// ─────────────────────────────────────────────────────────────────────────────
async function renderHistory(el) {
  el.innerHTML = `<div class="loading"><div class="spinner"></div> Loading history…</div>`;
  const history = await loadHistory();

  if (!history.length) {
    el.innerHTML = `<div class="panel">${empty("No scan history yet")}</div>`;
    return;
  }

  const rows = history.map(s => `
    <tr>
      <td><span class="market-badge badge-${s.market.toLowerCase()}">${s.market}</span></td>
      <td>${s.started_at ? timeAgo(new Date(s.started_at)) : "—"}</td>
      <td>${s.stocks_scanned ?? "—"}</td>
      <td>${s.signals_found ?? "—"}</td>
      <td style="max-width:320px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#888;">${s.ai_summary?.slice(0,80) || "—"}</td>
    </tr>
  `).join("");

  el.innerHTML = `
    <div class="panel">
      <div class="panel-title">Scan history</div>
      <table class="history-table">
        <thead><tr><th>Market</th><th>When</th><th>Scanned</th><th>Signals</th><th>Summary</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function metric(label, value, colorClass) {
  return `
    <div class="metric">
      <div class="metric-label">${label}</div>
      <div class="metric-val ${colorClass}">${value}</div>
    </div>`;
}

function scoreClass(score) {
  if (score >= 65) return "score-high";
  if (score >= 45) return "score-med";
  return "score-low";
}

function stockRow(s, showMarket) {
  const currency = s.currency === "INR" ? "₹" : "$";
  const chg      = (s.change_pct ?? 0);
  const chgClass = chg >= 0 ? "up" : "down";
  const chgStr   = (chg >= 0 ? "+" : "") + chg.toFixed(1) + "%";

  return `
    <div class="stock-row">
      <div class="ticker-info">
        <div class="ticker">${s.ticker}${s.insider_buy ? ' <span class="insider-tag">insider buy</span>' : ""}${showMarket ? ` <span class="market-tag">${s.market}</span>` : ""}</div>
        <div class="stock-name">${s.name || ""}</div>
      </div>
      <div class="row-right">
        <span class="score-badge ${scoreClass(s.score)}">${s.score?.toFixed(0)}</span>
        <div class="price-info">
          <div class="price">${currency}${(s.price || 0).toFixed(s.currency === "INR" ? 1 : 3)}</div>
          <div class="change ${chgClass}">${chgStr}</div>
        </div>
      </div>
    </div>`;
}

function aiBox(market, summary) {
  if (!summary) return "";
  const sources = market === "US"
    ? ["Finviz", "Yahoo Finance", "Reddit", "StockTwits", "SEC EDGAR"]
    : ["screener.in", "NSE India", "MoneyControl"];

  return `
    <div class="ai-box">
      <div class="ai-box-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        AI summary · ${market} market (Ollama)
      </div>
      <div class="ai-box-text">${summary}</div>
      <div class="source-chips">${sources.map(s => `<span class="chip">${s}</span>`).join("")}</div>
    </div>`;
}

function scanInfoBlock(market, data) {
  const info = data?.scan_info;
  if (!info) return `<div style="padding:8px 0;color:#bbb;font-size:12px;">${market}: no scan yet</div>`;
  return `
    <div style="padding:10px 0;border-bottom:0.5px solid rgba(0,0,0,0.06);">
      <span class="market-badge badge-${market.toLowerCase()}">${market}</span>
      <span style="margin-left:8px;font-size:12px;color:#888;">${info.stocks_scanned} scanned · ${info.signals_found} signals · ${timeAgo(new Date(info.finished_at))}</span>
    </div>`;
}

function empty(msg) {
  return `<div class="empty">${msg}</div>`;
}

function showError(msg) {
  document.getElementById("content").innerHTML = `<div class="panel"><div class="empty" style="color:#D85A30;">${msg}</div></div>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return date.toLocaleDateString();
}
