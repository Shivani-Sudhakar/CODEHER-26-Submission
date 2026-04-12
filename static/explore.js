// Gamified Xplore Tab Logic

const EXPLORE_ZONES = [
  {
    id: 'tech', name: 'Tech Citadel', color: '#8b5cf6', icon: '💻', desc: 'Master coding and algorithms.',
    games: [
      { id: 'algopuzzle', name: 'Algorithm Puzzle', path: '/static/games/algorithm_puzzle.html' },
      { id: 'binarybattle', name: 'Binary Battle', path: '/static/games/binary_battle.html' },
      { id: 'bughunt', name: 'Bug Hunt', path: '/static/games/bug_hunt.html' },
      { id: 'networkdefender', name: 'Network Defender', path: '/static/games/network_defender.html' }
    ]
  },
  {
    id: 'healer', name: 'Healer\'s Realm', color: '#10b981', icon: '⚕️', desc: 'Diagnose and save patients.',
    games: [
      { id: 'symptomsort', name: 'Symptom Sort', path: '/static/games/symptom_sort.html' },
      { id: 'bodysystems', name: 'Body Systems Battle', path: '/static/games/body_systems_battle.html' },
      { id: 'pathogendefense', name: 'Pathogen Defense', path: '/static/games/pathogen_defense.html' },
      { id: 'dnasequencer', name: 'DNA Sequencer', path: '/static/games/dna_sequencer.html' }
    ]
  },
  {
    id: 'justice', name: 'Justice Fortress', color: '#f59e0b', icon: '⚖️', desc: 'Debate, analyze, and lead.',
    games: [
      { id: 'panchayatpuzzle', name: 'Panchayat Puzzle', path: '/static/games/panchayat_puzzle.html' },
      { id: 'courtroomdrama', name: 'Courtroom Drama', path: '/static/games/courtroom_drama.html' },
      { id: 'debateduel', name: 'Debate Duel', path: '/static/games/debate_duel.html' },
      { id: 'evidenceanalyzer', name: 'Evidence Analyzer', path: '/static/games/evidence_analyzer.html' }
    ]
  },
  {
    id: 'finance', name: 'Finance Vault', color: '#ec4899', icon: '🏦', desc: 'Trade stocks and build empires.',
    games: [
      { id: 'cryptominer', name: 'Crypto Miner', path: '/static/games/crypto_miner.html' },
      { id: 'stockmarket', name: 'Stock Market', path: '/static/games/stock_market.html' },
      { id: 'startuppitch', name: 'Startup Pitch', path: '/static/games/startup_pitch.html' },
      { id: 'budgetrpg', name: 'Budget RPG', path: '/static/games/budget_rpg.html' }
    ]
  },
  {
    id: 'agri', name: 'Agri Kingdom', color: '#4ade80', icon: '🌾', desc: 'Farm, trade, and conquer agriculture.',
    games: [
      { id: 'agrimarketbattle', name: 'Agri Market Battle', path: '/static/games/agri_market_battle.html' },
      { id: 'dronefarming', name: 'Drone Farming RPG', path: '/static/games/drone_farming.html' },
      { id: 'seedsafari', name: 'Seed Safari', path: '/static/games/seed_safari.html' },
      { id: 'harvesttycoon', name: 'Harvest Tycoon', path: '/static/games/harvest_tycoon.html' }
    ]
  }
];

const ROSTER = [
    { id: 'arjun', name: 'Arjun', role: 'Wizard', icon: '🔮' },
    { id: 'priya', name: 'Priya', role: 'Warrior', icon: '⚔️' },
    { id: 'meena', name: 'Meena', role: 'Healer', icon: '💚' },
    { id: 'raju', name: 'Raju', role: 'Merchant', icon: '💰' }
];

const XP_PLAY_MIN_SECONDS = 12;

let expState = {
  initialized: false,
  activeHero: null,
  activeZone: null,
  activeGame: null,
  timerInt: null,
  timeLeft: 0,
  scoreEarned: 0,
  activeGameIdx: null,
  finishing: false,
  gameSessionStart: null
};

function syncExploreCoins() {
  const c = window.currentUser != null ? window.currentUser.coins : 0;
  const elE = document.getElementById('xpExploreCoins');
  const elI = document.getElementById('xpIngameCoins');
  if (elE) elE.textContent = c;
  if (elI) elI.textContent = c;
}
window.syncExploreCoins = syncExploreCoins;

// Insert Styles dynamically
const style = document.createElement('style');
style.textContent = `
  #xp-container { font-family: 'Inter', sans-serif; background: #0a0a0f; color: #fff; min-height: 100%; position: relative; scrollbar-width: none; -ms-overflow-style: none; }
  #xp-container::-webkit-scrollbar { display: none; width: 0; height: 0; }
  .xp-screen { display: none; flex-direction: column; align-items: center; justify-content: flex-start; min-height: calc(100vh - 110px); padding: 20px; animation: xpFade 0.3s ease; text-align: center; }
  .xp-screen.active { display: flex; }
  @keyframes xpFade { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  
  .xp-title { font-size: 32px; font-weight: 900; background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 10px; }
  .xp-desc { color: #9ca3af; margin-bottom: 30px; font-size: 15px; max-width: 400px; line-height: 1.5; }
  .xp-btn { background: #3b82f6; color: #fff; border: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(59,130,246,0.4); }
  .xp-btn:hover { background: #2563eb; transform: translateY(-2px); }
  
  /* Roster */
  .xp-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; width: 100%; max-width: 400px; }
  .xp-card { background: #1f2937; border: 2px solid #374151; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: 0.2s; }
  .xp-card:hover { border-color: #8b5cf6; background: #2e1065; transform: translateY(-3px); }
  .xp-card-icon { font-size: 40px; margin-bottom: 10px; }
  .xp-card-title { font-weight: 700; font-size: 18px; margin-bottom: 4px; }
  .xp-card-sub { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }

  /* Hub */
  .xp-hub-header { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 500px; padding: 20px; background: #111827; border-radius: 16px; margin-bottom: 30px; border: 1px solid #374151; }
  .xp-hub-user { display: flex; align-items: center; gap: 15px; }
  .xp-hub-avatar { font-size: 32px; background: #1f2937; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #8b5cf6; }

  /* Map */
  .xp-map { position: relative; width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 15px; }
  .xp-zone-row { display: flex; align-items: center; background: #1f2937; border-radius: 12px; padding: 15px; cursor: pointer; border: 1px solid transparent; transition: 0.2s; position: relative; overflow: hidden; }
  .xp-zone-row:hover { transform: translateX(5px); }
  .xp-zone-icon { font-size: 30px; width: 50px; text-align: center; z-index: 2;}
  .xp-zone-info { text-align: left; margin-left: 10px; z-index: 2; }
  .xp-zone-title { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
  .xp-zone-desc { font-size: 13px; color: #d1d5db; }
  .xp-zone-bg { position: absolute; inset: 0; opacity: 0.1; z-index: 1; transition: 0.3s; }
  .xp-zone-row:hover .xp-zone-bg { opacity: 0.3; }

  /* In-Game */
  #xp-s7-ingame { padding: 0 !important; height: 100vh; overflow: hidden; align-items: stretch; justify-content: flex-start; margin: 0; }
  .xp-ingame-wrapper { display: flex; flex-direction: column; width: 100%; height: 100%; }
  .xp-ingame-header { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 10px 20px; background: #000; border-bottom: 1px solid #333; flex-shrink: 0; }
  .xp-coins-pill { display: inline-flex; align-items: center; gap: 6px; color: #ffd859; font-weight: 700; font-size: 15px; white-space: nowrap; }
  .xp-timer { font-family: monospace; font-size: 20px; font-weight: bold; color: #facc15; }
  .xp-timer.danger { color: #ef4444; animation: pulseRed 1s infinite; }
  @keyframes pulseRed { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  #xp-game-frame { flex: 1; width: 100%; border: none; background: #000; display: block; }
  
  .back-btn { align-self: flex-start; margin-bottom: 20px; background: transparent; border: 1px solid #4b5563; color: #fff; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .back-btn:hover { background: #374151; }
`;
document.head.appendChild(style);

function initExplore() {
    if (expState.initialized) {
        syncExploreCoins();
        return;
    }

    const container = document.getElementById('xp-container');
    if (!container) return;

    // Create 8 screens
    container.innerHTML = `
        <!-- State 1: Splash -->
        <div id="xp-s1-splash" class="xp-screen active">
            <div style="font-size: 60px; margin-bottom: 20px;">🧭</div>
            <h1 class="xp-title">Explore The Realms</h1>
            <p class="xp-desc">Venture into the Unknown. Master mini-games across 5 distinct career zones to earn XP and Coins.</p>
            <button class="xp-btn" onclick="expGo(2)">Embark on Quest</button>
        </div>

        <!-- State 2: Roster -->
        <div id="xp-s2-roster" class="xp-screen">
            <h2 class="xp-title">Choose Your Avatar</h2>
            <p class="xp-desc">Select a hero to represent you in the Explore tab.</p>
            <div class="xp-grid" id="xp-roster-grid"></div>
        </div>

        <!-- State 3: Hub -->
        <div id="xp-s3-hub" class="xp-screen" style="justify-content: flex-start; padding-top: 40px;">
            <div class="xp-hub-header">
                <div class="xp-hub-user">
                    <div class="xp-hub-avatar" id="xp-hub-icon">👤</div>
                    <div style="text-align: left;">
                        <div style="font-weight: 700; font-size: 18px;" id="xp-hub-name">Hero Name</div>
                        <div style="color: #8b5cf6; font-size: 14px; font-weight: 600;">Explorer</div>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <div class="xp-coins-pill" title="Your coins"><span aria-hidden="true">🪙</span> <span id="xpExploreCoins">0</span></div>
                    <button class="xp-btn" style="padding: 10px 20px; font-size: 14px;" onclick="expGo(4)">Open Map 🗺️</button>
                </div>
            </div>
            
            <div style="background: #1f2937; padding: 30px; border-radius: 16px; width: 100%; max-width: 500px; text-align: center; border: 1px solid #374151;">
                <h3 style="margin-bottom: 15px; color: #facc15;">Daily Objective</h3>
                <p style="color: #d1d5db; margin-bottom: 20px;">Play 3 mini-games across any zone to earn a bonus chest!</p>
                <div style="height: 10px; background: #374151; border-radius: 5px; overflow: hidden; margin-bottom: 10px;">
                    <div style="height: 100%; width: 33%; background: #10b981;"></div>
                </div>
                <div style="font-size: 12px; color: #9ca3af;">1 / 3 Completed</div>
            </div>
        </div>

        <!-- State 4: Map -->
        <div id="xp-s4-map" class="xp-screen" style="justify-content: flex-start; padding-top: 20px;">
            <button class="back-btn" onclick="expGo(3)">← Back to Hub</button>
            <h2 class="xp-title">Realm Map</h2>
            <p class="xp-desc">Select a career zone to explore its challenges.</p>
            <div class="xp-map" id="xp-map-container"></div>
        </div>

        <!-- State 5: Zone Details -->
        <div id="xp-s5-zone" class="xp-screen" style="justify-content: flex-start; padding-top: 20px;">
            <button class="back-btn" onclick="expGo(4)">← Realm Map</button>
            <div id="xp-zone-icon-lg" style="font-size: 80px; margin: 20px 0;"></div>
            <h2 class="xp-title" id="xp-zone-title-lg">Zone Name</h2>
            <p class="xp-desc" id="xp-zone-desc-lg">Zone description.</p>
            <button class="xp-btn" style="margin-top: 20px; width: 100%; max-width: 300px;" onclick="expGo(6)">View Challenges</button>
        </div>

        <!-- State 6: Game List -->
        <div id="xp-s6-gamelist" class="xp-screen" style="justify-content: flex-start; padding-top: 20px;">
            <button class="back-btn" onclick="expGo(5)">← Zone Info</button>
            <h2 class="xp-title">Available Quests</h2>
            <p class="xp-desc" style="margin-bottom: 15px;">Complete these mini-games to master the zone.</p>
            <div class="xp-map" id="xp-gamelist-container"></div>
        </div>

        <!-- State 7: In Game -->
        <div id="xp-s7-ingame" class="xp-screen" style="padding: 0; min-height: 0;">
            <div class="xp-ingame-wrapper">
                <div class="xp-ingame-header">
                    <div style="font-weight: bold; color: #a78bfa; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis;" id="xp-ig-title">Game Title</div>
                    <div class="xp-coins-pill" title="Your coins"><span aria-hidden="true">🪙</span> <span id="xpIngameCoins">0</span></div>
                    <div class="xp-timer" id="xp-timer-out">⏱ 60</div>
                    <button class="xp-btn" style="padding: 8px 16px; background: #ef4444; border-radius: 6px; box-shadow: none; flex-shrink: 0;" onclick="expFinishGame('manual')">End / Done</button>
                </div>
                <iframe id="xp-game-frame" src=""></iframe>
            </div>
        </div>

        <!-- State 8: Results -->
        <div id="xp-s8-results" class="xp-screen">
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h2 class="xp-title">Quest Complete!</h2>
            <p class="xp-desc" id="xp-results-desc">You survived the challenge and gained valuable experience.</p>
            
            <div style="background: #1f2937; padding: 25px; border-radius: 12px; margin-bottom: 30px; display: flex; gap: 40px; border: 1px solid #3b82f6;">
                <div>
                    <div style="color: #9ca3af; font-size: 13px; text-transform: uppercase;">XP Earned</div>
                    <div style="font-size: 28px; font-weight: bold; color: #a78bfa;" id="xp-res-xp">+0</div>
                </div>
                <div>
                    <div style="color: #9ca3af; font-size: 13px; text-transform: uppercase;">Coins Earned</div>
                    <div style="font-size: 28px; font-weight: bold; color: #facc15;" id="xp-res-coins">+0</div>
                </div>
            </div>
            
            <button class="xp-btn" onclick="expGo(6)">Return to Quests</button>
        </div>
    `;

    buildRoster();
    buildMap();

    expState.initialized = true;
    syncExploreCoins();

    // Auto populate hub if user info exists
    if (window.currentUser) {
        setHero(window.currentUser.hero || 'arjun');
        expGo(3);
    }
}

function expGo(stateNum) {
    document.querySelectorAll('.xp-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`xp-s${stateNum}-${['','splash','roster','hub','map','zone','gamelist','ingame','results'][stateNum]}`).classList.add('active');

    const uh = document.getElementById('userHeader');
    const bn = document.getElementById('bottomNav');
    const ev = document.getElementById('exploreView');

    if (stateNum === 7) {
        if (uh) uh.style.display = 'none';
        if (bn) bn.style.display = 'none';
        if (ev) ev.style.padding = '0';
        
        // Start game logic
        startIframeGame();
    } else {
        if (uh) uh.style.display = 'flex';
        if (bn) bn.style.display = 'flex';
        if (ev) ev.style.padding = '0 0 110px 0';
    }
}

function buildRoster() {
    const grid = document.getElementById('xp-roster-grid');
    grid.innerHTML = ROSTER.map(h => `
        <div class="xp-card" onclick="setHero('${h.id}')">
            <div class="xp-card-icon">${h.icon}</div>
            <div class="xp-card-title">${h.name}</div>
            <div class="xp-card-sub">${h.role}</div>
        </div>
    `).join('');
}

function setHero(id) {
    const hero = ROSTER.find(h => h.id === id) || ROSTER[0];
    expState.activeHero = hero;
    
    document.getElementById('xp-hub-icon').textContent = hero.icon;
    const pName = window.currentUser ? (window.currentUser.player_name || 'Hero') : 'Hero';
    document.getElementById('xp-hub-name').textContent = pName;
    syncExploreCoins();

    expGo(3);
}

function buildMap() {
    const map = document.getElementById('xp-map-container');
    map.innerHTML = EXPLORE_ZONES.map((z, i) => `
        <div class="xp-zone-row" style="border-color: ${z.color}40;" onclick="selectZone(${i})">
            <div class="xp-zone-bg" style="background: ${z.color};"></div>
            <div class="xp-zone-icon">${z.icon}</div>
            <div class="xp-zone-info">
                <div class="xp-zone-title" style="color: ${z.color};">${z.name}</div>
                <div class="xp-zone-desc">${z.desc}</div>
            </div>
            <div style="margin-left: auto; z-index: 2; color: #9ca3af;">▶</div>
        </div>
    `).join('');
}

function selectZone(idx) {
    const z = EXPLORE_ZONES[idx];
    expState.activeZone = z;
    
    // Populate zone info
    document.getElementById('xp-zone-icon-lg').textContent = z.icon;
    document.getElementById('xp-zone-title-lg').textContent = z.name;
    document.getElementById('xp-zone-title-lg').style.color = z.color;
    document.getElementById('xp-zone-desc-lg').textContent = z.desc;
    
    // Populate gamelist
    const gl = document.getElementById('xp-gamelist-container');
    gl.innerHTML = z.games.map((g, i) => `
        <div class="xp-zone-row" style="border-color: ${g.path ? z.color : '#374151'}40; opacity: ${g.path ? 1 : 0.6};" onclick="selectGame(${i})">
            <div class="xp-zone-icon" style="font-size:24px;">🎮</div>
            <div class="xp-zone-info">
                <div class="xp-zone-title">${g.name}</div>
                <div class="xp-zone-desc">${g.path ? 'Playable Mini-Game' : 'Coming Soon'}</div>
            </div>
            <div style="margin-left: auto; z-index: 2; font-size: 12px; font-weight: bold; background: ${g.path ? '#10b981' : '#4b5563'}; padding: 4px 10px; border-radius: 20px; color: #fff;">
                ${g.path ? 'PLAY' : 'LOCKED'}
            </div>
        </div>
    `).join('');
    
    expGo(5);
}

function selectGame(idx) {
    const g = expState.activeZone.games[idx];
    if (!g.path) {
        if(window.showToast) window.showToast('This game is still under construction!', 'info');
        else alert('Game coming soon!');
        return;
    }
    expState.activeGame = g;
    expState.activeGameIdx = idx;
    expGo(7);
}

function startIframeGame() {
    const frame = document.getElementById('xp-game-frame');
    document.getElementById('xp-ig-title').textContent = expState.activeGame.name;
    syncExploreCoins();

    expState.finishing = false;
    expState.gameSessionStart = Date.now();

    // Load iframe
    frame.src = expState.activeGame.path;

    // Start wrapper timer (60 seconds)
    expState.timeLeft = 60;
    const timerOut = document.getElementById('xp-timer-out');
    timerOut.textContent = `⏱ 60`;
    timerOut.classList.remove('danger');
    
    if (expState.timerInt) clearInterval(expState.timerInt);
    
    expState.timerInt = setInterval(() => {
        expState.timeLeft--;
        timerOut.textContent = `⏱ ${Math.max(0, expState.timeLeft)}`;
        
        if (expState.timeLeft <= 10) {
            timerOut.classList.add('danger');
        }
        
        if (expState.timeLeft <= 0) {
            expFinishGame('timer');
        }
    }, 1000);
}

function expFinishGame(finishReason) {
    const reason = finishReason === 'timer' ? 'timer' : 'manual';
    if (expState.finishing) return;
    expState.finishing = true;

    clearInterval(expState.timerInt);
    document.getElementById('xp-game-frame').src = '';

    const start = expState.gameSessionStart || Date.now();
    const elapsedSec = (Date.now() - start) / 1000;
    const played = reason === 'timer' || elapsedSec >= XP_PLAY_MIN_SECONDS;

    const xpBonus = played ? 50 : 0;
    const coinBonus = played ? (expState.activeGameIdx + 1) * 25 : 0;

    document.getElementById('xp-res-xp').textContent = `+${xpBonus}`;
    document.getElementById('xp-res-coins').textContent = `+${coinBonus}`;

    const descEl = document.getElementById('xp-results-desc');
    if (descEl) {
        if (played) {
            descEl.textContent = 'You survived the challenge and gained valuable experience.';
        } else {
            descEl.textContent = `Play at least ${XP_PLAY_MIN_SECONDS} seconds (or let the timer run out) to earn XP and coins.`;
        }
    }

    expGo(8);

    if (window.currentUser && played) {
        window.currentUser.xp += xpBonus;
        window.currentUser.coins += coinBonus;

        const xpNeeded = window.currentUser.level * 500;
        if (window.currentUser.xp >= xpNeeded) {
            window.currentUser.xp -= xpNeeded;
            window.currentUser.level++;
            if (window.showToast) window.showToast(`Level Up! You are now Level ${window.currentUser.level}!`, 'success');
        }

        fetch('/api/save-gamestate', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                xp: window.currentUser.xp,
                coins: window.currentUser.coins,
                level: window.currentUser.level
            })
        }).catch(err => console.error(err));

        if (typeof window.refreshRewardsView === 'function') {
            window.refreshRewardsView(window.currentUser.coins);
        } else {
            syncExploreCoins();
        }
    } else if (!played) {
        if (window.showToast) {
            window.showToast(`Play at least ${XP_PLAY_MIN_SECONDS}s to earn rewards.`, 'info');
        }
        syncExploreCoins();
    }
}

// Make accessible to window
window.initExplore = initExplore;
window.expFinishGame = expFinishGame;
