// OMG the Horde — Phase 1 (Foundations)
// All numbers below come from the design doc. Future phases extend CONFIG;
// they should not rewrite Phase 1 values.

const BUILD_VERSION = 'phase2-v1';
console.log(`[OMG the Horde] build ${BUILD_VERSION}`);

// =====================================================================
// CONFIG
// =====================================================================

const CONFIG = {
  startGold: 200,
  maxWave: 10,

  // Castle: base + 10 upgrades (Phase 2 extends levels 3–10).
  castle: {
    levels: [
      { hp: 20,  cost: 0    },
      { hp: 45,  cost: 25   },
      { hp: 80,  cost: 50   },
      { hp: 125, cost: 100  },
      { hp: 180, cost: 150  },
      { hp: 235, cost: 300  },
      { hp: 290, cost: 500  },
      { hp: 345, cost: 750  },
      { hp: 405, cost: 1000 },
      { hp: 460, cost: 1500 },
      { hp: 600, cost: 2000 },
    ],
  },

  // Wall (gate): base + 10 upgrades.
  wall: {
    levels: [
      { hp: 20,  cost: 0    },
      { hp: 35,  cost: 25   },
      { hp: 55,  cost: 50   },
      { hp: 80,  cost: 100  },
      { hp: 110, cost: 150  },
      { hp: 140, cost: 300  },
      { hp: 170, cost: 500  },
      { hp: 195, cost: 750  },
      { hp: 215, cost: 1000 },
      { hp: 230, cost: 1500 },
      { hp: 300, cost: 2000 },
    ],
  },

  // Archer Tower: base + 3 upgrades. L4 gains pierce x2 and 20% crit.
  archerTower: {
    placeCost: 0,
    levels: [
      { dmg: 2,  fireRate: 1.0, range: 170, cost: 0,  pierce: 1, crit: 0    },
      { dmg: 4,  fireRate: 1.2, range: 185, cost: 10, pierce: 1, crit: 0    },
      { dmg: 7,  fireRate: 1.5, range: 205, cost: 20, pierce: 1, crit: 0    },
      { dmg: 12, fireRate: 2.0, range: 220, cost: 35, pierce: 2, crit: 0.2  },
    ],
  },

  // Militia: one trains at a time, globally.
  militia: {
    soldier:       { label: 'Soldier',        unlockCost: 1,   cost: 5,  buildTime: 3, hp: 5,  dmg: 1,  range: 28,  ranged: false, color: '#9ec3d9', attackInterval: 1.0 },
    archer:        { label: 'Archer',         unlockCost: 5,   cost: 7,  buildTime: 3, hp: 7,  dmg: 3,  range: 200, ranged: true,  projSpeed: 320, color: '#cdd99e', attackInterval: 1.0 },
    knight:        { label: 'Knight',         unlockCost: 15,  cost: 10, buildTime: 4, hp: 10, dmg: 5,  range: 34,  ranged: false, color: '#d9b69e', attackInterval: 1.0 },
    mountedKnight: { label: 'Mounted Knight', unlockCost: 30,  cost: 15, buildTime: 5, hp: 20, dmg: 10, range: 38,  ranged: false, color: '#c4986b', attackInterval: 1.0 },
    crossbowman:   { label: 'Crossbowman',    unlockCost: 50,  cost: 20, buildTime: 6, hp: 25, dmg: 12, range: 230, ranged: true,  projSpeed: 380, color: '#b8c97a', attackInterval: 1.0 },
    mage:          { label: 'Mage',           unlockCost: 100, cost: 30, buildTime: 5, hp: 15, dmg: 25, range: 220, ranged: true,  projSpeed: 260, color: '#c490d9', attackInterval: 2.0, projColor: '#ff9c4a', projSize: 4 },
    catapult:      { label: 'Catapult',       unlockCost: 250, cost: 35, buildTime: 7, hp: 30, dmg: 30, range: 240, ranged: true,  projSpeed: 200, color: '#8a6c4a', attackInterval: 2.0, projColor: '#5a4636', projSize: 5, splash: { radius: 48, maxTargets: 5 } },
    hero:          { label: 'Hero',           unlockCost: 500, cost: 50, buildTime: 9, hp: 50, dmg: 50, range: 40,  ranged: false, color: '#f0c060', attackInterval: 1.0 },
  },

  // Per-wave enemy stats from the doc. Counts multiplied x100 for stress testing.
  waves: [
    { // Wave 1
      grunts: 500, archers: 0, catapults: 0, bosses: 100,
      grunt:  { hp: 5,  dmg: 2, drop: 1 },
      archer: { hp: 12, dmg: 5, drop: 3 },
      catapult: { hp: 30, dmg: 10, drop: 6 },
      boss:   { hp: 10, dmg: 4, drop: 5 },
    },
    { // Wave 2
      grunts: 1000, archers: 0, catapults: 0, bosses: 100,
      grunt:  { hp: 10, dmg: 4, drop: 2 },
      archer: { hp: 12, dmg: 5, drop: 3 },
      catapult: { hp: 30, dmg: 10, drop: 6 },
      boss:   { hp: 20, dmg: 6, drop: 10 },
    },
    { // Wave 3
      grunts: 1000, archers: 500, catapults: 0, bosses: 100,
      grunt:  { hp: 10, dmg: 4, drop: 3 },
      archer: { hp: 12, dmg: 5, drop: 3 },
      catapult: { hp: 30, dmg: 10, drop: 6 },
      boss:   { hp: 30, dmg: 8, drop: 15 },
    },
    { // Wave 4
      grunts: 1000, archers: 1000, catapults: 0, bosses: 100,
      grunt:  { hp: 12, dmg: 5, drop: 4 },
      archer: { hp: 14, dmg: 6, drop: 4 },
      catapult: { hp: 30, dmg: 10, drop: 6 },
      boss:   { hp: 40, dmg: 10, drop: 20 },
    },
    { // Wave 5
      grunts: 1500, archers: 1500, catapults: 0, bosses: 100,
      grunt:  { hp: 14, dmg: 6, drop: 5 },
      archer: { hp: 16, dmg: 7, drop: 5 },
      catapult: { hp: 30, dmg: 10, drop: 6 },
      boss:   { hp: 50, dmg: 12, drop: 25 },
    },
    { // Wave 6 — Orc Catapult joins (drop 6g)
      grunts: 1800, archers: 1800, catapults: 800, bosses: 100,
      grunt:  { hp: 16, dmg: 7, drop: 6 },
      archer: { hp: 18, dmg: 8, drop: 6 },
      catapult: { hp: 30, dmg: 10, drop: 6 },
      boss:   { hp: 60, dmg: 14, drop: 30 },
    },
    { // Wave 7 — drop 7g
      grunts: 2200, archers: 2200, catapults: 1000, bosses: 100,
      grunt:  { hp: 18, dmg: 8, drop: 7 },
      archer: { hp: 20, dmg: 9, drop: 7 },
      catapult: { hp: 35, dmg: 12, drop: 7 },
      boss:   { hp: 70, dmg: 16, drop: 35 },
    },
    { // Wave 8 — drop 8g
      grunts: 2500, archers: 2500, catapults: 1200, bosses: 100,
      grunt:  { hp: 20, dmg: 9, drop: 8 },
      archer: { hp: 22, dmg: 10, drop: 8 },
      catapult: { hp: 40, dmg: 14, drop: 8 },
      boss:   { hp: 80, dmg: 18, drop: 40 },
    },
    { // Wave 9 — drop 9g
      grunts: 3000, archers: 3000, catapults: 1400, bosses: 100,
      grunt:  { hp: 22, dmg: 10, drop: 9 },
      archer: { hp: 24, dmg: 11, drop: 9 },
      catapult: { hp: 45, dmg: 16, drop: 9 },
      boss:   { hp: 90, dmg: 20, drop: 45 },
    },
    { // Wave 10 — drop 10g
      grunts: 3500, archers: 3500, catapults: 1600, bosses: 100,
      grunt:  { hp: 24, dmg: 11, drop: 10 },
      archer: { hp: 26, dmg: 12, drop: 10 },
      catapult: { hp: 50, dmg: 18, drop: 10 },
      boss:   { hp: 100, dmg: 22, drop: 50 },
    },
  ],

  // Enemy movement/combat.
  enemyStats: {
    grunt:    { speed: 32, range: 14, attackInterval: 1.0, ranged: false, color: '#7aa657' },
    archer:   { speed: 26, range: 26, attackInterval: 1.4, ranged: true,  projSpeed: 280, color: '#a4c45d' },
    catapult: { speed: 18, range: 30, attackInterval: 2.0, ranged: true,  projSpeed: 180, color: '#6a4a30', big: true, projColor: '#3a2a1c', projSize: 4 },
    boss:     { speed: 26, range: 20, attackInterval: 1.0, ranged: false, color: '#3d6b1f', big: true },
  },

  spawnInterval: 0.03,
  bossDelay: 0.6,
};

// =====================================================================
// GEOMETRY
// =====================================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Winding white road. Enters top-center, sweeps left-right-left-right in front
// of the wall, then turns into the gate in the middle of the wall.
const PATH = [
  { x: 450, y: -30 },  // 0 - off-screen spawn (top, center)
  { x: 450, y: 60 },   // 1 - enter visible
  { x: 820, y: 60 },   // 2 - top-right corner
  { x: 820, y: 150 },  // 3
  { x: 80,  y: 150 },  // 4 - sweep right→left
  { x: 80,  y: 240 },  // 5
  { x: 820, y: 240 },  // 6 - sweep left→right
  { x: 820, y: 330 },  // 7
  { x: 450, y: 330 },  // 8 - approach to gate
  { x: 450, y: 405 },  // 9 - GATE position (end of path)
];
const GATE_IDX = PATH.length - 1;
const GATE = PATH[GATE_IDX];

// Wall is a horizontal barrier at y=410 with a gate gap in the centre.
const WALL_Y = 410;
const WALL_THICKNESS = 22;
const WALL_LEFT_END  = 410;  // wall section ends here (left of gate)
const WALL_RIGHT_END = 490;  // wall section resumes here (right of gate)
const WALL_BOARD_LEFT  = 60;
const WALL_BOARD_RIGHT = 840;

// Tower slots placed in the pockets between road sweeps so they have line of
// sight to the path as the horde winds past them.
const SLOTS = [
  { idx: 0, x: 260, y: 105, radius: 16 },  // between sweep 1 (y=60) and sweep 2 (y=150)
  { idx: 1, x: 640, y: 105, radius: 16 },
  { idx: 2, x: 260, y: 195, radius: 16 },  // between sweep 2 and sweep 3
  { idx: 3, x: 640, y: 195, radius: 16 },
  { idx: 4, x: 260, y: 285, radius: 16 },  // between sweep 3 and the gate-approach row
  { idx: 5, x: 640, y: 285, radius: 16 },
];

const CASTLE = { x: 450, y: 485, r: 32 };

function dist(ax, ay, bx, by) {
  const dx = ax - bx, dy = ay - by;
  return Math.hypot(dx, dy);
}

// =====================================================================
// STATE
// =====================================================================

const state = {
  gold: CONFIG.startGold,
  wave: 0,
  waveActive: false,
  spawnQueue: [],          // queued enemies waiting to spawn
  nextSpawnAt: 0,
  waveCleared: false,

  castle: { hp: 0, maxHp: 0, level: 0 },
  wall:   { hp: 0, maxHp: 0, level: 0, broken: false },

  towers: [],              // { slotIdx, level, cooldown }
  militia: [],             // { type, x, y, hp, maxHp, cooldown }
  trainingQueue: [],       // [type, ...]
  currentTraining: null,   // { type, timeLeft, total }
  unlocked: { soldier: false, archer: false, knight: false, mountedKnight: false, crossbowman: false, mage: false, catapult: false, hero: false },

  enemies: [],
  projectiles: [],         // { x, y, vx, vy, dmg, targetId, source }

  gameOver: false,
  win: false,

  selected: { kind: 'none', slotIdx: -1 }, // 'none' | 'castle' | 'wall' | 'slot'

  totalGoldEarned: 0,
  lastTime: 0,
};

// Init from config.
state.castle.maxHp = CONFIG.castle.levels[0].hp;
state.castle.hp = state.castle.maxHp;
state.wall.maxHp = CONFIG.wall.levels[0].hp;
state.wall.hp = state.wall.maxHp;
// Player starts with one free archer tower in the middle slot.
state.towers.push({ slotIdx: 2, level: 0, cooldown: 0 });

let entityIdCounter = 1;
function nextId() { return entityIdCounter++; }

// =====================================================================
// UI WIRING
// =====================================================================

const hudGold   = document.getElementById('hud-gold');
const hudWave   = document.getElementById('hud-wave');
const hudWall   = document.getElementById('hud-wall');
const hudCastle = document.getElementById('hud-castle');
const status    = document.getElementById('status');
const playBtn   = document.getElementById('play-btn');
const banner    = document.getElementById('result-banner');

const ctxDefault = document.getElementById('ctx-default');
const ctxCastle  = document.getElementById('ctx-castle');
const ctxWall    = document.getElementById('ctx-wall');
const ctxSlot    = document.getElementById('ctx-slot');

function setStatus(msg) { status.textContent = msg; }

function showBanner(text, kind) {
  banner.textContent = text;
  banner.className = kind || '';
  banner.hidden = false;
}

function hideBanner() {
  banner.hidden = true;
  banner.textContent = '';
  banner.className = '';
}

function updateHUD() {
  hudGold.textContent = `Gold: ${state.gold}`;
  hudWave.textContent = `Wave: ${state.wave} / ${CONFIG.maxWave}`;
  hudWall.textContent = `Wall: ${state.wall.broken ? 'destroyed' : Math.max(0, Math.ceil(state.wall.hp)) + ' / ' + state.wall.maxHp}`;
  hudCastle.textContent = `Castle: ${Math.max(0, Math.ceil(state.castle.hp))} / ${state.castle.maxHp}`;

  if (state.waveActive) {
    playBtn.disabled = true;
    playBtn.textContent = `Wave ${state.wave}…`;
  } else if (state.gameOver) {
    playBtn.disabled = false;
    playBtn.textContent = 'Play Again';
  } else if (state.wave === 0) {
    playBtn.disabled = false;
    playBtn.textContent = 'Play';
  } else if (state.wave >= CONFIG.maxWave) {
    playBtn.disabled = false;
    playBtn.textContent = 'Play Again';
  } else {
    playBtn.disabled = false;
    playBtn.textContent = `Wave ${state.wave + 1}`;
  }
}

function showOnly(panel) {
  for (const p of [ctxDefault, ctxCastle, ctxWall, ctxSlot]) p.hidden = (p !== panel);
}

function selectNone() {
  state.selected = { kind: 'none', slotIdx: -1 };
  showOnly(ctxDefault);
}

function selectCastle() {
  state.selected = { kind: 'castle', slotIdx: -1 };
  showOnly(ctxCastle);
  renderCastlePanel();
}

function selectWall() {
  state.selected = { kind: 'wall', slotIdx: -1 };
  showOnly(ctxWall);
  renderWallPanel();
}

function selectSlot(idx) {
  state.selected = { kind: 'slot', slotIdx: idx };
  showOnly(ctxSlot);
  renderSlotPanel();
}

function renderCastlePanel() {
  const info = document.getElementById('castle-info');
  const upgradeRow = document.getElementById('castle-upgrade-row');
  const trainBtns = document.getElementById('train-buttons');
  const trainStatus = document.getElementById('train-status');

  const lvl = state.castle.level;
  const cur = CONFIG.castle.levels[lvl];
  const next = CONFIG.castle.levels[lvl + 1];
  info.innerHTML =
    `<strong>Level ${lvl}</strong> · HP ${Math.max(0, Math.ceil(state.castle.hp))} / ${cur.hp}`;

  upgradeRow.innerHTML = '';
  if (next) {
    const b = document.createElement('button');
    b.textContent = `Upgrade to L${lvl + 1} (HP ${next.hp}) — ${next.cost}g`;
    b.disabled = state.gold < next.cost;
    b.onclick = () => upgradeCastle();
    upgradeRow.appendChild(b);
  } else {
    const span = document.createElement('div');
    span.className = 'muted small';
    span.textContent = 'Castle is at max level for Phase 1.';
    upgradeRow.appendChild(span);
  }

  // Training panel.
  trainBtns.innerHTML = '';
  for (const type of Object.keys(CONFIG.militia)) {
    const m = CONFIG.militia[type];
    const b = document.createElement('button');
    if (!state.unlocked[type]) {
      b.textContent = `Unlock ${m.label} — ${m.unlockCost}g`;
      b.disabled = state.gold < m.unlockCost;
      b.onclick = () => unlockMilitia(type);
    } else {
      const interval = m.attackInterval && m.attackInterval !== 1.0 ? `/${m.attackInterval}s` : '/s';
      b.textContent = `Train ${m.label} — ${m.cost}g · ${m.hp}HP · ${m.dmg}DMG${interval} · ${m.buildTime}s build`;
      b.disabled = state.gold < m.cost;
      b.onclick = () => queueMilitia(type);
    }
    trainBtns.appendChild(b);
  }
  updateTrainingStatusOnly();
}

function updateTrainingStatusOnly() {
  const trainStatus = document.getElementById('train-status');
  if (!trainStatus) return;
  if (state.currentTraining) {
    const t = state.currentTraining;
    const pct = Math.round((1 - t.timeLeft / t.total) * 100);
    const qd = state.trainingQueue.length ? ` (+${state.trainingQueue.length} queued)` : '';
    trainStatus.textContent = `Training ${CONFIG.militia[t.type].label}: ${pct}%${qd}`;
  } else {
    trainStatus.textContent = state.trainingQueue.length
      ? `${state.trainingQueue.length} in queue.`
      : 'No militia training.';
  }
}

function renderWallPanel() {
  const info = document.getElementById('wall-info');
  const row = document.getElementById('wall-upgrade-row');
  const lvl = state.wall.level;
  const cur = CONFIG.wall.levels[lvl];
  const next = CONFIG.wall.levels[lvl + 1];
  info.innerHTML = state.wall.broken
    ? `<strong>Destroyed</strong> — towers offline until next game.`
    : `<strong>Level ${lvl}</strong> · HP ${Math.max(0, Math.ceil(state.wall.hp))} / ${cur.hp}`;

  row.innerHTML = '';
  if (state.wall.broken) {
    const span = document.createElement('div');
    span.className = 'muted small';
    span.textContent = 'The wall cannot be repaired this game. (Repair comes in Phase 4.)';
    row.appendChild(span);
  } else if (next) {
    const b = document.createElement('button');
    b.textContent = `Upgrade to L${lvl + 1} (HP ${next.hp}) — ${next.cost}g`;
    b.disabled = state.gold < next.cost;
    b.onclick = () => upgradeWall();
    row.appendChild(b);
  } else {
    const span = document.createElement('div');
    span.className = 'muted small';
    span.textContent = 'Wall is at max level for Phase 1.';
    row.appendChild(span);
  }
}

function renderSlotPanel() {
  const info = document.getElementById('slot-info');
  const row = document.getElementById('slot-actions');
  const idx = state.selected.slotIdx;
  row.innerHTML = '';

  const tower = state.towers.find(t => t.slotIdx === idx);
  if (!tower) {
    info.innerHTML = `<strong>Slot ${idx + 1}</strong> — empty.`;
    const b = document.createElement('button');
    const cost = CONFIG.archerTower.placeCost;
    b.textContent = `Build Archer Tower — ${cost}g`;
    b.disabled = state.gold < cost;
    b.onclick = () => buildTower(idx);
    row.appendChild(b);
  } else {
    const lvl = tower.level;
    const cur = CONFIG.archerTower.levels[lvl];
    const next = CONFIG.archerTower.levels[lvl + 1];
    info.innerHTML =
      `<strong>Archer Tower L${lvl + 1}</strong> · ${cur.dmg} DMG · ${cur.fireRate}s rate · ${cur.range} range`;
    if (next) {
      const b = document.createElement('button');
      b.textContent = `Upgrade to L${lvl + 2} (${next.dmg} DMG, ${next.fireRate}s) — ${next.cost}g`;
      b.disabled = state.gold < next.cost;
      b.onclick = () => upgradeTower(idx);
      row.appendChild(b);
    } else {
      const span = document.createElement('div');
      span.className = 'muted small';
      span.textContent = 'Tower is at max level for Phase 1.';
      row.appendChild(span);
    }
  }
}

document.querySelectorAll('button.close').forEach(b => {
  b.addEventListener('click', () => selectNone());
});

playBtn.addEventListener('click', () => onPlay());

function onPlay() {
  if (state.waveActive) return;
  if (state.gameOver) {
    resetGame();
  }
  startWave();
}

// =====================================================================
// PLAYER ACTIONS
// =====================================================================

function spend(amount) {
  if (state.gold < amount) return false;
  state.gold -= amount;
  return true;
}

function earnGold(amount) {
  state.gold += amount;
  state.totalGoldEarned += amount;
}

function upgradeCastle() {
  const nextIdx = state.castle.level + 1;
  const next = CONFIG.castle.levels[nextIdx];
  if (!next || !spend(next.cost)) return;
  state.castle.level = nextIdx;
  const delta = next.hp - state.castle.maxHp;
  state.castle.maxHp = next.hp;
  state.castle.hp = Math.min(state.castle.maxHp, state.castle.hp + Math.max(0, delta));
  refreshUI();
}

function upgradeWall() {
  if (state.wall.broken) return;
  const nextIdx = state.wall.level + 1;
  const next = CONFIG.wall.levels[nextIdx];
  if (!next || !spend(next.cost)) return;
  state.wall.level = nextIdx;
  const delta = next.hp - state.wall.maxHp;
  state.wall.maxHp = next.hp;
  state.wall.hp = Math.min(state.wall.maxHp, state.wall.hp + Math.max(0, delta));
  refreshUI();
}

function buildTower(slotIdx) {
  if (state.towers.find(t => t.slotIdx === slotIdx)) return;
  if (!spend(CONFIG.archerTower.placeCost)) return;
  state.towers.push({ slotIdx, level: 0, cooldown: 0 });
  refreshUI();
}

function upgradeTower(slotIdx) {
  const t = state.towers.find(x => x.slotIdx === slotIdx);
  if (!t) return;
  const next = CONFIG.archerTower.levels[t.level + 1];
  if (!next || !spend(next.cost)) return;
  t.level += 1;
  refreshUI();
}

function unlockMilitia(type) {
  if (state.unlocked[type]) return;
  const m = CONFIG.militia[type];
  if (!spend(m.unlockCost)) return;
  state.unlocked[type] = true;
  refreshUI();
}

function queueMilitia(type) {
  if (!state.unlocked[type]) return;
  const m = CONFIG.militia[type];
  if (!spend(m.cost)) return;
  if (!state.currentTraining) {
    state.currentTraining = { type, timeLeft: m.buildTime, total: m.buildTime };
  } else {
    state.trainingQueue.push(type);
  }
  refreshUI();
}

function refreshUI() {
  updateHUD();
  const sel = state.selected.kind;
  if (sel === 'castle') renderCastlePanel();
  else if (sel === 'wall') renderWallPanel();
  else if (sel === 'slot') renderSlotPanel();
}

// =====================================================================
// CANVAS INPUT
// =====================================================================

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * W;
  const y = ((e.clientY - rect.top) / rect.height) * H;

  if (dist(x, y, CASTLE.x, CASTLE.y) <= CASTLE.r + 4) {
    selectCastle();
    return;
  }
  for (const s of SLOTS) {
    if (dist(x, y, s.x, s.y) <= s.radius + 4) {
      selectSlot(s.idx);
      return;
    }
  }
  // Wall/gate hit-test. Click the whole wall strip (sections + gate) to open
  // the wall panel — that's where gate HP and gate upgrades live.
  if (x >= WALL_BOARD_LEFT && x <= WALL_BOARD_RIGHT &&
      y >= WALL_Y - WALL_THICKNESS && y <= WALL_Y + WALL_THICKNESS) {
    selectWall();
    return;
  }
  selectNone();
});

// =====================================================================
// WAVES
// =====================================================================

function startWave() {
  if (state.gameOver || state.waveActive) return;
  if (state.wave >= CONFIG.maxWave) return;
  state.wave += 1;
  state.waveActive = true;
  state.waveCleared = false;

  const w = CONFIG.waves[state.wave - 1];
  const queue = [];
  // Interleave grunts/archers/catapults proportionally so the horde feels mixed.
  const counts = { grunt: w.grunts, archer: w.archers, catapult: w.catapults || 0 };
  const total = counts.grunt + counts.archer + counts.catapult;
  for (let i = 0; i < total; i++) {
    // Pick the type with the largest remaining count.
    let pick = 'grunt', best = -1;
    for (const k of ['grunt', 'archer', 'catapult']) {
      if (counts[k] > best) { best = counts[k]; pick = k; }
    }
    queue.push(pick);
    counts[pick] -= 1;
  }
  const bosses = w.bosses || 1;
  for (let i = 0; i < bosses; i++) queue.push({ boss: true });
  state.spawnQueue = queue;
  state.nextSpawnAt = 0.4;
  setStatus(`Wave ${state.wave} incoming — ${queue.length} units.`);
  refreshUI();
}

function spawnEnemy(kind) {
  const w = CONFIG.waves[state.wave - 1];
  // Spawn at PATH[0] with a tiny jitter so the horde isn't a perfect line.
  const x = PATH[0].x + (Math.random() - 0.5) * 24;
  const y = PATH[0].y + (Math.random() - 0.5) * 16;
  const base = {
    id: nextId(), x, y,
    pathIndex: 0,
    attackTimer: 0,
  };
  if (kind === 'boss') {
    const s = CONFIG.enemyStats.boss;
    state.enemies.push({ ...base, type: 'boss',
      hp: w.boss.hp, maxHp: w.boss.hp,
      dmg: w.boss.dmg, drop: w.boss.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      ranged: s.ranged, color: s.color, big: s.big,
    });
  } else if (kind === 'grunt') {
    const s = CONFIG.enemyStats.grunt;
    state.enemies.push({ ...base, type: 'grunt',
      hp: w.grunt.hp, maxHp: w.grunt.hp,
      dmg: w.grunt.dmg, drop: w.grunt.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      ranged: s.ranged, color: s.color,
    });
  } else if (kind === 'archer') {
    const s = CONFIG.enemyStats.archer;
    state.enemies.push({ ...base, type: 'archer',
      hp: w.archer.hp, maxHp: w.archer.hp,
      dmg: w.archer.dmg, drop: w.archer.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      ranged: s.ranged, color: s.color,
      projSpeed: s.projSpeed,
    });
  } else if (kind === 'catapult') {
    const s = CONFIG.enemyStats.catapult;
    state.enemies.push({ ...base, type: 'catapult',
      hp: w.catapult.hp, maxHp: w.catapult.hp,
      dmg: w.catapult.dmg, drop: w.catapult.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      ranged: s.ranged, color: s.color, big: s.big,
      projSpeed: s.projSpeed, projColor: s.projColor, projSize: s.projSize,
    });
  }
}

// =====================================================================
// SIM
// =====================================================================

function update(dt) {
  if (state.gameOver) return;

  // --- Training queue ---
  if (state.currentTraining) {
    state.currentTraining.timeLeft -= dt;
    if (state.currentTraining.timeLeft <= 0) {
      spawnMilitia(state.currentTraining.type);
      state.currentTraining = null;
      if (state.trainingQueue.length) {
        const t = state.trainingQueue.shift();
        const m = CONFIG.militia[t];
        state.currentTraining = { type: t, timeLeft: m.buildTime, total: m.buildTime };
      }
      refreshUI();
    } else if (state.selected.kind === 'castle') {
      updateTrainingStatusOnly();
    }
  }

  // --- Wave spawning ---
  if (state.waveActive && state.spawnQueue.length > 0) {
    state.nextSpawnAt -= dt;
    if (state.nextSpawnAt <= 0) {
      const next = state.spawnQueue.shift();
      if (typeof next === 'object' && next.boss) {
        spawnEnemy('boss');
        state.nextSpawnAt = CONFIG.spawnInterval;
      } else {
        spawnEnemy(next);
        state.nextSpawnAt = state.spawnQueue.length && state.spawnQueue[0].boss
          ? CONFIG.bossDelay
          : CONFIG.spawnInterval;
      }
    }
  }

  // --- Enemies ---
  for (const e of state.enemies) {
    updateEnemy(e, dt);
  }

  // --- Towers ---
  if (!state.wall.broken) {
    for (const t of state.towers) {
      updateTower(t, dt);
    }
  }

  // --- Militia ---
  for (const m of state.militia) {
    updateMilitiaMember(m, dt);
  }

  // --- Projectiles ---
  for (const p of state.projectiles) {
    updateProjectile(p, dt);
  }
  state.projectiles = state.projectiles.filter(p => !p.dead);

  // --- Cull dead enemies ---
  let killed = 0;
  state.enemies = state.enemies.filter(e => {
    if (e.hp <= 0) {
      earnGold(e.drop);
      killed++;
      return false;
    }
    return true;
  });

  // --- Cull dead militia ---
  state.militia = state.militia.filter(m => m.hp > 0);

  // --- Check wall break ---
  if (!state.wall.broken && state.wall.hp <= 0) {
    state.wall.hp = 0;
    state.wall.broken = true;
    setStatus(`The wall has been breached! Towers offline.`);
  }

  // --- Check castle / loss ---
  if (state.castle.hp <= 0) {
    state.castle.hp = 0;
    state.gameOver = true;
    state.win = false;
    state.waveActive = false;
    state.spawnQueue = [];
    showBanner(`Defeated on wave ${state.wave} — ${state.totalGoldEarned}g earned. Press Play to try again.`, 'loss');
    setStatus(`Run over. Press Play (top-left) to start fresh.`);
    refreshUI();
  }

  // --- Wave complete? ---
  if (state.waveActive && state.spawnQueue.length === 0 && state.enemies.length === 0) {
    state.waveActive = false;
    if (state.wave >= CONFIG.maxWave) {
      state.gameOver = true;
      state.win = true;
      showBanner(`Phase 1 cleared! ${state.totalGoldEarned}g earned. Press Play to play again.`, 'win');
      setStatus(`You survived all 5 waves. Press Play to start a fresh run.`);
    } else {
      setStatus(`Wave ${state.wave} cleared. Build up, then press Play for wave ${state.wave + 1}.`);
    }
    refreshUI();
  }

  if (killed > 0) refreshUI();
}

// Enemy AI:
//  - While not yet at the gate, follow the winding road waypoint by waypoint.
//    Towers can shoot the orcs while they walk, but the orcs never target
//    the towers — they ignore them entirely.
//  - At the gate, attack it. Once it falls, push past the gate to engage the
//    closest militia, then the castle.
function updateEnemy(e, dt) {
  // 1. Walk the road until reaching the gate.
  if (e.pathIndex < GATE_IDX) {
    const next = PATH[e.pathIndex + 1];
    const dx = next.x - e.x, dy = next.y - e.y;
    const d = Math.hypot(dx, dy);
    if (d <= 4) {
      e.pathIndex += 1;
    } else {
      e.x += (dx / d) * e.speed * dt;
      e.y += (dy / d) * e.speed * dt;
    }
    return;
  }

  // 2. At the gate (or past it).
  const obstacle = pickEnemyAttackTarget(e);
  if (!obstacle) return;
  const d = dist(e.x, e.y, obstacle.x, obstacle.y);
  if (d > obstacle.hitRadius + e.range) {
    const dx = obstacle.x - e.x, dy = obstacle.y - e.y;
    const len = Math.hypot(dx, dy) || 1;
    e.x += (dx / len) * e.speed * dt;
    e.y += (dy / len) * e.speed * dt;
  } else {
    e.attackTimer -= dt;
    if (e.attackTimer <= 0) {
      if (e.ranged) {
        fireEnemyArrow(e, obstacle);
      } else {
        applyDamageToObstacle(obstacle, e.dmg);
      }
      e.attackTimer = e.attackInterval;
    }
  }
}

function pickEnemyAttackTarget(e) {
  if (!state.wall.broken) {
    return { kind: 'wall', x: GATE.x, y: GATE.y, hitRadius: 8 };
  }
  // Gate is down: pick the closest militia, fall through to castle.
  let best = null, bestD = Infinity;
  for (const m of state.militia) {
    const d = dist(e.x, e.y, m.x, m.y);
    if (d < bestD) { bestD = d; best = m; }
  }
  if (best) return { kind: 'militia', target: best, x: best.x, y: best.y, hitRadius: 8 };
  return { kind: 'castle', x: CASTLE.x, y: CASTLE.y, hitRadius: CASTLE.r };
}

function fireEnemyArrow(e, obstacle) {
  const dx = obstacle.x - e.x, dy = obstacle.y - e.y;
  const len = Math.hypot(dx, dy) || 1;
  state.projectiles.push({
    x: e.x, y: e.y,
    vx: (dx / len) * e.projSpeed,
    vy: (dy / len) * e.projSpeed,
    dmg: e.dmg,
    targetKind: obstacle.kind,
    target: obstacle.target || null,
    fromEnemy: true,
    color: e.projColor || '#b9d36b',
    projSize: e.projSize || 2,
  });
}

function applyDamageToObstacle(obs, dmg) {
  if (obs.kind === 'wall') {
    if (!state.wall.broken) state.wall.hp -= dmg;
  } else if (obs.kind === 'militia') {
    obs.target.hp -= dmg;
  } else if (obs.kind === 'castle') {
    state.castle.hp -= dmg;
  }
}

function updateTower(t, dt) {
  const slot = SLOTS[t.slotIdx];
  const cfg = CONFIG.archerTower.levels[t.level];
  t.cooldown -= dt;
  if (t.cooldown > 0) return;

  // Find closest enemy in range.
  let best = null, bestD = Infinity;
  for (const e of state.enemies) {
    const d = dist(slot.x, slot.y, e.x, e.y);
    if (d <= cfg.range && d < bestD) { bestD = d; best = e; }
  }
  if (!best) return;

  // Fire arrow. L4 has 20% crit (2x damage) and pierce x2.
  const dx = best.x - slot.x, dy = best.y - slot.y;
  const len = Math.hypot(dx, dy) || 1;
  const speed = 380;
  const isCrit = cfg.crit > 0 && Math.random() < cfg.crit;
  state.projectiles.push({
    x: slot.x, y: slot.y - 4,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
    dmg: cfg.dmg * (isCrit ? 2 : 1),
    targetKind: 'enemy',
    target: best,
    fromEnemy: false,
    color: isCrit ? '#ffd86b' : '#f3e8d8',
    pierce: cfg.pierce || 1,
    hitIds: null, // lazily allocated on first hit when pierce > 1
  });
  t.cooldown = cfg.fireRate;
}

function spawnMilitia(type) {
  const m = CONFIG.militia[type];
  // Spawn around the castle in an arc facing the wall.
  const count = state.militia.length;
  const ringRadius = CASTLE.r + 18 + Math.floor(count / 8) * 14;
  const angle = -Math.PI / 2 + ((count % 8) - 3.5) * 0.38;
  const x = CASTLE.x + Math.cos(angle) * ringRadius;
  const y = CASTLE.y + Math.sin(angle) * ringRadius;
  state.militia.push({
    id: nextId(), type, x, y,
    hp: m.hp, maxHp: m.hp,
    dmg: m.dmg, range: m.range,
    ranged: m.ranged, projSpeed: m.projSpeed || 0,
    attackTimer: 0, attackInterval: m.attackInterval || 1.0,
    color: m.color,
    projColor: m.projColor || '#e6f0c4',
    projSize: m.projSize || 2,
    splash: m.splash || null,
  });
}

function updateMilitiaMember(m, dt) {
  // Militia engage anything past the wall line, in range.
  m.attackTimer -= dt;
  if (m.attackTimer > 0) return;

  let best = null, bestD = Infinity;
  for (const e of state.enemies) {
    // Militia only engage once the gate is down — before that the enemies are
    // bottled up north of the wall and untouchable from the courtyard.
    const engageable = state.wall.broken;
    if (!engageable) continue;
    const d = dist(m.x, m.y, e.x, e.y);
    if (d <= m.range && d < bestD) { bestD = d; best = e; }
  }
  if (!best) return;

  if (m.ranged) {
    const dx = best.x - m.x, dy = best.y - m.y;
    const len = Math.hypot(dx, dy) || 1;
    state.projectiles.push({
      x: m.x, y: m.y,
      vx: (dx / len) * m.projSpeed,
      vy: (dy / len) * m.projSpeed,
      dmg: m.dmg,
      targetKind: 'enemy',
      target: best,
      fromEnemy: false,
      color: m.projColor || '#e6f0c4',
      projSize: m.projSize || 2,
      splash: m.splash || null,
      pierce: 1,
      hitIds: null,
    });
  } else {
    best.hp -= m.dmg;
  }
  m.attackTimer = m.attackInterval;
}

function updateProjectile(p, dt) {
  p.x += p.vx * dt;
  p.y += p.vy * dt;

  if (p.fromEnemy) {
    if (p.targetKind === 'wall') {
      if (dist(p.x, p.y, GATE.x, GATE.y) <= 14) {
        if (!state.wall.broken) state.wall.hp -= p.dmg;
        p.dead = true;
      }
    } else if (p.targetKind === 'castle') {
      if (dist(p.x, p.y, CASTLE.x, CASTLE.y) <= CASTLE.r) {
        state.castle.hp -= p.dmg;
        p.dead = true;
      }
    } else if (p.targetKind === 'militia') {
      if (p.target && p.target.hp > 0) {
        if (dist(p.x, p.y, p.target.x, p.target.y) <= 10) {
          p.target.hp -= p.dmg;
          p.dead = true;
        }
      } else {
        p.dead = true;
      }
    }
  } else {
    // Tower / militia projectile vs enemy.
    // Splash projectiles (catapult militia): on reaching the target, damage the
    // target plus up to maxTargets-1 nearby enemies in radius.
    if (p.splash) {
      if (p.target && p.target.hp > 0) {
        if (dist(p.x, p.y, p.target.x, p.target.y) <= 8) {
          applySplash(p, p.target);
          p.dead = true;
        }
      } else {
        // Target died mid-flight: detonate at current location.
        applySplash(p, null);
        p.dead = true;
      }
    }
    // Piercing projectiles (Archer Tower L4): walk through up to `pierce` enemies.
    else if (p.pierce > 1) {
      if (!p.hitIds) p.hitIds = new Set();
      for (const e of state.enemies) {
        if (p.hitIds.has(e.id)) continue;
        if (e.hp <= 0) continue;
        if (dist(p.x, p.y, e.x, e.y) <= 8) {
          e.hp -= p.dmg;
          p.hitIds.add(e.id);
          p.pierce -= 1;
          if (p.pierce <= 0) { p.dead = true; break; }
        }
      }
    }
    // Standard single-target arrow.
    else if (p.target && p.target.hp > 0) {
      if (dist(p.x, p.y, p.target.x, p.target.y) <= 8) {
        p.target.hp -= p.dmg;
        p.dead = true;
      }
    } else {
      p.dead = true;
    }
  }

  if (p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) p.dead = true;
}

function applySplash(p, primary) {
  const cfg = p.splash;
  const cx = p.x, cy = p.y;
  // Sort enemies in range by distance; pick the closest maxTargets.
  const hits = [];
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    const d = dist(cx, cy, e.x, e.y);
    if (d <= cfg.radius) hits.push([d, e]);
  }
  hits.sort((a, b) => a[0] - b[0]);
  let applied = 0;
  for (const [, e] of hits) {
    if (applied >= cfg.maxTargets) break;
    e.hp -= p.dmg;
    applied += 1;
  }
}

// =====================================================================
// RENDER
// =====================================================================

function render() {
  ctx.clearRect(0, 0, W, H);

  // Field (grass) above the wall, courtyard below.
  ctx.fillStyle = '#3a4a30';
  ctx.fillRect(0, 0, W, WALL_Y - WALL_THICKNESS / 2);
  ctx.fillStyle = '#2f3a26';
  ctx.fillRect(0, WALL_Y + WALL_THICKNESS / 2, W, H - (WALL_Y + WALL_THICKNESS / 2));

  drawPath();
  drawWall();

  for (const s of SLOTS) drawSlot(s);
  drawCastle();
  for (const m of state.militia) drawMilitiaMember(m);
  for (const e of state.enemies) drawEnemy(e);
  for (const p of state.projectiles) drawProjectile(p);

  // Selection highlight.
  if (state.selected.kind === 'slot') {
    const s = SLOTS[state.selected.slotIdx];
    ctx.strokeStyle = '#f0b860';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius + 4, 0, Math.PI * 2);
    ctx.stroke();
  } else if (state.selected.kind === 'castle') {
    ctx.strokeStyle = '#f0b860';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CASTLE.x, CASTLE.y, CASTLE.r + 6, 0, Math.PI * 2);
    ctx.stroke();
  } else if (state.selected.kind === 'wall') {
    drawWallOutline();
  }
}

function tracePath() {
  ctx.beginPath();
  for (let i = 0; i < PATH.length; i++) {
    const p = PATH[i];
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
}

function drawPath() {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Dark dirt border so the white road reads cleanly against the grass.
  ctx.strokeStyle = '#3a2f24';
  ctx.lineWidth = 34;
  tracePath();
  ctx.stroke();
  // White road surface.
  ctx.strokeStyle = '#ece4d2';
  ctx.lineWidth = 28;
  tracePath();
  ctx.stroke();
  // Subtle centre dashes for road texture.
  ctx.setLineDash([6, 10]);
  ctx.strokeStyle = 'rgba(120, 105, 80, 0.5)';
  ctx.lineWidth = 1.5;
  tracePath();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawWall() {
  // Wall sections flanking the gate.
  ctx.fillStyle = '#e8e1d2';
  ctx.fillRect(WALL_BOARD_LEFT, WALL_Y - WALL_THICKNESS / 2,
               WALL_LEFT_END - WALL_BOARD_LEFT, WALL_THICKNESS);
  ctx.fillRect(WALL_RIGHT_END, WALL_Y - WALL_THICKNESS / 2,
               WALL_BOARD_RIGHT - WALL_RIGHT_END, WALL_THICKNESS);

  // Crenellations on top of each wall section.
  ctx.fillStyle = '#d6cdb8';
  for (let bx = WALL_BOARD_LEFT + 4; bx < WALL_LEFT_END - 8; bx += 18) {
    ctx.fillRect(bx, WALL_Y - WALL_THICKNESS / 2 - 6, 10, 6);
  }
  for (let bx = WALL_RIGHT_END + 4; bx < WALL_BOARD_RIGHT - 8; bx += 18) {
    ctx.fillRect(bx, WALL_Y - WALL_THICKNESS / 2 - 6, 10, 6);
  }

  // Gate posts (always present even when gate is destroyed).
  ctx.fillStyle = '#5a4636';
  ctx.fillRect(WALL_LEFT_END - 4, WALL_Y - WALL_THICKNESS / 2 - 8, 10, WALL_THICKNESS + 14);
  ctx.fillRect(WALL_RIGHT_END - 6, WALL_Y - WALL_THICKNESS / 2 - 8, 10, WALL_THICKNESS + 14);

  // Gate itself.
  if (!state.wall.broken) {
    ctx.fillStyle = '#5a3a1c';
    ctx.fillRect(WALL_LEFT_END + 4, WALL_Y - WALL_THICKNESS / 2 + 2,
                 WALL_RIGHT_END - WALL_LEFT_END - 8, WALL_THICKNESS - 4);
    // Gate plank lines.
    ctx.strokeStyle = '#3a2a1c';
    ctx.lineWidth = 1;
    for (let gx = WALL_LEFT_END + 12; gx < WALL_RIGHT_END - 4; gx += 10) {
      ctx.beginPath();
      ctx.moveTo(gx, WALL_Y - WALL_THICKNESS / 2 + 3);
      ctx.lineTo(gx, WALL_Y + WALL_THICKNESS / 2 - 3);
      ctx.stroke();
    }
    // Gate HP bar.
    const pct = state.wall.hp / state.wall.maxHp;
    const bw = 90;
    const bx = GATE.x - bw / 2;
    const by = WALL_Y - WALL_THICKNESS / 2 - 16;
    ctx.fillStyle = '#2a211b';
    ctx.fillRect(bx - 1, by - 1, bw + 2, 6);
    ctx.fillStyle = pct > 0.5 ? '#6fae54' : pct > 0.25 ? '#e0a14a' : '#c0432b';
    ctx.fillRect(bx, by, bw * pct, 4);
  } else {
    // Broken gate: scattered debris in the gap.
    ctx.fillStyle = '#7d6a4f';
    for (let i = 0; i < 10; i++) {
      const dx = WALL_LEFT_END + 6 + i * 7;
      const dy = WALL_Y + ((i % 3) - 1) * 4;
      ctx.fillRect(dx, dy, 5, 4);
    }
  }
}

function drawWallOutline() {
  ctx.strokeStyle = '#f0b860';
  ctx.lineWidth = 2;
  ctx.strokeRect(
    WALL_BOARD_LEFT - 2,
    WALL_Y - WALL_THICKNESS / 2 - 10,
    (WALL_BOARD_RIGHT - WALL_BOARD_LEFT) + 4,
    WALL_THICKNESS + 16,
  );
}

function drawSlot(s) {
  const tower = state.towers.find(t => t.slotIdx === s.idx);
  // Base ring.
  ctx.strokeStyle = tower ? '#8a6c4a' : '#b0987a';
  ctx.fillStyle = tower ? '#5a4636' : 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (tower) {
    const lvl = tower.level;
    // Body color shifts by level.
    const cols = ['#8a6c4a', '#a98259', '#c79866'];
    ctx.fillStyle = cols[lvl];
    ctx.fillRect(s.x - 7, s.y - 18, 14, 18);
    // Top
    ctx.fillStyle = '#3a2a1c';
    ctx.beginPath();
    ctx.moveTo(s.x - 9, s.y - 18);
    ctx.lineTo(s.x, s.y - 28);
    ctx.lineTo(s.x + 9, s.y - 18);
    ctx.closePath();
    ctx.fill();
    // Level pips
    ctx.fillStyle = '#f3e8d8';
    for (let i = 0; i <= lvl; i++) {
      ctx.fillRect(s.x - 6 + i * 5, s.y - 6, 3, 3);
    }
  } else {
    ctx.fillStyle = '#b0987a';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('+', s.x, s.y);
  }
}

function drawCastle() {
  const cx = CASTLE.x, cy = CASTLE.y, r = CASTLE.r;
  // Keep base.
  ctx.fillStyle = '#5a4636';
  ctx.fillRect(cx - r, cy - r * 0.6, r * 2, r * 1.5);
  // Towers
  ctx.fillStyle = '#6f5944';
  ctx.fillRect(cx - r - 6, cy - r, 14, r * 1.9);
  ctx.fillRect(cx + r - 8, cy - r, 14, r * 1.9);
  ctx.fillRect(cx - 6, cy - r - 10, 12, r * 0.8);
  // Battlements
  ctx.fillStyle = '#8a6c4a';
  for (let i = -1; i <= 1; i++) {
    ctx.fillRect(cx + i * 12 - 3, cy - r * 0.6 - 6, 8, 6);
  }
  // Flag
  ctx.strokeStyle = '#3a2a1c';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 10);
  ctx.lineTo(cx, cy - r - 22);
  ctx.stroke();
  ctx.fillStyle = '#c0432b';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r - 22);
  ctx.lineTo(cx + 10, cy - r - 19);
  ctx.lineTo(cx, cy - r - 16);
  ctx.closePath();
  ctx.fill();

  // Door
  ctx.fillStyle = '#3a2a1c';
  ctx.fillRect(cx - 6, cy + r * 0.2, 12, r * 0.7);

  // HP bar above
  const bw = r * 2;
  const bx = cx - r;
  const by = cy - r - 30;
  const pct = state.castle.hp / state.castle.maxHp;
  ctx.fillStyle = '#2a211b';
  ctx.fillRect(bx - 2, by - 2, bw + 4, 7);
  ctx.fillStyle = pct > 0.5 ? '#6fae54' : pct > 0.25 ? '#e0a14a' : '#c0432b';
  ctx.fillRect(bx, by, bw * pct, 3);
}

function drawMilitiaMember(m) {
  ctx.fillStyle = m.color;
  ctx.beginPath();
  ctx.arc(m.x, m.y, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1a1410';
  ctx.lineWidth = 1;
  ctx.stroke();
  // HP pip
  const pct = m.hp / m.maxHp;
  ctx.fillStyle = pct > 0.5 ? '#6fae54' : pct > 0.25 ? '#e0a14a' : '#c0432b';
  ctx.fillRect(m.x - 6, m.y - 11, 12 * pct, 2);
}

function drawEnemy(e) {
  ctx.fillStyle = e.color;
  const r = e.big ? 13 : 8;
  ctx.beginPath();
  ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1a1410';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Tusk marker
  ctx.fillStyle = '#f3e8d8';
  ctx.fillRect(e.x - 2, e.y + r * 0.2, 4, 2);
  // HP bar (skip on huge waves to save fillRect calls — bosses always shown).
  if (state.enemies.length < 400 || e.big) {
    const pct = e.hp / e.maxHp;
    ctx.fillStyle = '#2a211b';
    ctx.fillRect(e.x - r, e.y - r - 6, r * 2, 3);
    ctx.fillStyle = pct > 0.5 ? '#6fae54' : pct > 0.25 ? '#e0a14a' : '#c0432b';
    ctx.fillRect(e.x - r, e.y - r - 6, r * 2 * pct, 3);
  }
  if (e.type === 'archer') {
    ctx.strokeStyle = '#3a2a1c';
    ctx.beginPath();
    ctx.moveTo(e.x - 6, e.y - 2);
    ctx.lineTo(e.x + 6, e.y - 2);
    ctx.stroke();
  } else if (e.type === 'catapult') {
    // Bucket on top
    ctx.fillStyle = '#3a2a1c';
    ctx.fillRect(e.x - 7, e.y - r - 2, 14, 5);
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(e.x - 4, e.y - r - 1, 8, 3);
  }
}

function drawProjectile(p) {
  // Splash boulders, fireballs, and other "big" projectiles render as filled circles.
  if (p.projSize && p.projSize >= 3) {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.projSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1a1410';
    ctx.lineWidth = 1;
    ctx.stroke();
    return;
  }
  // Default: arrow trail.
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  const len = 8;
  const v = Math.hypot(p.vx, p.vy) || 1;
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x - (p.vx / v) * len, p.y - (p.vy / v) * len);
  ctx.stroke();
}

// =====================================================================
// RESET
// =====================================================================

function resetGame() {
  // Wipe gold and upgrades; this is Phase 1 — TP persistence comes in Phase 5.
  state.gold = CONFIG.startGold;
  state.wave = 0;
  state.waveActive = false;
  state.waveCleared = false;
  state.spawnQueue = [];
  state.nextSpawnAt = 0;
  state.castle = { hp: CONFIG.castle.levels[0].hp, maxHp: CONFIG.castle.levels[0].hp, level: 0 };
  state.wall   = { hp: CONFIG.wall.levels[0].hp,   maxHp: CONFIG.wall.levels[0].hp,   level: 0, broken: false };
  state.towers = [{ slotIdx: 2, level: 0, cooldown: 0 }];
  state.militia = [];
  state.trainingQueue = [];
  state.currentTraining = null;
  state.unlocked = { soldier: false, archer: false, knight: false, mountedKnight: false, crossbowman: false, mage: false, catapult: false, hero: false };
  state.enemies = [];
  state.projectiles = [];
  state.gameOver = false;
  state.win = false;
  state.totalGoldEarned = 0;
  hideBanner();
  selectNone();
  setStatus('Build your defenses, then press Play.');
  refreshUI();
}

// =====================================================================
// MAIN LOOP
// =====================================================================

function loop(now) {
  if (!state.lastTime) state.lastTime = now;
  let dt = (now - state.lastTime) / 1000;
  state.lastTime = now;
  if (dt > 0.1) dt = 0.1; // clamp big pauses (tab switch)
  if (!state.gameOver) update(dt);
  render();
  requestAnimationFrame(loop);
}

setStatus('Build your defenses, then press Play.');
refreshUI();
requestAnimationFrame(loop);
