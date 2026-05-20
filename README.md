[Play OMG the Horde →](https://nors3ai.github.io/OMG-the-HORDE/horde)

# OMG the Horde

An incremental tower-defense game. Orcs march at your castle in waves;
a curved medieval wall stands between them and the keep, with six slots
for towers along the top. When the wall falls, the towers go silent and
the orcs sprint for the castle — militia trained at the castle are your
last line of defense.

Earned gold converts to **Technology Points** that survive death:
100 g = 1 TP, then 1 TP per 500 g. Spend TP before the next run to
unlock new towers, militia tiers (base → Epic → Legendary → Void),
wall and castle armor, and other infrastructure.

## Status

The game is being built in [phases](docs/PHASES.md). **Phase 1 —
Foundations** is playable today:

- Castle, Wall, and Archer Tower — each with two upgrades
- Three militia types: Soldier, Archer, Knight
- Orc Grunts, Orc Archers, and an Orc Boss
- Waves 1 through 5

## How to play

1. Open <https://nors3ai.github.io/OMG-the-HORDE/horde>.
2. **Click an empty tower slot** on the wall to build / upgrade an
   Archer Tower (base placement is free in Phase 1).
3. **Click the wall** to upgrade it. **Click the castle** to upgrade it
   and to train militia. One militia trains at a time; queue more by
   clicking again.
4. Press **Start Wave** in the sidebar. Orcs spawn from the top and
   march south. Towers fire automatically.
5. Survive all 5 waves to clear Phase 1. If the castle falls, gold and
   upgrades reset for a new run.

## Running locally

No build step. Serve the `docs/` folder with any static file server:

```sh
cd docs
python3 -m http.server 8000
# then open http://localhost:8000/horde/
```

## Hosting

GitHub Pages is served from `main` / `docs`. The playable build lives at
<https://nors3ai.github.io/OMG-the-HORDE/horde>.
