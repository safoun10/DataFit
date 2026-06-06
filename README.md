# DataFit - Body Data

A single-page fitness calculator suite with a dark, terminal-inspired aesthetic. Ten performance calculators - BMI, BMR, TDEE, IBW, body fat %, FFMI, BFMI, lean mass, protein, and maximum muscular potential - all in one scrollable interface with live results.

**Priority:** aesthetics → responsiveness → functionality → formula depth.

## Quick Start

No build step required. Open the site locally:

1. Clone or download this folder
2. Open [`index.html`](index.html) in any modern browser
    - or serve it locally: `npx serve .` / `python -m http.server`
3. Scroll through modules or use the dot navigation on the right
4. Toggle **METRIC | IMPERIAL** in the footer status bar

All calculations run in your browser. Use the new PROFILE section (first module) to enter height, weight, age, sex and activity level once — all calculators update instantly. Profile inputs and last session values (BMR/TDEE) are saved to `localStorage` so data persists after refresh. Nothing is sent to a server.

## Documentation

| Document                                 | Description                              |
| ---------------------------------------- | ---------------------------------------- |
| [docs/SITE.md](docs/SITE.md)             | What's on the site - modules, design, UX |
| [docs/PLAN.md](docs/PLAN.md)             | Architecture and development plan        |
| [docs/USER_GUIDE.md](docs/USER_GUIDE.md) | End-user guide for every calculator      |
| [docs/FORMULAS.md](docs/FORMULAS.md)     | Scientific formula reference             |

## Tech Stack

- HTML5, CSS3, vanilla JavaScript (ES modules)
- Google Fonts: Bebas Neue, JetBrains Mono, Inter
- No frameworks, no build tools, no dependencies

## Project Structure

```
DataFit/
├── index.html          # Single-page app
├── css/                # Design system & layout
├── js/
│   ├── main.js         # Navigation, unit toggle, init
│   ├── units.js        # Metric ↔ imperial
│   ├── profile.js      # Shared operator profile
│   ├── ui.js           # Input binding, results
│   └── calculators/    # One module per calculator
└── docs/               # Documentation
```

## Modules

| #   | Module        | Description                                              |
| --- | ------------- | -------------------------------------------------------- |
| 01  | BMI           | Body Mass Index + WHO category                           |
| 02  | BMR           | Basal metabolic rate (Mifflin-St Jeor / Harris-Benedict) |
| 03  | TDEE          | Total daily energy expenditure                           |
| 04  | IBW           | Ideal body weight (4 formulas)                           |
| 05  | Body Fat      | US Navy circumference method                             |
| 06  | FFMI          | Fat-free mass index + normalized FFMI                    |
| 07  | BFMI          | Body fat mass index                                      |
| 08  | Lean Mass     | Lean body mass & fat mass split                          |
| 09  | Protein       | Daily protein target by goal                             |
| 10  | Max Potential | Casey Butt / Berkhan muscular ceiling                    |

## Customization

- **safoun\_:** Edit the footer in `index.html` - replace `OPERATOR: [safoun_]` with safoun\_
- **Unit default:** Stored in `localStorage` key `datafit_unit_mode`

## Disclaimer

All outputs are estimates for informational and educational purposes. They are not medical advice. Consult a qualified professional for health, nutrition, or training decisions.

## Author

Built by **[safoun_]** - replace the placeholder in the footer and this line when publishing.

## License

MIT - use freely, attribution appreciated.
