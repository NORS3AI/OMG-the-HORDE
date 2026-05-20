// OMG the Horde — Phase 1 (Foundations)
// All numbers below come from the design doc. Future phases extend CONFIG;
// they should not rewrite Phase 1 values.

// =====================================================================
// CONFIG
// =====================================================================

const CONFIG = {
  startGold: 200,
  maxWave: 5,

  // Castle: base + 2 upgrades.
  castle: {
    levels: [
      { hp: 20,  cost: 0  },
      { hp: 45,  cost: 25 },
      { hp: 80,  cost: 50 },
    ],
  },

  // Wall: single HP pool, base + 2 upgrades. At 0 HP all towers cease fire.
  wall: {
    levels: [
      { hp: 20, cost: 0  },
      { hp: 35, cost: 25 },
      { hp: 55, cost: 50 },
    ],
  },

  // Archer Tower: base (free) + 2 upgrades.
  archerTower: {
    placeCost: 0,
    levels: [
      { dmg: 2, fireRate: 1.0, range: 170, cost: 0  },
      { dmg: 4, fireRate: 1.2, range: 185, cost: 10 },
      { dmg: 7, fireRate: 1.5, range: 205, cost: 20 },
    ],
  },

  // Militia: only one trains at a time, globally.
  militia: {
    soldier: {
      label: 'Soldier',
      unlockCost: 1,  cost: 5,  buildTime: 3,
      hp: 5,  dmg: 1, range: 28,  speed: 0,
      ranged: false, color: '#9ec3d9',
    },
    archer: {
      label: 'Archer',
      unlockCost: 5,  cost: 7,  buildTime: 3,
      hp: 7,  dmg: 3, range: 200, speed: 0,
      ranged: true,  projSpeed: 320, color: '#cdd99e',
    },
    knight: {
      label: 'Knight',
      unlockCost: 15, cost: 10, buildTime: 4,
      hp: 10, dmg: 5, range: 34,  speed: 0,
      ranged: false, color: '#d9b69e',
    },
  },

  // Per-wave enemy stats from the doc.
  waves: [
    { // Wave 1: 5 Grunts then 1 Boss
      grunts: 5, archers: 0,
      grunt:  { hp: 5,  dmg: 2, drop: 1 },
      archer: { hp: 12, dmg: 5, drop: 3 },
      boss:   { hp: 10, dmg: 4, drop: 5 },
    },
    { // Wave 2: 10 Grunts then 1 Boss
      grunts: 10, archers: 0,
      grunt:  { hp: 10, dmg: 4, drop: 2 },
      archer: { hp: 12, dmg: 5, drop: 3 },
      boss:   { hp: 20, dmg: 6, drop: 10 },
    },
    { // Wave 3: 10 Grunts + 5 Archers then 1 Boss
      grunts: 10, archers: 5,
      grunt:  { hp: 10, dmg: 4, drop: 3 },
      archer: { hp: 12, dmg: 5, drop: 3 },
      boss:   { hp: 30, dmg: 8, drop: 15 },
    },
    { // Wave 4: 10 Grunts + 10 Archers then 1 Boss
      grunts: 10, archers: 10,
      grunt:  { hp: 12, dmg: 5, drop: 4 },
      archer: { hp: 14, dmg: 6, drop: 4 },
      boss:   { hp: 40, dmg: 10, drop: 20 },
    },
    { // Wave 5: 15 Grunts + 15 Archers then 1 Boss
      grunts: 15, archers: 15,
      grunt:  { hp: 14, dmg: 6, drop: 5 },
      archer: { hp: 16, dmg: 7, drop: 5 },
      boss:   { hp: 50, dmg: 12, drop: 25 },
    },
  ],

  // Enemy movement/combat (per-wave HP/DMG/drop override the wave-agnostic bits).
  enemyStats: {
    grunt:  { speed: 28, range: 18, attackInterval: 1.0, ranged: false, color: '#7aa657' },
    archer: { speed: 22, range: 230, attackInterval: 1.4, ranged: true, projSpeed: 260, color: '#a4c45d', stopRange: 140 },
    boss:   { speed: 22, range: 24, attackInterval: 1.0, ranged: false, color: '#3d6b1f', big: true },
  },

  spawnInterval: 1.4, // seconds between enemy spawns in a wave
  bossDelay: 2.0,     // extra delay before the boss spawns
};

// =====================================================================
// GEOMETRY
// =====================================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

const WALL_LEFT = 70;
const WALL_RIGHT = 830;
const WALL_BASE_Y = 380;
const WALL_PEAK_Y = 320;

function wallY(x) {
  const t = Math.max(0, Math.min(1, (x - WALL_LEFT) / (WALL_RIGHT - WALL_LEFT)));
  return WALL_BASE_Y - (WALL_BASE_Y - WALL_PEAK_Y) * 4 * t * (1 - t);
}

const SLOTS = [];
for (let i = 0; i < 6; i++) {
  const t = (i + 0.5) / 6;
  const x = WALL_LEFT + t * (WALL_RIGHT - WALL_LEFT);
  SLOTS.push({ idx: i, x, y: wallY(x) - 4, radius: 16 });
}

const CASTLE = { x: 450, y: 478, r: 34 };

function dist(ax, ay, bx, by) {
  const dx = ax - bx, dy = ay - by;
  return Math.hypot(dx, dy);
}

// Returns the wall y at a given x (for the wall barrier line).
function wallBarrierY(x) { return wallY(x) + 6; }

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
  unlocked: { soldier: false, archer: false, knight: false },

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
const waveBtn   = document.getElementById('start-wave');
const waveHelp  = document.getElementById('wave-help');

const ctxDefault = document.getElementById('ctx-default');
const ctxCastle  = document.getElementById('ctx-castle');
const ctxWall    = document.getElementById('ctx-wall');
const ctxSlot    = document.getElementById('ctx-slot');

const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayBody  = document.getElementById('overlay-body');
const overlayBtn   = document.getElementById('overlay-button');

function setStatus(msg) { status.textContent = msg; }

function updateHUD() {
  hudGold.textContent = `Gold: ${state.gold}`;
  hudWave.textContent = `Wave: ${state.wave} / ${CONFIG.maxWave}`;
  hudWall.textContent = `Wall: ${state.wall.broken ? 'destroyed' : Math.max(0, Math.ceil(state.wall.hp)) + ' / ' + state.wall.maxHp}`;
  hudCastle.textContent = `Castle: ${Math.max(0, Math.ceil(state.castle.hp))} / ${state.castle.maxHp}`;

  if (state.gameOver) {
    waveBtn.disabled = true;
    waveBtn.textContent = state.win ? 'Phase 1 Cleared' : 'Defeated';
  } else if (state.waveActive) {
    waveBtn.disabled = true;
    waveBtn.textContent = `Wave ${state.wave} in progress…`;
  } else {
    waveBtn.disabled = false;
    waveBtn.textContent = `Start Wave ${state.wave + 1}`;
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
  for (const type of ['soldier', 'archer', 'knight']) {
    const m = CONFIG.militia[type];
    const b = document.createElement('button');
    if (!state.unlocked[type]) {
      b.textContent = `Unlock ${m.label} — ${m.unlockCost}g`;
      b.disabled = state.gold < m.unlockCost;
      b.onclick = () => unlockMilitia(type);
    } else {
      b.textContent = `Train ${m.label} — ${m.cost}g (${m.buildTime}s, ${m.hp}HP, ${m.dmg}DMG/s)`;
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

waveBtn.addEventListener('click', () => startWave());
overlayBtn.addEventListener('click', () => resetGame());

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
  // Crude wall hit-test: between WALL_LEFT and WALL_RIGHT, within +/-10 of the curve.
  if (x >= WALL_LEFT && x <= WALL_RIGHT) {
    const wy = wallY(x);
    if (Math.abs(y - wy) <= 14) {
      selectWall();
      return;
    }
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
  // Mix grunts and archers alternating.
  const total = w.grunts + w.archers;
  let g = w.grunts, a = w.archers;
  for (let i = 0; i < total; i++) {
    if (g > 0 && (a === 0 || (i % 2 === 0))) { queue.push('grunt'); g--; }
    else if (a > 0) { queue.push('archer'); a--; }
    else { queue.push('grunt'); g--; }
  }
  queue.push({ boss: true });
  state.spawnQueue = queue;
  state.nextSpawnAt = 0.8;
  setStatus(`Wave ${state.wave} incoming!`);
  refreshUI();
}

function spawnEnemy(kind) {
  const w = CONFIG.waves[state.wave - 1];
  const x = 80 + Math.random() * (W - 160);
  const y = -20;
  if (kind === 'boss') {
    const s = CONFIG.enemyStats.boss;
    state.enemies.push({
      id: nextId(), type: 'boss', x, y,
      hp: w.boss.hp, maxHp: w.boss.hp,
      dmg: w.boss.dmg, drop: w.boss.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      attackTimer: 0, ranged: s.ranged, color: s.color, big: s.big,
    });
  } else if (kind === 'grunt') {
    const s = CONFIG.enemyStats.grunt;
    state.enemies.push({
      id: nextId(), type: 'grunt', x, y,
      hp: w.grunt.hp, maxHp: w.grunt.hp,
      dmg: w.grunt.dmg, drop: w.grunt.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      attackTimer: 0, ranged: s.ranged, color: s.color,
    });
  } else if (kind === 'archer') {
    const s = CONFIG.enemyStats.archer;
    state.enemies.push({
      id: nextId(), type: 'archer', x, y,
      hp: w.archer.hp, maxHp: w.archer.hp,
      dmg: w.archer.dmg, drop: w.archer.drop,
      speed: s.speed, range: s.range, attackInterval: s.attackInterval,
      attackTimer: 0, ranged: s.ranged, color: s.color,
      projSpeed: s.projSpeed, stopRange: s.stopRange,
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
    showOverlay('Defeated', `Your castle fell on wave ${state.wave}. Gold earned this run: ${state.totalGoldEarned}g.`);
  }

  // --- Wave complete? ---
  if (state.waveActive && state.spawnQueue.length === 0 && state.enemies.length === 0) {
    state.waveActive = false;
    if (state.wave >= CONFIG.maxWave) {
      state.gameOver = true;
      state.win = true;
      showOverlay('Phase 1 Cleared!', `You survived all 5 waves. Gold earned: ${state.totalGoldEarned}g.`);
    } else {
      setStatus(`Wave ${state.wave} cleared. Build up, then start the next.`);
    }
  }

  if (killed > 0) refreshUI();
}

// Enemy AI:
//  - Move toward the wall y (or, if wall broken, toward the castle).
//  - Grunts/Bosses melee attack the wall when in melee range, then the
//    militia or castle if the wall is gone.
//  - Archers stop at stopRange from the wall (or castle when broken) and
//    fire arrows. Arrows target the wall, then militia, then castle.
function updateEnemy(e, dt) {
  const targetY = state.wall.broken ? CASTLE.y : wallBarrierY(e.x);
  const goingTo = state.wall.broken ? 'castle' : 'wall';

  // For archers: stop and fire when within stopRange of the target line.
  if (e.type === 'archer') {
    const distanceToLine = Math.max(0, targetY - e.y);
    if (distanceToLine > e.stopRange) {
      e.y += e.speed * dt;
    }
    e.attackTimer -= dt;
    if (e.attackTimer <= 0) {
      const target = pickEnemyArrowTarget(e, goingTo);
      if (target) {
        fireEnemyArrow(e, target);
        e.attackTimer = e.attackInterval;
      } else {
        e.attackTimer = 0.3;
      }
    }
    return;
  }

  // Grunts and bosses: walk to the next obstacle, melee it.
  const obstacle = pickEnemyMeleeTarget(e, goingTo);
  if (!obstacle) {
    e.y += e.speed * dt;
    return;
  }
  const d = dist(e.x, e.y, obstacle.x, obstacle.y);
  if (d > obstacle.hitRadius + e.range) {
    // Move toward obstacle.
    const dx = obstacle.x - e.x, dy = obstacle.y - e.y;
    const len = Math.hypot(dx, dy) || 1;
    e.x += (dx / len) * e.speed * dt;
    e.y += (dy / len) * e.speed * dt;
  } else {
    e.attackTimer -= dt;
    if (e.attackTimer <= 0) {
      applyDamageToObstacle(obstacle, e.dmg);
      e.attackTimer = e.attackInterval;
    }
  }
}

function pickEnemyMeleeTarget(e, goingTo) {
  if (goingTo === 'wall') {
    return { kind: 'wall', x: e.x, y: wallBarrierY(e.x), hitRadius: 6 };
  }
  // Wall is broken: militia first, then castle.
  let best = null, bestD = Infinity;
  for (const m of state.militia) {
    const d = dist(e.x, e.y, m.x, m.y);
    if (d < bestD) { bestD = d; best = m; }
  }
  if (best) return { kind: 'militia', target: best, x: best.x, y: best.y, hitRadius: 8 };
  return { kind: 'castle', x: CASTLE.x, y: CASTLE.y, hitRadius: CASTLE.r };
}

function pickEnemyArrowTarget(e, goingTo) {
  if (goingTo === 'wall') return { kind: 'wall', x: e.x, y: wallBarrierY(e.x) };
  if (state.militia.length) {
    // Random militia for visual variety.
    const m = state.militia[Math.floor(Math.random() * state.militia.length)];
    return { kind: 'militia', target: m, x: m.x, y: m.y };
  }
  return { kind: 'castle', x: CASTLE.x, y: CASTLE.y };
}

function fireEnemyArrow(e, target) {
  const dx = target.x - e.x, dy = target.y - e.y;
  const len = Math.hypot(dx, dy) || 1;
  state.projectiles.push({
    x: e.x, y: e.y,
    vx: (dx / len) * e.projSpeed,
    vy: (dy / len) * e.projSpeed,
    dmg: e.dmg,
    targetKind: target.kind,
    target: target.target || null,
    fromEnemy: true,
    color: '#b9d36b',
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

  // Fire arrow.
  const dx = best.x - slot.x, dy = best.y - slot.y;
  const len = Math.hypot(dx, dy) || 1;
  const speed = 380;
  state.projectiles.push({
    x: slot.x, y: slot.y - 4,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
    dmg: cfg.dmg,
    targetKind: 'enemy',
    target: best,
    fromEnemy: false,
    color: '#f3e8d8',
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
    attackTimer: 0, attackInterval: 1.0,
    color: m.color,
  });
}

function updateMilitiaMember(m, dt) {
  // Militia engage anything past the wall line, in range.
  m.attackTimer -= dt;
  if (m.attackTimer > 0) return;

  let best = null, bestD = Infinity;
  for (const e of state.enemies) {
    const engageable = state.wall.broken || e.y >= wallBarrierY(e.x) - 2;
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
      color: '#e6f0c4',
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
      const wy = wallBarrierY(p.x);
      if (p.y >= wy) {
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
    // Tower / militia arrow targeting an enemy.
    if (p.target && p.target.hp > 0) {
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

// =====================================================================
// RENDER
// =====================================================================

function render() {
  ctx.clearRect(0, 0, W, H);

  // Spawn / approach area (grass)
  ctx.fillStyle = '#3a4a30';
  ctx.fillRect(0, 0, W, 300);

  // Dirt strip in front of wall (orc approach)
  const g = ctx.createLinearGradient(0, 280, 0, 380);
  g.addColorStop(0, '#3a4a30');
  g.addColorStop(1, '#5a432e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 280, W, 100);

  // Courtyard behind wall
  ctx.fillStyle = '#2f3a26';
  ctx.fillRect(0, 380, W, H - 380);

  // Wall (curved)
  drawWall();

  // Tower slots and towers
  for (const s of SLOTS) drawSlot(s);

  // Castle
  drawCastle();

  // Militia
  for (const m of state.militia) drawMilitiaMember(m);

  // Enemies
  for (const e of state.enemies) drawEnemy(e);

  // Projectiles
  for (const p of state.projectiles) drawProjectile(p);

  // Selection highlight
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

function drawWall() {
  if (state.wall.broken) {
    // Broken: scattered rubble.
    ctx.fillStyle = '#7d6a4f';
    for (let i = 0; i < 40; i++) {
      const x = WALL_LEFT + (i / 40) * (WALL_RIGHT - WALL_LEFT) + (Math.sin(i * 11.3) * 10);
      const y = wallY(x) + (Math.sin(i * 7.7) * 4);
      ctx.fillRect(x - 6, y, 8, 6);
    }
    return;
  }
  // Curved white wall.
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#e8e1d2';
  ctx.beginPath();
  for (let x = WALL_LEFT; x <= WALL_RIGHT; x += 4) {
    const y = wallY(x);
    if (x === WALL_LEFT) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Battlement crenellations
  ctx.fillStyle = '#e8e1d2';
  for (let x = WALL_LEFT; x <= WALL_RIGHT; x += 24) {
    const y = wallY(x);
    ctx.fillRect(x - 4, y - 14, 8, 6);
  }

  // Wall HP bar
  const pct = state.wall.hp / state.wall.maxHp;
  const bw = (WALL_RIGHT - WALL_LEFT) * 0.6;
  const bx = (W - bw) / 2;
  const by = 412;
  ctx.fillStyle = '#2a211b';
  ctx.fillRect(bx - 2, by - 2, bw + 4, 8);
  ctx.fillStyle = pct > 0.5 ? '#6fae54' : pct > 0.25 ? '#e0a14a' : '#c0432b';
  ctx.fillRect(bx, by, bw * pct, 4);
}

function drawWallOutline() {
  ctx.strokeStyle = '#f0b860';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = WALL_LEFT; x <= WALL_RIGHT; x += 4) {
    const y = wallY(x) - 10;
    if (x === WALL_LEFT) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  for (let x = WALL_RIGHT; x >= WALL_LEFT; x -= 4) {
    const y = wallY(x) + 6;
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
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
  // HP bar
  const pct = e.hp / e.maxHp;
  ctx.fillStyle = '#2a211b';
  ctx.fillRect(e.x - r, e.y - r - 6, r * 2, 3);
  ctx.fillStyle = pct > 0.5 ? '#6fae54' : pct > 0.25 ? '#e0a14a' : '#c0432b';
  ctx.fillRect(e.x - r, e.y - r - 6, r * 2 * pct, 3);
  if (e.type === 'archer') {
    ctx.strokeStyle = '#3a2a1c';
    ctx.beginPath();
    ctx.moveTo(e.x - 6, e.y - 2);
    ctx.lineTo(e.x + 6, e.y - 2);
    ctx.stroke();
  }
}

function drawProjectile(p) {
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
// OVERLAY (win / lose)
// =====================================================================

function showOverlay(title, body) {
  overlayTitle.textContent = title;
  overlayBody.textContent = body;
  overlay.hidden = false;
  refreshUI();
}

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
  state.unlocked = { soldier: false, archer: false, knight: false };
  state.enemies = [];
  state.projectiles = [];
  state.gameOver = false;
  state.win = false;
  state.totalGoldEarned = 0;
  overlay.hidden = true;
  selectNone();
  setStatus('New game ready. Build your defenses, then press Start Wave 1.');
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

setStatus('Build your defenses, then press Start Wave 1.');
refreshUI();
requestAnimationFrame(loop);
