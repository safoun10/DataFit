# DataFit - User Guide

How to use every calculator on the DataFit site. All results are **estimates** - not medical advice.

**Live site:** https://datafit-iota.vercel.app

## Getting Started

1. Open the site in your browser
2. Read the hero section, then click **START TRACKING** or scroll down
3. Use the **dot navigation** on the right (or bottom bar on mobile) to jump between modules
4. Toggle **METRIC | IMPERIAL** in the footer anytime

Your inputs are saved automatically in your browser. Clearing site data will reset them.

---

## Module 01 - BMI (Body Mass Index)

**What it measures:** Whether your weight is proportionate to your height.

**How to use:**

1. Enter your height and weight
2. Read your BMI number and category (Underweight → Obese)
3. Check **BMI Prime** (BMI ÷ 25) and **Healthy Range** for your height

**Tip:** BMI doesn't distinguish muscle from fat. Athletes with high muscle mass may show "Overweight" despite being lean.

---

## Module 02 - BMR (Basal Metabolic Rate)

**What it measures:** Calories your body burns at complete rest in 24 hours.

**How to use:**

1. Select sex, enter age, height, and weight
2. Choose formula: **Mifflin-St Jeor** (default, most accurate for general use) or **Harris-Benedict**
3. Result shows kcal/day - this feeds into TDEE automatically

**Tip:** Values sync to other modules. Fill this in early for the best TDEE experience.

---

## Module 03 - TDEE (Total Daily Energy Expenditure)

**What it measures:** Total calories burned per day including activity.

**How to use:**

1. Set your **Activity Level** in the central **PROFILE** section.
2. Complete Module 02 (BMR) by filling out the remaining profile details.
3. Read **Maintenance** calories, plus suggested **Cut (−500)** and **Bulk (+300)** targets.

**Activity levels (set globally in PROFILE):**
| Level | Description |
|-------|-------------|
| Sedentary | Desk job, little exercise |
| Light | 1–3 workouts per week |
| Moderate | 3–5 workouts per week |
| Active | 6–7 workouts per week |
| Very Active | Hard daily training + physical job |

---


## Module 05 - IBW (Ideal Body Weight)

**What it measures:** Estimated healthy weight for your height.

**How to use:**

1. Select sex and enter height
2. Choose formula: **Devine** (default), Robinson, Miller, or Hamwi
3. View ideal weight and ±10% range

**Note:** These formulas were designed for drug dosing and general reference - individual ideal weight varies.

---

## Module 06 - Body Fat % (US Navy Method)

**What it measures:** Body fat percentage from circumference measurements.

**How to use:**

1. Select sex, enter height
2. Measure **neck** at the narrowest point (below larynx)
3. Measure **waist** at navel level (men) or narrowest point (women)
4. Women: also measure **hip** at widest point
5. Result shows body fat % and category

**Tip:** Measure in the morning, relaxed, tape snug but not compressing skin. This result auto-syncs to FFMI, BFMI, and Lean Mass modules.

---

## Module 07 - FFMI (Fat-Free Mass Index)

**What it measures:** Muscularity relative to height (like BMI but for lean mass).

**How to use:**

1. Enter height, weight, and body fat % (auto-filled if Module 06 is done)
2. Read FFMI and **Normalized FFMI** (height-adjusted)
3. Categories run from Below Average to Elite

**Reference:** Normalized FFMI above ~25 is rare naturally (Berkhan ceiling).

---

## Module 08 - BFMI (Body Fat Mass Index)

**What it measures:** Fat mass relative to height - companion to FFMI.

**How to use:**

1. Enter sex, height, weight, body fat %
2. Read BFMI and healthy range (M: 2–7, F: 3–9)

---

## Module 09 - Lean Body Mass

**What it measures:** Everything in your body that isn't fat.

**How to use:**

1. Enter weight and body fat %
2. See lean mass and fat mass breakdown

---

## Module 10 - Protein Target

**What it measures:** Recommended daily protein intake in grams.

**How to use:**

1. Enter weight (automatically pre-filled from your central PROFILE if entered).
2. Set your goal (Cut / Maintain / Bulk).
3. Read the recommended range in g/day (your activity level is automatically read from the central PROFILE).

**General guidance:** Most active people benefit from 1.6–2.2 g/kg, higher when cutting.

---


## Module 10 - Maximum Muscular Potential

**What it measures:** Realistic natural lean mass ceiling for your frame.

**How to use:**

1. Enter height
2. For **Casey Butt:** also enter wrist and ankle circumference (bone structure)
3. For **Berkhan:** height-only estimate using FFMI ceiling of 25
4. Set target body fat % (default 10%) to see max total body weight

**Note:** Timeline estimate is rough - genetics, training, and nutrition vary widely.

---

## Metric vs Imperial

| Measurement   | Metric | Imperial |
| ------------- | ------ | -------- |
| Height        | cm     | ft + in  |
| Weight        | kg     | lb       |
| Circumference | cm     | in       |

Toggle in the footer. All internal math uses metric; display converts automatically.

---

## Clearing Your Data

To reset saved profile and unit preference:

1. Open browser DevTools → Application → Local Storage
2. Delete keys `datafit_profile` and `datafit_unit_mode`

Or clear site data for this domain in browser settings.

---

## Disclaimer

DataFit provides fitness **estimates** for educational purposes. Results depend on formula limitations, measurement accuracy, and individual variation. Consult a doctor, registered dietitian, or certified trainer for personalized health, nutrition, or training advice.

---

## Questions?

See [FORMULAS.md](FORMULAS.md) for the math behind each module, [SITE.md](SITE.md) for technical details about the interface, or [TEST_CASES.md](TEST_CASES.md) for robustness and failure mode details.
