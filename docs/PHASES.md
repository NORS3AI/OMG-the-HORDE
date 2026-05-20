# OMG the Horde — Phase Plan

The full design document is large, so we are breaking implementation into
self-contained phases. Each phase is a playable slice that adds onto the
last. Numbers below are pulled from the design doc; cross-reference the
doc for full text.

---

## Phase 1 — Foundations (PLAYABLE)

Status: **playable build under `docs/horde/`.**

The minimum viable horde defense: one map, one resource (gold), one
tower type, base militia, waves 1–5.

- **Castle** — base + 2 upgrades (20 / 45 / 80 HP, 0 / 25 / 50 g).
- **Wall** — base + 2 upgrades (20 / 35 / 55 HP, 0 / 25 / 50 g). One HP
  pool; when it hits 0 the wall is breached and all towers cease fire.
- **Archer Tower** — base + 2 upgrades (2 / 4 / 7 DMG; 1.0 / 1.2 / 1.5s
  fire rate). Player starts with one free tower placed; 5 more wall
  slots are buildable for 0 g.
- **Militia** (one trains at a time, global queue):
  - Soldier — unlock 1 g · 5 g / unit · 3 s · 5 HP · 1 DMG/s · melee
  - Archer — unlock 5 g · 7 g / unit · 3 s · 7 HP · 3 DMG/s · ranged
  - Knight — unlock 15 g · 10 g / unit · 4 s · 10 HP · 5 DMG/s · melee
- **Enemies** — Orc Grunt, Orc Archer (wave 3+), Orc Boss (last in wave).
- **Waves 1–5** — exact spawn counts and stats from the design doc.
- Lose if the Castle reaches 0 HP. Win Phase 1 by surviving Wave 5.

Hosted at <https://nors3ai.github.io/OMG-the-HORDE/horde>.

---

## Phase 2 — Wave & Militia Depth

- **Walls** — levels 3–10 (80 → 300 HP).
- **Castle** — levels 3–10 (125 → 600 HP).
- **Archer Tower** — Level 4 (12 DMG, 2s, pierce x2, 20% crit).
- **Extended militia** — Mounted Knight, Crossbowman, Mage, Catapult, Hero.
- **Waves 6–10** — adds Orc Catapult (30 HP, 10 DMG, 2s load).

## Phase 3 — Tower Roster

- **Cannon** (unlock 125 g) — 4 tiers, splash damage.
- **Sniper's Nest** (unlock 200 g) — 4 tiers, high single-target.
- **Tesla Coil** (unlock 300 g) — 4 tiers, chain-lightning + slow.
- **Slingshot** (free) — 4 tiers, multi-hit crowd control.
- **Frost Tower** (unlock 150 g) — 4 tiers, slow + freeze chance.
- **Poison Dart** (unlock 40 g) — 4 tiers, DoT.
- **Flamethrower** (unlock 200 g) — 4 tiers, continuous DoT + burn linger.
- **Waves 11–15** — adds Orc Magi (25 HP, 12 DMG ice bolts).

## Phase 4 — Repair, Armored, & Ogres

- **Heal Wall / Heal Castle** buttons (gold tier + 5 TP tiers each).
- **Manned Castle** (3 TP) — castle fires over wall / in front of castle.
- **Armored Wall** (5 TP) and **Armored Castle** (5 TP), 10 levels each.
- **Waves 16–20** — adds Ogres (50 HP, 20 DMG, scaling).

## Phase 5 — Technology Points & Epic Militia

- **TP economy**: 100 g earned = 1 TP, then +1 TP per 500 g earned. Loss
  wipes gold and upgrades, but TP persists.
- **Pre-game TP spend screen** (Play button top-left).
- **Unspent-TP gold bonus**: +10% gold earned per accumulated TP.
- **Epic Militia** (replaces base tier when unlocked): Epic Soldier
  through Epic Hero, costs in TP from the doc.

## Phase 6 — Advanced Towers

- **Gravity Well** (unlock 700 g) — pulls + anchors enemies.
- **Stun Pylon** (unlock 1,200 g) — AoE DMG + stun.
- **Acid Sprayer** (unlock 370 g) — DMG + armor shred.
- **Mine Layer** (unlock 1,000 g) — placed mines, splash.
- **Buff Tower** (1 TP) — DMG / range / fire-rate aura.
- **Gold Mine** (2 TP) — passive gold/sec.
- **Radar** (4 TP) — reveal stealth, range/crit aura.
- **Repair Drone** (10 TP) — heals adjacent towers, wall, castle.

## Phase 7 — Specialists & Flyers

- **Anti-Air** (25 TP) — flying-only DMG.
- **Bunker** (50 TP) — blockers.
- **Artillery** (150 TP) — global range, heavy splash.
- **Boss Hunter** (300 TP) — anti-boss specialist.
- **Waves 20+** — adds Undead Vultures (flying; bypass wall, attack
  militia → castle).

## Phase 8 — Legendary Militia

Eight legendary unit tiers, replacing Epic militia on unlock
(5–50 TP per unit).

## Phase 9 — Void Militia

Eight void unit tiers, replacing Legendary militia on unlock
(75–3,000 TP per unit). Endgame tier.

## Phase 10 — Polish

Persistent save (TP and unlocks across runs), art, sound, balancing,
boss-wave pacing, accessibility.

---

## Conventions

- All Phase 1 numbers live in `docs/horde/game.js` under `CONFIG`.
  Future phases extend that block — they do not rewrite Phase 1.
- A phase is "done" when it is playable end-to-end in the hosted build.
- If the design doc changes, this file is the source of truth for
  scope; the doc is the source of truth for numbers.
