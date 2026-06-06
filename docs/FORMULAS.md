# DataFit - Formula Reference

Scientific equations used by each calculator module. All internal calculations use **metric units** (kg, cm, m).

**Live site:** https://datafit-iota.vercel.app

---

## BMI - Body Mass Index

```
BMI = weight (kg) / height (m)²
BMI Prime = BMI / 25
```

**WHO Categories:**
| BMI | Category |
|-----|----------|
| < 18.5 | Underweight |
| 18.5 – 24.9 | Normal |
| 25 – 29.9 | Overweight |
| ≥ 30 | Obese |

**Healthy weight range:**

```
min = 18.5 x height(m)²
max = 24.9 x height(m)²
```

---

## BMR - Basal Metabolic Rate

### Mifflin-St Jeor (1990) - Default

```
Men:   BMR = (10 x weight_kg) + (6.25 x height_cm) − (5 x age) + 5
Women: BMR = (10 x weight_kg) + (6.25 x height_cm) − (5 x age) − 161
```

_Source: Mifflin MD, St Jeor ST, et al. Am J Clin Nutr. 1990;51(2):241-247._

### Harris-Benedict (Revised)

```
Men:   BMR = 88.362 + (13.397 x weight_kg) + (4.799 x height_cm) − (5.677 x age)
Women: BMR = 447.593 + (9.247 x weight_kg) + (3.098 x height_cm) − (4.330 x age)
```

_Note: Original 1919 equations; revised versions used here._

---

## TDEE - Total Daily Energy Expenditure

```
TDEE = BMR x Activity Multiplier
```

| Activity Level | Multiplier |
| -------------- | ---------- |
| Sedentary      | 1.2        |
| Light          | 1.375      |
| Moderate       | 1.55       |
| Active         | 1.725      |
| Very Active    | 1.9        |

**Presets:**

```
Cut  = TDEE − 500 kcal
Bulk = TDEE + 300 kcal
```

---

## IBW - Ideal Body Weight

All formulas use height in **inches** internally; results converted to kg.

### Devine (1974) - Default

```
Men:   IBW (kg) = 50 + 2.3 x (height_in − 60)    [x 0.453592 if from lb formula]
Women: IBW (kg) = 45.5 + 2.3 x (height_in − 60)
```

_Source: Devine BJ. Drug Intell Clin Pharm. 1974;8:650-655._

### Robinson (1983)

```
Men:   52 + 1.9 x (height_in − 60)
Women: 49 + 1.7 x (height_in − 60)
```

### Miller (1983)

```
Men:   56.2 + 1.41 x (height_in − 60)
Women: 53.1 + 1.36 x (height_in − 60)
```

### Hamwi (1964)

```
Men:   48 + 2.7 x (height_in − 60)
Women: 45.5 + 2.2 x (height_in − 60)
```

**Healthy range:** IBW ± 10%

---

## Body Fat % - US Navy Method

Uses height, neck, waist (and hip for women) in **inches**.

### Men

```
BF% = 86.010 x log₁₀(waist − neck) − 70.041 x log₁₀(height) + 36.760
```

### Women

```
BF% = 163.205 x log₁₀(waist + hip − neck) − 97.684 x log₁₀(height) − 78.387
```

_Source: Hodgdon JA, Beckett MB. Navy Body Fat Estimation. US Navy, 1984._

**Limitations:** Less accurate for very lean or obese individuals; measurement technique matters significantly.

---

## FFMI - Fat-Free Mass Index

```
Lean Mass (kg) = weight x (1 − BF%/100)
FFMI = Lean Mass / height(m)²
```

### Normalized FFMI (height adjustment)

```
Normalized FFMI = FFMI + 6.1 x (1.8 − height_m)
```

_Adjusts for taller/shorter individuals. Source: Kouri EM, et al. Clin J Sport Med. 1995._

**Interpretation (normalized):**
| FFMI | Category |
|------|----------|
| < 18 | Below average |
| 18 – 20 | Average |
| 20 – 22 | Above average |
| 22 – 23 | Excellent |
| 23 – 26 | Superior |
| > 26 | Elite / likely enhanced |

---

## BFMI - Body Fat Mass Index

```
Fat Mass (kg) = weight x (BF%/100)
BFMI = Fat Mass / height(m)²
```

**Healthy ranges:**

- Men: 2 – 7
- Women: 3 – 9

_Source: Schutz Y, et al. Int J Obes. 2002._

---

## Lean Body Mass

```
LBM = weight x (1 − BF%/100)
Fat Mass = weight − LBM
```

---

## Protein Target

```
Protein (g/day) = weight_kg x [g/kg range based on goal + activity]
```

| Activity    | Maintain (g/kg) | Cut (g/kg) | Bulk (g/kg) |
| ----------- | --------------- | ---------- | ----------- |
| Sedentary   | 0.8 – 1.0       | 1.6 – 2.0  | 1.6 – 2.2   |
| Light       | 1.0 – 1.2       | 1.8 – 2.2  | 1.8 – 2.4   |
| Moderate    | 1.2 – 1.4       | 2.0 – 2.4  | 2.0 – 2.6   |
| Active      | 1.4 – 1.6       | 2.2 – 2.6  | 2.2 – 2.8   |
| Very Active | 1.6 – 1.8       | 2.4 – 2.8  | 2.4 – 3.0   |

_Based on ISSN and general sports nutrition literature (1.4–2.0 g/kg for active individuals)._

---


## Maximum Muscular Potential

### Casey Butt Formula

Uses height, wrist, and ankle circumferences (inches) to estimate structural lean mass limit:

```
Max LBM (kg) = height_in^1.5 x (√wrist_in/22.667 + √ankle_in/17.0104)
               x ( √(height_in/70) x 0.525 + 0.45 ) x 0.453592
```

_Source: Butt C. Your Muscular Potential. beyondbulk.com._

### Berkhan Simplified (FFMI Ceiling)

```
Max LBM (kg) = 25 x height(m)²
```

Assumes normalized FFMI ceiling of **25** for natural lifters.

_Source: Berkhan M. leangains.com muscular potential articles._

### Max Body Weight at Target BF%

```
Max Weight = Max LBM / (1 − target_BF%/100)
```

---

## Unit Conversions

```
kg → lb:  x 2.20462
cm → in:  ÷ 2.54
in → cm:  x 2.54
ft/in → cm: (feet x 12 + inches) x 2.54
```

---

## General Limitations

1. **Population formulas** - derived from group averages; individual metabolism varies ±10–15%
2. **Circumference methods** - sensitive to measurement technique and hydration
3. **FFMI normalization** - debated in literature; use as rough guide
4. **Muscular potential** - genetic outliers exist; timelines are illustrative only

For clinical decisions, use direct measurement (DEXA, RMR testing, blood work) under professional supervision.

---

## References

1. Mifflin MD, St Jeor ST, Hill LA, et al. A new predictive equation for resting energy expenditure in healthy individuals. _Am J Clin Nutr._ 1990.
2. Devine BJ. Gentamicin therapy. _Drug Intell Clin Pharm._ 1974.
3. Hodgdon JA, Beckett MB. Prediction of percent body fat for Navy men and women. US Navy Research. 1984.
4. Kouri EM, Pope HG Jr, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. _Clin J Sport Med._ 1995.
5. Schutz Y, Kyle UU, Pichard C. Fat-free mass index and fat mass index percentiles in Caucasians aged 18-98 y. _Int J Obes._ 2002.
6. Epley B. Poundage chart. _Bodyfit Gym_, 1985.
7. Brzycki M. Strength testing-predicting a one-rep max from reps-to-fatigue. _JOPERD._ 1993.
