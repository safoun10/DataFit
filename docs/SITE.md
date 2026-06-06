# DataFit - Site Overview

This document describes everything on the DataFit single-page site: brand identity, visual design, navigation, modules, and shared behavior.

**Live site:** https://datafit-iota.vercel.app

## Brand & Aesthetic

DataFit presents fitness data through a **dark, terminal-inspired interface** - inspired by high-performance athletic dashboards and cyberpunk minimalism.

### Color Palette

| Token            | Hex       | Role                           |
| ---------------- | --------- | ------------------------------ |
| Deep background  | `#050805` | Page base                      |
| Neon accent      | `#CCFF00` | Titles, results, active states |
| Muted green-gray | `#5a6b5a` | Labels, grid, secondary text   |

### Typography

- **Display:** Bebas Neue - hero title, section headings, result numbers
- **Mono:** JetBrains Mono - inputs, labels, status bar, formulas
- **Body:** Inter - taglines, modal copy

### Visual Elements

- Subtle CSS grid overlay (40px spacing)
- Scanline texture at low opacity
- Neon glow on hero title and primary results (`text-shadow`)
- Ghost buttons with thin neon borders
- Collapsible `// FORMULA` panels per module

## Page Structure

The site is one HTML page with **11 full-viewport sections** (hero + 10 calculator modules).

```
Hero → BMI → BMR → TDEE → IBW → Body Fat → FFMI → BFMI → Lean Mass → Protein → Max Potential
```

Each calculator section follows the same layout:

1. Module label (`MODULE_XX · CODE`)
2. Large glowing title
3. Subtitle (full name)
4. Input panel with `// INPUTS` header
5. Live result display
6. Optional extras row (secondary metrics)
7. Collapsible formula reference

## Navigation

### Dot Rail (Desktop / Tablet)

Fixed vertical dots on the right edge. Active dot glows neon green. Click any dot to smooth-scroll to that section.

### Bottom Bar (Mobile)

On screens under 768px, dots move to a horizontal bar above the footer for thumb reach.

### Keyboard

- **Arrow Down / Arrow Up** - move between sections while focused on the page

### Scroll Snap

CSS `scroll-snap-type: y mandatory` keeps each section aligned to the viewport when scrolling.

## Status Bar (Footer)

Fixed bar at the bottom of every view:

| Left                  | Right                     |
| --------------------- | ------------------------- |
| `OPERATOR: [safoun_]` | Unit toggle + info button |

The operator line is your identity marker - replace `[safoun_]` in `index.html`.

## Global Features

### Unit Toggle

One switch in the footer converts all height, weight, and circumference inputs/results between **metric** and **imperial**. Preference persists in `localStorage`.

- Metric: cm, kg
- Imperial: ft/in, lb, in

### Operator Profile

Shared inputs (sex, age, height, weight, activity level, body fat %, circumferences) sync across modules via `localStorage` key `datafit_profile`. When you enter measurements in the central PROFILE section, all calculators update instantly. The profile and unit preferences are persisted in session memory using `localStorage` and restored automatically upon refresh.

Body fat % from Module 06 auto-populates FFMI, BFMI, and Lean Mass when available.

### Live Compute

No submit buttons. Results update on every valid input change - matching the hero tagline **"0ms LATENCY"**.

Invalid values show a subtle red border glow; empty fields show `-` rather than zero.

### Info Modal

The `(i)` button in the footer opens a disclaimer modal: local-only processing, estimates not medical advice.

## Module Summary

| Module        | ID             | Key Inputs                        | Primary Output         |
| ------------- | -------------- | --------------------------------- | ---------------------- |
| Hero          | `hero`         | -                                 | Landing + CTA          |
| BMI           | `bmi`          | Height, weight                    | BMI + category         |
| BMR           | `bmr`          | Sex, age, height, weight, formula | kcal/day               |
| TDEE          | `tdee`         | Read from Profile                  | Maintenance + cut/bulk |
| IBW           | `ibw`          | Sex, height, formula              | Ideal weight           |
| Body Fat      | `bodyfat`      | Sex, height, neck, waist, hip     | Body fat %             |
| FFMI          | `ffmi`         | Height, weight, body fat %        | FFMI + normalized      |
| BFMI          | `bfmi`         | Sex, height, weight, body fat %   | BFMI                   |
| Lean Mass     | `leanmass`     | Weight, body fat %                | LBM + fat mass         |
| Protein       | `protein`      | Weight, goal (Activity from Profile)| g/day range           |
| Max Potential | `maxpotential` | Height, wrist, ankle, formula     | Max lean mass          |

## Accessibility

- Semantic HTML sections with headings
- Focus-visible outlines on interactive elements
- ARIA labels on dot navigation and modal
- `prefers-reduced-motion` disables glow animations and smooth scroll
- `prefers-contrast: more` increases muted text and border visibility
- Touch targets ≥ 44px on coarse pointers (mobile)

## Browser Support

Tested targets: Chrome, Firefox, Safari, Edge (current versions). Requires ES module support.

**Live site:** https://datafit-iota.vercel.app


## Screenshots

_Screenshot placeholders - add captures of hero, BMI module, and mobile layout after deployment._

## Related Docs

- [USER_GUIDE.md](USER_GUIDE.md) - how to use each calculator
- [FORMULAS.md](FORMULAS.md) - equation reference
- [PLAN.md](PLAN.md) - development architecture
- [TEST_CASES.md](TEST_CASES.md) - failure modes and robustness guide
