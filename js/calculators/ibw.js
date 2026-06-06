import { parseHeight, parseWeight, formatWeight, isMetric, feetInchesToCm } from '../units.js';
import { getInputValue, getSegmentValue, renderResult, bindInput, bindSegment, bindFormulaPanel, setSegmentValue, getCentralHeightCm, getCentralSex } from '../ui.js';
import { getProfileValue } from '../profile.js';

function devine(sex, heightCm) {
  const heightIn = heightCm / 2.54;
  if (sex === 'female') return 45.5 + 2.3 * (heightIn - 60);
  return 50 + 2.3 * (heightIn - 60);
}

function robinson(sex, heightCm) {
  const heightIn = heightCm / 2.54;
  if (sex === 'female') return 49 + 1.7 * (heightIn - 60);
  return 52 + 1.9 * (heightIn - 60);
}

function miller(sex, heightCm) {
  const heightIn = heightCm / 2.54;
  if (sex === 'female') return 53.1 + 1.36 * (heightIn - 60);
  return 56.2 + 1.41 * (heightIn - 60);
}

function hamwi(sex, heightCm) {
  const heightIn = heightCm / 2.54;
  if (sex === 'female') return 45.5 + 2.2 * (heightIn - 60);
  return 48 + 2.7 * (heightIn - 60);
}

const formulas = { devine, robinson, miller, hamwi };

function compute(section) {
  // Try central profile first
  let sex = getCentralSex();
  const centralHeightCm = getCentralHeightCm(isMetric, feetInchesToCm);
  let heightCm = centralHeightCm;

  // Fallback to module inputs
  if (!sex) sex = getSegmentValue(section.querySelector('[data-segment="sex"]')) || 'male';
  if (!heightCm) heightCm = parseHeight(
    getInputValue(section, 'height'),
    getInputValue(section, 'heightFeet'),
    getInputValue(section, 'heightInches')
  );

  const formula = getSegmentValue(section.querySelector('[data-segment="formula"]')) || 'devine';
  const resultEl = section.querySelector('.result-display');

  if (!heightCm || heightCm < 100) {
    renderResult(resultEl, { value: '-', unit: isMetric() ? 'KG' : 'LB', label: '' });
    return;
  }

  const fn = formulas[formula] || devine;
  const ibwKg = fn(sex, heightCm);
  const low = ibwKg * 0.9;
  const high = ibwKg * 1.1;

  renderResult(resultEl, {
    value: formatWeight(ibwKg).replace(/ (kg|lb)$/, ''),
    unit: isMetric() ? 'KG' : 'LB',
    label: `${formula.toUpperCase()} FORMULA`,
    extras: [
      { value: formatWeight(low), label: 'LOW RANGE (−10%)' },
      { value: formatWeight(high), label: 'HIGH RANGE (+10%)' },
    ],
  });
}

export function initIBW(section) {
  bindSegment(section.querySelector('[data-segment="formula"]'), { onChange: () => compute(section) });
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeIBW };
