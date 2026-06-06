import { parseHeight, parseWeight, isMetric, feetInchesToCm, lbsToKg } from '../units.js';
import { getInputValue, getSegmentValue, renderResult, bindInput, bindSegment, bindFormulaPanel, setSegmentValue, getCentralHeightCm, getCentralWeightKg, getCentralAge, getCentralSex } from '../ui.js';
import { getProfileValue } from '../profile.js';

function getHeightCm(section) {
  // Try central profile first
  const centralHeightCm = getCentralHeightCm(isMetric, feetInchesToCm);
  if (centralHeightCm) return centralHeightCm;

  // Fallback to module inputs
  return parseHeight(
    getInputValue(section, 'height'),
    getInputValue(section, 'heightFeet'),
    getInputValue(section, 'heightInches')
  );
}

function mifflinStJeor(sex, weightKg, heightCm, age) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === 'female' ? base - 161 : base + 5;
}

function harrisBenedict(sex, weightKg, heightCm, age) {
  if (sex === 'female') {
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  }
  return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
}

function compute(section) {
  const sex = getCentralSex();
  const age = getCentralAge();
  const heightCm = getHeightCm(section);
  const weightKg = getCentralWeightKg(isMetric, lbsToKg);
  const formula = getSegmentValue(section.querySelector('[data-segment="formula"]')) || 'mifflin';
  const resultEl = section.querySelector('.result-display');

  if (!sex || !age || !heightCm || !weightKg) {
    renderResult(resultEl, { value: '-', unit: 'KCAL/DAY', label: '' });
    return;
  }

  const bmr =
    formula === 'harris'
      ? harrisBenedict(sex, weightKg, heightCm, age)
      : mifflinStJeor(sex, weightKg, heightCm, age);

  const alt =
    formula === 'harris'
      ? mifflinStJeor(sex, weightKg, heightCm, age)
      : harrisBenedict(sex, weightKg, heightCm, age);

  section.dataset.bmr = Math.round(bmr);

  renderResult(resultEl, {
    value: Math.round(bmr).toLocaleString(),
    unit: 'KCAL/DAY',
    label: formula === 'harris' ? 'HARRIS-BENEDICT' : 'MIFFLIN-ST JEOR',
    extras: [{ value: Math.round(alt).toLocaleString(), label: 'ALT. FORMULA' }],
  });
}

export function getStoredBMR() {
  const section = document.getElementById('bmr');
  return section?.dataset.bmr ? parseInt(section.dataset.bmr, 10) : null;
}

export function initBMR(section) {
  bindSegment(section.querySelector('[data-segment="formula"]'), { onChange: () => compute(section) });
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeBMR, mifflinStJeor };
