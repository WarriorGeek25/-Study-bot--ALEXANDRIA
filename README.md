# ALEXANDRIA

> The library of the future. A cyberpunk study companion.

ALEXANDRIA is a cyberpunk-styled study companion. This repository contains the
**website** at **[www.alexandria.com](https://www.alexandria.com)** — a single
front-end that combines the cyberpunk landing experience with a configurable
uplink and a client-side identity subsystem.

It is built from two complementary subsystems, combined into one site:

1. **Front screen** — the boot console, neon hero, core-system cards and
   protocol that establish the ALEXANDRIA world.
2. **Identity & uplink** — a cascading region / country / exam-board
   configuration console plus a register / login / profile flow with
   changeable profile pictures.

The two are wired together: the uplink config you lock in is surfaced inside
your signed-in profile, so the site reads as one product rather than two
disconnected screens.

## Stack

- Static front-end (HTML + CSS + vanilla ES modules)
- [Vite](https://vitejs.dev/) dev server for local development
- `localStorage`-backed demo auth + config (no backend required)

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build / preview

```bash
npm run build    # outputs to dist/
npm run preview  # serves the production build
```

## The website

`index.html` is a single page composed of four sections:

### Hero / front screen
- A boot-console ticker and animated terminal pane
- A neon "THE LIBRARY OF THE FUTURE" hero with glitch typography
- Core-system cards (Neural Archive, Recall Engine, Study Protocol)
- A three-step protocol (Connect → Ingest → Recall)

### Configure uplink (`#configure`)
- A cascading selector: **region → country → exam board**
- Source-of-truth registry in `src/examData.js` (Asia, Africa, Europe,
  North America, South America, Oceania)
- The locked config is persisted to `localStorage` and re-shown on reload

### Identity (`#identity`)
- Tabbed **register / login** forms (`src/auth.js`)
- Signed-in **profile view** with handle, email and avatar
- Changeable profile picture (JPEG/PNG/WEBP/GIF, max 2 MB, auto-downscaled
  to 512px) and renameable handle
- Sessions and users persisted to `localStorage`

All wrapped in a cyberpunk aesthetic: void-black background, animated neon
grid, scanlines, cyan/magenta glow, and Orbitron / Share Tech Mono type.

## Project layout

```
index.html            # the single-page website (all four sections)
src/styles.css        # cyberpunk theme + component styles
src/main.js           # boot console, configure cascade, identity wiring
src/examData.js       # region / country / exam-board registry
src/auth.js           # register / login / logout / avatar / handle
public/favicon.svg    # brand mark
```

## Status

`v0.2.0` — combined website: front screen + configurable uplink + identity.
The archive, recall engine and a real authenticated backend are still ahead.