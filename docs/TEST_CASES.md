# DataFit - Failure Modes & Test Cases (Robustness Guide)

This document maps out potential failure points, edge cases, and unexpected behaviors in the DataFit application, along with how the system handles or guards against them.

**Live site:** https://datafit-iota.vercel.app

---

## 1. Input Validation & Out-of-Bounds Values

### Scenario: User enters extreme or nonsensical numbers

- **Test Case:** Age = `1000` years, Weight = `-50` kg, Height = `10` cm.
- **What could go wrong:** Formulas produce negative, zero, infinite, or physically impossible results (e.g., negative BMR or infinite FFMI).
- **Robustness Mechanism:**
    - Natively validated input fields with `min`, `max`, and `step` properties in HTML.
    - Custom input binder `bindInput` in `js/ui.js` adds `is-invalid` CSS class when constraints are violated, giving a subtle red neon glow.
    - Calculators parse and clamp input numbers before running the math (e.g., Mifflin-St Jeor and Harris-Benedict formulas expect valid bounds, body fat calculations validate that the resulting percentage sits within `[2%, 60%]`).

---

## 2. Incomplete State & Partially Filled Forms

### Scenario: The user has filled out height but not weight

- **Test Case:** User enters height `175 cm` in the profile, but leaves weight and age blank.
- **What could go wrong:** Calculators try to compute equations with `NaN` or `null`, resulting in displays showing `NaN` or zero.
- **Robustness Mechanism:**
    - All calculator modules explicitly validate existence of required variables before running math.
    - If any prerequisite is missing (e.g., age, weight, or height), the calculator returns early and calls `renderResult` with a value of `-` and clean labels.

---

## 3. Unit Toggle & Rounding Accumulation

### Scenario: Repeated switching between Metric and Imperial

- **Test Case:** User switches between METRIC and IMPERIAL unit modes 50 times in a row.
- **What could go wrong:** Inaccurate conversions and repeated floating-point calculations cause input drift (e.g., a height of `175 cm` converting to feet/inches and then back to `174.8 cm`, gradually losing precision).
- **Robustness Mechanism:**
    - **Single Source of Truth**: The central profile state `datafit_profile` ALWAYS stores values internally in **Metric** (cm, kg, cm) regardless of display unit.
    - Conversions are strictly performed at the presentation layer when displaying outputs or rendering input values.
    - Display functions use precise conversions (e.g., `cm / 2.54` for inches and `kg * 2.20462` for lbs) and format to 1 or 2 decimal places to maintain precision.

---

## 4. LocalStorage Corruption & Empty Cache

### Scenario: Browser storage gets cleared or corrupted

- **Test Case:** LocalStorage is cleared, or `datafit_profile` contains malformed/corrupted JSON text (e.g., manually edited by developer).
- **What could go wrong:** JSON parsing throws a syntax error, causing the entire initialization script (`main.js` and `DOMContentLoaded`) to crash and leave the page completely dead.
- **Robustness Mechanism:**
    - `loadProfile` in `js/profile.js` is wrapped in a `try...catch` block.
    - If `localStorage` holds corrupted text, the loader catches the exception, silently ignores it, and instantiates the application with clean, default fallback states.

---

## 5. Infinite Event Loops & Cyclic Recomputations

### Scenario: Inter-dependent calculators trigger each other recursively

- **Test Case:** A change in the central profile triggers `recomputeAll()`. One of the calculators (e.g., Body Fat) computes a value and saves it to the profile, which dispatches `profilechange`, which calls `recomputeAll()` again.
- **What could go wrong:** The browser enters an infinite recursive loop, freezing the UI and eventually throwing a `RangeError: Maximum call stack size exceeded` crash.
- **Robustness Mechanism:**
    - **Change Guarding**: Profile save methods (`saveProfile` and `saveProfileField` in `js/profile.js`) check whether the new value is identical to the currently stored value before updating or dispatching events.
    - If the value has not changed, the update is ignored and the event is blocked. This completely breaks any potential loop cycles.

---

## 6. Missing or Renamed DOM Elements

### Scenario: Developer modifies index.html and removes or renames inputs

- **Test Case:** A developer removes the `sex` segment control or deletes an input field from `index.html`.
- **What could go wrong:** Native JS selectors (`document.querySelector`) return `null`. Trying to read `.value` or register listeners on `null` throws a `TypeError`, crashing the script execution.
- **Robustness Mechanism:**
    - UI binding functions (`bindInput`, `bindSelect`, `bindSegment` in `js/ui.js`) check for existence first (`if (!input) return;`).
    - Container-level helpers (`getSegmentValue` and `setSegmentValue` in `js/ui.js`) guard against null parameters, returning empty fallbacks or returning early without attempting query operations.
