# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**OMG the Horde** — an incremental tower-defense game where the player
defends a castle from waves of orcs. A curved white medieval wall holds
six tower slots; the wall blocks orcs until its HP runs out, at which
point all towers cease fire and orcs run for the castle. Militia trained
at the castle (one at a time) stand around it as a second line of
defense. Earned gold (cumulative, not spent) converts to Technology
Points (100 g = 1 TP, then 1 TP per 500 g); TP persists across runs and
is spent pre-game to unlock new towers, militia tiers (base → Epic →
Legendary → Void), wall/castle upgrades, and special infrastructure.
A castle loss wipes gold and upgrades but never TP.

The design document is broken into phases in
[`docs/PHASES.md`](docs/PHASES.md). Phase 1 (Foundations) is the
currently playable slice.

## Repository layout

- `README.md` — public-facing entry point. Links to the hosted build at `/horde`.
- `docs/` — GitHub Pages source (served from `main` / `docs`). The playable site lives here.
  - `docs/horde/` — the playable build (HTML5 Canvas + vanilla JS, no build step).
  - `docs/PHASES.md` — phase-by-phase scope plan derived from the design doc.
- `CLAUDE.md` — this file.

## Hosting

- GitHub Pages: **source = `main` branch, folder = `/docs`**.
- Public URL: <https://nors3ai.github.io/OMG-the-HORDE/horde>
- Any content intended to be served on the site must live under `docs/`.

## Conventions

- Default branch is `main`.
- Keep the top-of-README `/horde` link intact — it is the public entry point.
- Don't add tooling, CI, or framework scaffolding speculatively. Wait for the game design doc or an explicit request.
- Don't commit build artifacts unless they are required by GitHub Pages (in which case they belong in `docs/`).

## Working on the game

- All Phase 1 numbers live in `docs/horde/game.js` under `CONFIG`.
  Future phases extend that block; they should not rewrite Phase 1 values.
- `docs/PHASES.md` is the scope source of truth — work that lives outside
  Phase 1 should not be added to Phase 1 unless the maintainer explicitly
  asks. The design doc is the source of truth for numbers.
- Tech stack is intentionally minimal: HTML5 Canvas + vanilla JS, served
  statically from `docs/`. Don't add bundlers, frameworks, or CI without
  asking first.
