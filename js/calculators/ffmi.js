import { formatWeight, isMetric, feetInchesToCm, lbsToKg } from '../units.js';
import { renderResult, bindFormulaPanel, getCentralHeightCm, getCentralWeightKg, getCentralBodyFat } from '../ui.js';
import { getProfileValue } from '../profile.js';
import { getStoredBodyFat } from './bodyfat.js';

function normalizedFFMI(ffmi, heightM) {
  return 6.1 * (1.8 - heightM) + ffmi;
}

function ffmiCategory(nffmi) {
  if (nffmi < 18) return 'BELOW AVERAGE';
  if (nffmi < 20) return 'AVERAGE';
  if (nffmi < 22) return 'ABOVE AVERAGE';
  if (nffmi < 23) return 'EXCELLENT';
  if (nffmi < 26) return 'SUPERIOR';
  return 'ELITE (LIKELY ENHANCED)';
}

function compute(section) {
  const heightCm = getCentralHeightCm(isMetric, feetInchesToCm);
  const weightKg = getCentralWeightKg(isMetric, lbsToKg);
  let bodyFat = getCentralBodyFat() ?? getStoredBodyFat() ?? parseFloat(getProfileValue('bodyFat'));
  const resultEl = section.querySelector('.result-display');

  if (!heightCm || !weightKg || isNaN(bodyFat)) {
    renderResult(resultEl, { value: '-', unit: 'FFMI', label: '' });
    return;
  }

  const heightM = heightCm / 100;
  const leanMass = weightKg * (1 - bodyFat / 100);
  const ffmi = leanMass / (heightM * heightM);
  const normFFMI = normalizedFFMI(ffmi, heightM);

  renderResult(resultEl, {
    value: ffmi.toFixed(1),
    unit: 'FFMI',
    label: ffmiCategory(normFFMI),
    extras: [
      { value: normFFMI.toFixed(1), label: 'NORMALIZED FFMI' },
      { value: formatWeight(leanMass), label: 'LEAN MASS' },
      { value: `${bodyFat.toFixed(1)}%`, label: 'BODY FAT' },
    ],
  });
}

export function initFFMI(section) {
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeFFMI };
