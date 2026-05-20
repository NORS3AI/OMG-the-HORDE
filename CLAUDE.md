# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**OMG the Horde** — a game project. The full design document will be added by the maintainer; until then, prefer asking before inventing mechanics, lore, or scope.

## Repository layout

- `README.md` — public-facing entry point. Links to the hosted build at `/horde`.
- `docs/` — GitHub Pages source (served from `main` / `docs`). The playable site lives here.
- `CLAUDE.md` — this file.

Additional source folders will be added once the game's tech stack is chosen.

## Hosting

- GitHub Pages: **source = `main` branch, folder = `/docs`**.
- Public URL: <https://nors3ai.github.io/OMG-the-HORDE/horde>
- Any content intended to be served on the site must live under `docs/`.

## Conventions

- Default branch is `main`.
- Keep the top-of-README `/horde` link intact — it is the public entry point.
- Don't add tooling, CI, or framework scaffolding speculatively. Wait for the game design doc or an explicit request.
- Don't commit build artifacts unless they are required by GitHub Pages (in which case they belong in `docs/`).

## When the design doc arrives

The maintainer will drop the OMG the Horde design document into the repo. When that happens:

1. Read it end-to-end before making changes.
2. Update this file's **Project** section with a one-paragraph summary.
3. Update `README.md` with a player-facing summary and a short "how to run" section.
4. Only then propose a tech stack / scaffolding, and confirm with the maintainer before generating code.
