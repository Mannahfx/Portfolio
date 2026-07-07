// ==========================================
// SCROLL NAVIGATION HELPERS
// ==========================================
function scrollToContact() {
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function scrollToSimulator() {
  const el = document.getElementById("simulator");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ==========================================
// CHAT BOT INTERACTION LOGIC
// ==========================================
function toggleChat() {
  const chat = document.getElementById("chat-box-container");
  if (!chat) return;

  if (chat.style.display === "flex") {
    chat.style.display = "none";
  } else {
    chat.style.display = "flex";
    // Scroll messages to bottom on open
    const chatBox = document.getElementById("chat-box");
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
  }
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;

  const msgWrap = document.createElement("div");
  msgWrap.className = `msg-wrap ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.innerText = sender === "user" ? "👤" : "🤖";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.innerText = text;

  msgWrap.appendChild(avatar);
  msgWrap.appendChild(bubble);

  chatBox.appendChild(msgWrap);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return null;

  const msgWrap = document.createElement("div");
  msgWrap.className = "msg-wrap ai";
  msgWrap.id = "typing-indicator-wrap";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.innerText = "🤖";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  
  const dots = document.createElement("div");
  dots.className = "typing-dots";
  dots.innerHTML = "<span></span><span></span><span></span>";

  bubble.appendChild(dots);
  msgWrap.appendChild(avatar);
  msgWrap.appendChild(bubble);
  chatBox.appendChild(msgWrap);
  chatBox.scrollTop = chatBox.scrollHeight;

  return msgWrap;
}

async function sendChat() {
  const input = document.getElementById("chat-input");
  if (!input) return;
  const text = input.value.trim();

  if (!text) return;

  addMessage("user", text);
  input.value = "";

  const typingIndicator = addTypingIndicator();

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    if (typingIndicator) typingIndicator.remove();

    const data = await res.json();
    addMessage("ai", data.reply);

  } catch (err) {
    if (typingIndicator) typingIndicator.remove();
    addMessage("ai", "⚠️ Error connecting to MANNA Core Systems AI backend.");
    console.error(err);
  }
}

function applySuggestion(text) {
  const input = document.getElementById("chat-input");
  if (input) {
    input.value = text;
    sendChat();
  }
}

// ENTER KEY SUPPORT FOR CHAT
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("chat-input");
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendChat();
      }
    });
  }

  // START SIMULATOR AUTOMATED TICKERS
  startFintechTicker();
  startAgritechTicker();
});


// ==========================================
// PORTFOLIO SIMULATION SANDBOX
// ==========================================
let activeTab = "fintech";

function switchTab(tab) {
  activeTab = tab;
  
  const fintechTabBtn = document.querySelector(".fintech-tab");
  const agritechTabBtn = document.querySelector(".agritech-tab");
  const fintechSandbox = document.getElementById("fintech-sandbox");
  const agritechSandbox = document.getElementById("agritech-sandbox");

  if (tab === "fintech") {
    fintechTabBtn.classList.add("active");
    agritechTabBtn.classList.remove("active");
    fintechSandbox.classList.add("active");
    agritechSandbox.classList.remove("active");
  } else {
    agritechTabBtn.classList.add("active");
    fintechTabBtn.classList.remove("active");
    agritechSandbox.classList.add("active");
    fintechSandbox.classList.remove("active");
  }
}

// --- FINTECH SIMULATOR STATE ---
let currentStockPrice = 2450.80;
let currentLatency = 1.18;
const strategies = ["MOMENTUM_AI", "BEARISH_COVER", "BULLISH_RSI", "NEUTRAL_GRID"];
let strategyIndex = 0;
let fintechInterval = null;

function addFintechLog(message) {
  const consoleEl = document.getElementById("fintech-logs");
  if (!consoleEl) return;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `<span>[${timeStr}]</span> ${message}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function startFintechTicker() {
  if (fintechInterval) clearInterval(fintechInterval);
  
  fintechInterval = setInterval(() => {
    if (activeTab !== "fintech") return;
    
    // Add random slight fluctuation
    const change = (Math.random() - 0.48) * 4.5;
    currentStockPrice += change;
    currentLatency = 1.0 + Math.random() * 0.35;
    
    document.getElementById("fintech-price").innerText = currentStockPrice.toFixed(2);
    document.getElementById("fintech-latency").innerText = currentLatency.toFixed(2);
    
    // Animate visual bars randomly
    const bars = document.querySelectorAll("#fintech-chart .chart-bar");
    bars.forEach(bar => {
      const height = Math.floor(Math.random() * 60) + 30; // 30% to 90%
      bar.style.height = `${height}%`;
    });
    
    // Log ticker occasionally
    if (Math.random() > 0.6) {
      const direction = change >= 0 ? "BUY SIGNAL ASCENT" : "SELL TRADING ADJUST";
      addFintechLog(`FEED TICK: $${currentStockPrice.toFixed(2)} // ${direction}`);
    }
  }, 1600);
}

function triggerVolatility() {
  addFintechLog("⚠️ WARNING: SIMULATING HIGH MARKET VOLATILITY EVENT...");
  
  // Set system rebalancing status temporarily
  const sysStatusEl = document.querySelector("#fintech-sandbox .screen-header div:last-child");
  if (sysStatusEl) {
    sysStatusEl.innerText = "SYS: REBALANCING";
    sysStatusEl.style.color = "var(--accent-gold)";
  }
  
  // Large swing
  const swing = (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 80);
  currentStockPrice += swing;
  document.getElementById("fintech-price").innerText = currentStockPrice.toFixed(2);
  
  // Animate all bars to flash/go high
  const bars = document.querySelectorAll("#fintech-chart .chart-bar");
  bars.forEach(bar => {
    bar.style.height = "98%";
  });

  setTimeout(() => {
    addFintechLog(`⚡ LIQUIDITY RESPONSE ACTIVATED. EXECUTED BALANCING TRADES.`);
    addFintechLog(`📈 NET EXPOSURE STABILIZED. DELTA: ${(swing * 0.05).toFixed(2)}%`);
    
    if (sysStatusEl) {
      sysStatusEl.innerText = "SYS: SECURE";
      sysStatusEl.style.color = "var(--fintech-primary)";
    }
  }, 1200);
}

function toggleStrategy() {
  strategyIndex = (strategyIndex + 1) % strategies.length;
  const newStrategy = strategies[strategyIndex];
  document.getElementById("fintech-strategy").innerText = newStrategy;
  addFintechLog(`🔄 ALGO SWAP: LOADED STRATEGY [${newStrategy}]`);
}


// --- AGRITECH SIMULATOR STATE ---
let currentMoisture = 34;
let valveActive = false;
let valveInterval = null;
let agritechInterval = null;

function addAgritechLog(message) {
  const consoleEl = document.getElementById("agritech-logs");
  if (!consoleEl) return;
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `<span>[${timeStr}]</span> ${message}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function startAgritechTicker() {
  if (agritechInterval) clearInterval(agritechInterval);
  
  agritechInterval = setInterval(() => {
    if (activeTab !== "agritech") return;
    
    // Slow moisture degradation
    if (!valveActive && currentMoisture > 15) {
      if (Math.random() > 0.7) {
        currentMoisture -= 1;
        document.getElementById("agritech-moisture").innerText = `${currentMoisture}%`;
        if (currentMoisture < 25) {
          addAgritechLog(`⚠️ SOIL CRITICAL: MOISTURE LEVEL DROPPED TO ${currentMoisture}%`);
        }
      }
    }
    
    // Telemetry noise
    const noise = -80 - Math.floor(Math.random() * 15);
    document.getElementById("agritech-telemetry").innerText = `${noise}dBm`;
  }, 3000);
}

function toggleIrrigation() {
  if (valveActive) return; // Prevent double trigger
  
  valveActive = true;
  document.getElementById("agritech-valve-status").innerText = "ACTIVE";
  
  // Visual tweaks
  const valveHeaderStatus = document.querySelector("#agritech-sandbox .screen-header div:last-child");
  if (valveHeaderStatus) {
    valveHeaderStatus.innerText = "VALVE: ACTIVE (FLOW 3.8 L/S)";
    valveHeaderStatus.style.color = "var(--agritech-primary)";
  }
  
  const valveIcon = document.getElementById("valve-icon");
  const valveLight = document.getElementById("valve-light");
  const valveCell = document.getElementById("valve-cell");
  
  if (valveIcon) valveIcon.style.transform = "rotate(720deg)";
  if (valveLight) valveLight.classList.add("active");
  if (valveCell) valveCell.style.borderColor = "var(--agritech-primary)";
  
  addAgritechLog("💧 COMMAND ISSUED: OPEN IRRIGATION GATE NODE #087-C");
  addAgritechLog("💧 HYDRO VALVES REPORTING PRESSURE STABLE. DISCHARGING...");

  let duration = 10; // 10 second run
  const btn = document.getElementById("irrigation-toggle-btn");
  if (btn) btn.disabled = true;

  valveInterval = setInterval(() => {
    duration -= 1;
    if (btn) btn.innerText = `Watering... (${duration}s)`;
    
    // Increase moisture
    if (currentMoisture < 85) {
      currentMoisture += 4;
      document.getElementById("agritech-moisture").innerText = `${currentMoisture}%`;
    }

    if (duration <= 0) {
      clearInterval(valveInterval);
      valveActive = false;
      document.getElementById("agritech-valve-status").innerText = "IDLE";
      
      if (valveHeaderStatus) {
        valveHeaderStatus.innerText = "VALVE: CLOSED";
        valveHeaderStatus.style.color = "var(--text-secondary)";
      }
      
      if (valveIcon) valveIcon.style.transform = "rotate(0deg)";
      if (valveLight) valveLight.classList.remove("active");
      if (valveCell) valveCell.style.borderColor = "var(--border-color)";
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Trigger Sprinklers (10s)";
      }
      addAgritechLog("🔒 HYDRO VALVE #087-C DISCHARGE CYCLE FINISHED. VALVE CLOSED.");
      addAgritechLog(`ℹ️ SOIL HEALTH RE-INDEXED. STABILITY VALUE: ${currentMoisture}% MOISTURE.`);
    }
  }, 1000);
}

function dispatchDroneScan() {
  const droneIcon = document.getElementById("drone-icon");
  const droneLight = document.getElementById("drone-light");
  const droneCell = document.getElementById("drone-cell");
  const droneBtn = document.getElementById("drone-btn");
  
  if (droneIcon) droneIcon.style.transform = "scale(1.2)";
  if (droneLight) droneLight.classList.add("active");
  if (droneCell) droneCell.style.borderColor = "var(--agritech-primary)";
  if (droneBtn) {
    droneBtn.disabled = true;
    droneBtn.innerText = "Scanning Canopy...";
  }

  addAgritechLog("🛸 DISPATCHING AUTONOMOUS DRONE APEX-9 OVER ZONE 4...");
  
  setTimeout(() => {
    addAgritechLog("🛸 APEX-9: ESTABLISHED 5G TELEMETRY LOCK. RUNNING CAM LINK.");
  }, 1000);

  setTimeout(() => {
    addAgritechLog("🛸 SCAN SUMMARY: CANOPY LEAF INDEX IS 94% OPTIMAL. NO STRESS SPOTS.");
    
    if (droneIcon) droneIcon.style.transform = "scale(1)";
    if (droneLight) droneLight.classList.remove("active");
    if (droneCell) droneCell.style.borderColor = "var(--border-color)";
    if (droneBtn) {
      droneBtn.disabled = false;
      droneBtn.innerText = "Dispatch Canopy Scan";
    }
  }, 4000);
}


// ==========================================
// LEAD GENERATION FORM SUBMIT
// ==========================================
function handleContactSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById("user-name").value;
  const email = document.getElementById("user-email").value;
  const category = document.getElementById("system-interest").value;
  const msg = document.getElementById("user-msg").value;

  // Simulate receipt
  alert(`Thank you, ${name}! We have registered your consultation request for ${category.toUpperCase()} automation. A lead infrastructure engineer will reply to ${email} within 1 business day.`);
  
  // Reset form
  document.getElementById("portfolio-contact-form").reset();
}
