import { formatWeight, isMetric, lbsToKg } from '../units.js';
import { renderResult, bindFormulaPanel, getCentralWeightKg } from '../ui.js';
import { getProfileValue } from '../profile.js';
import { getStoredBodyFat } from './bodyfat.js';

function compute(section) {
  const weightKg = getCentralWeightKg(isMetric, lbsToKg);
  const centralBfInput = document.querySelector('[data-central-input="bodyFat"]');
  let bodyFat = centralBfInput ? parseFloat(centralBfInput.value) : NaN;
  if (isNaN(bodyFat)) bodyFat = getStoredBodyFat() ?? parseFloat(getProfileValue('bodyFat'));
  const resultEl = section.querySelector('.result-display');

  if (!weightKg || isNaN(bodyFat)) {
    renderResult(resultEl, { value: '-', unit: 'LEAN MASS', label: '' });
    return;
  }

  const leanMass = weightKg * (1 - bodyFat / 100);
  const fatMass = weightKg - leanMass;

  renderResult(resultEl, {
    value: formatWeight(leanMass).replace(/ (kg|lb)$/, ''),
    unit: 'LEAN BODY MASS',
    label: `${(100 - bodyFat).toFixed(1)}% LEAN`,
    extras: [
      { value: formatWeight(fatMass), label: 'FAT MASS' },
      { value: formatWeight(weightKg), label: 'TOTAL WEIGHT' },
      { value: `${bodyFat.toFixed(1)}%`, label: 'BODY FAT' },
    ],
  });
}

export function initLeanMass(section) {
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeLeanMass };
