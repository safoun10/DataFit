import { formatWeight, isMetric, feetInchesToCm, lbsToKg } from '../units.js';
import { renderResult, bindFormulaPanel, getCentralHeightCm, getCentralWeightKg, getCentralSex, getCentralBodyFat } from '../ui.js';
import { getProfileValue } from '../profile.js';
import { getStoredBodyFat } from './bodyfat.js';

function bfmiCategory(sex, bfmi) {
  if (sex === 'female') {
    if (bfmi < 3) return 'ESSENTIAL';
    if (bfmi < 5) return 'ATHLETE';
    if (bfmi < 6) return 'FITNESS';
    if (bfmi < 9) return 'AVERAGE';
    return 'ABOVE AVERAGE';
  }
  if (bfmi < 2) return 'ESSENTIAL';
  if (bfmi < 4) return 'ATHLETE';
  if (bfmi < 5) return 'FITNESS';
  if (bfmi < 7) return 'AVERAGE';
  return 'ABOVE AVERAGE';
}

function compute(section) {
  const sex = getCentralSex();
  const heightCm = getCentralHeightCm(isMetric, feetInchesToCm);
  const weightKg = getCentralWeightKg(isMetric, lbsToKg);
  let bodyFat = getCentralBodyFat() ?? getStoredBodyFat() ?? parseFloat(getProfileValue('bodyFat'));
  const resultEl = section.querySelector('.result-display');

  if (!heightCm || !weightKg || isNaN(bodyFat)) {
    renderResult(resultEl, { value: '-', unit: 'BFMI', label: '' });
    return;
  }

  const heightM = heightCm / 100;
  const fatMass = weightKg * (bodyFat / 100);
  const bfmi = fatMass / (heightM * heightM);

  renderResult(resultEl, {
    value: bfmi.toFixed(1),
    unit: 'BFMI',
    label: bfmiCategory(sex, bfmi),
    extras: [
      { value: formatWeight(fatMass), label: 'FAT MASS' },
      { value: sex === 'female' ? '3 – 9' : '2 – 7', label: 'HEALTHY RANGE' },
      { value: `${bodyFat.toFixed(1)}%`, label: 'BODY FAT' },
    ],
  });
}

export function initBFMI(section) {
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeBFMI };
