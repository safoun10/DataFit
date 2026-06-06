import { parseHeight, parseLength, isMetric, feetInchesToCm } from '../units.js';
import { getInputValue, getSegmentValue, renderResult, bindInput, bindSegment, bindFormulaPanel, setSegmentValue, getCentralHeightCm, getCentralSex } from '../ui.js';
import { getProfileValue, saveProfileField } from '../profile.js';

function navyBodyFat(sex, heightCm, neckCm, waistCm, hipCm) {
  const heightIn = heightCm / 2.54;
  const neckIn = neckCm / 2.54;
  const waistIn = waistCm / 2.54;

  if (sex === 'female') {
    const hipIn = hipCm / 2.54;
    if (!hipCm) return null;
    const bf = 163.205 * Math.log10(waistIn + hipIn - neckIn) - 97.684 * Math.log10(heightIn) - 78.387;
    return bf;
  }

  const bf = 86.01 * Math.log10(waistIn - neckIn) - 70.041 * Math.log10(heightIn) + 36.76;
  return bf;
}

function bfCategory(sex, bf) {
  if (sex === 'female') {
    if (bf < 14) return 'ESSENTIAL FAT';
    if (bf < 21) return 'ATHLETE';
    if (bf < 25) return 'FITNESS';
    if (bf < 32) return 'AVERAGE';
    return 'OBESE';
  }
  if (bf < 6) return 'ESSENTIAL FAT';
  if (bf < 14) return 'ATHLETE';
  if (bf < 18) return 'FITNESS';
  if (bf < 25) return 'AVERAGE';
  return 'OBESE';
}

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

  const neckCm = parseLength(getInputValue(section, 'neck'));
  const waistCm = parseLength(getInputValue(section, 'waist'));
  const hipCm = sex === 'female' ? parseLength(getInputValue(section, 'hip')) : 1;
  const resultEl = section.querySelector('.result-display');

  if (!heightCm || !neckCm || !waistCm) {
    renderResult(resultEl, { value: '-', unit: '%', label: '' });
    return;
  }

  const bf = navyBodyFat(sex, heightCm, neckCm, waistCm, hipCm);
  if (bf === null || bf < 2 || bf > 60) {
    renderResult(resultEl, { value: '-', unit: '%', label: 'INVALID MEASUREMENTS' });
    return;
  }

  saveProfileField('bodyFat', bf.toFixed(1));
  section.dataset.bodyFat = bf.toFixed(1);

  // Sync to central profile input so dependent modules update instantly
  const centralBfInput = document.querySelector('[data-central-input="bodyFat"]');
  if (centralBfInput && centralBfInput.value !== bf.toFixed(1)) {
    centralBfInput.value = bf.toFixed(1);
    window.dispatchEvent(new CustomEvent('centralprofilechange'));
  }

  renderResult(resultEl, {
    value: bf.toFixed(1),
    unit: 'BODY FAT %',
    label: bfCategory(sex, bf),
    extras: [
      { value: `${(100 - bf).toFixed(1)}%`, label: 'LEAN MASS %' },
    ],
  });
}

export function getStoredBodyFat() {
  const section = document.getElementById('bodyfat');
  return section?.dataset.bodyFat ? parseFloat(section.dataset.bodyFat) : null;
}

export function initBodyFat(section) {
  bindInput(section.querySelector('[data-input="neck"]'), { onChange: () => compute(section), profileKey: 'neck', min: 1 });
  bindInput(section.querySelector('[data-input="waist"]'), { onChange: () => compute(section), profileKey: 'waist', min: 1 });
  bindInput(section.querySelector('[data-input="hip"]'), { onChange: () => compute(section), profileKey: 'hip', min: 1 });
  bindFormulaPanel(section);

  ['neck', 'waist', 'hip'].forEach((k) => {
    const v = getProfileValue(k);
    const el = section.querySelector(`[data-input="${k}"]`);
    if (v && el) el.value = v;
  });

  compute(section);
}

export { compute as computeBodyFat };
