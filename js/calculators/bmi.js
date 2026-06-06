import { parseHeight, parseWeight, weightRange } from '../units.js';
import { getInputValue, renderResult, bindInput, bindFormulaPanel, getCentralHeightCm, getCentralWeightKg } from '../ui.js';
import { getProfileValue } from '../profile.js';
import { isMetric, feetInchesToCm, lbsToKg } from '../units.js';

function getHeightM(section) {
  // Try central profile first
  const centralHeightCm = getCentralHeightCm(isMetric, feetInchesToCm);
  if (centralHeightCm) return centralHeightCm / 100;

  // Fallback to module inputs
  const cm = parseHeight(
    getInputValue(section, 'height'),
    getInputValue(section, 'heightFeet'),
    getInputValue(section, 'heightInches')
  );
  return cm ? cm / 100 : null;
}

function getWeightKg(section) {
  // Try central profile first
  const centralWeightKg = getCentralWeightKg(isMetric, lbsToKg);
  if (centralWeightKg) return centralWeightKg;

  // Fallback to module inputs
  return parseWeight(getInputValue(section, 'weight'));
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return 'UNDERWEIGHT';
  if (bmi < 25) return 'NORMAL WEIGHT';
  if (bmi < 30) return 'OVERWEIGHT';
  return 'OBESE';
}

function compute(section) {
  const heightM = getHeightM(section);
  const weightKg = getWeightKg(section);
  const resultEl = section.querySelector('.result-display');

  if (!heightM || !weightKg) {
    renderResult(resultEl, { value: '-', unit: 'BMI', label: '' });
    return;
  }

  const bmi = weightKg / (heightM * heightM);
  const bmiPrime = bmi / 25;
  const minHealthy = 18.5 * heightM * heightM;
  const maxHealthy = 24.9 * heightM * heightM;

  renderResult(resultEl, {
    value: bmi.toFixed(1),
    unit: 'BMI',
    label: bmiCategory(bmi),
    extras: [
      { value: bmiPrime.toFixed(2), label: 'BMI PRIME' },
      { value: weightRange(minHealthy, maxHealthy), label: 'HEALTHY RANGE' },
    ],
  });
}

export function initBMI(section) {
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeBMI };
