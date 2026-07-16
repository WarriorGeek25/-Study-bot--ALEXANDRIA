# ALEXANDRIA

> The library of the future. A cyberpunk study companion — front screen.

ALEXANDRIA is a cyberpunk-styled study companion. This repository currently
contains the **front screen** (landing page) for the website at
**[www.alexandria.com](https://www.alexandria.com)**.

## Stack

- Static front-end (HTML + CSS + a sprinkle of vanilla JS)
- [Vite](https://vitejs.dev/) dev server for local development

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

## Front screen

The landing page (`index.html`) presents:

- A boot-console ticker and animated terminal pane
- A neon "THE LIBRARY OF THE FUTURE" hero with glitch typography
- Core-system cards (Neural Archive, Recall Engine, Study Protocol)
- A three-step protocol and a closed-alpha access request form

All wrapped in a cyberpunk aesthetic: void-black background, animated neon
grid, scanlines, cyan/magenta glow, and Orbitron / Share Tech Mono type.

## Status

`v0.1.0` — front screen only. Subsequent tasks will wire up the archive,
recall engine, and authenticated uplink.