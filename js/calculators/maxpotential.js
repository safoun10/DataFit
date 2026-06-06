import { parseLength, formatWeight, isMetric, feetInchesToCm } from '../units.js';
import { getInputValue, getSegmentValue, renderResult, bindInput, bindSegment, bindFormulaPanel, getCentralHeightCm } from '../ui.js';
import { getProfileValue } from '../profile.js';

function caseyButtMaxLBM(heightCm, wristCm, ankleCm) {
  const heightIn = heightCm / 2.54;
  const wristIn  = wristCm  / 2.54;
  const ankleIn  = ankleCm  / 2.54;

  const maxLBM =
    Math.pow(heightIn, 1.5) *
    (Math.sqrt(wristIn) / 22.667 + Math.sqrt(ankleIn) / 17.0104) *
    (Math.pow(heightIn / 70, 0.5) * 0.525 + 0.45);

  return maxLBM * 0.453592; // lbs → kg
}

function berkhanMaxLBM(heightCm) {
  const heightM = heightCm / 100;
  return 25 * heightM * heightM;
}

function compute(section) {
  // Height always from central profile
  const heightCm = getCentralHeightCm(isMetric, feetInchesToCm);
  const wristCm  = parseLength(getInputValue(section, 'wrist'));
  const ankleCm  = parseLength(getInputValue(section, 'ankle'));
  const formula  = getSegmentValue(section.querySelector('[data-segment="formula"]')) || 'casey';
  const targetBF = parseFloat(getInputValue(section, 'targetBF')) || 10;
  const resultEl = section.querySelector('.result-display');

  if (!heightCm) {
    renderResult(resultEl, { value: '-', unit: 'MAX NATURAL LEAN BODY MASS', label: 'ADD HEIGHT TO PROFILE' });
    return;
  }

  let maxLBM;
  if (formula === 'berkhan') {
    maxLBM = berkhanMaxLBM(heightCm);
  } else {
    if (!wristCm || !ankleCm) {
      renderResult(resultEl, { value: '-', unit: 'MAX NATURAL LEAN BODY MASS', label: 'ENTER WRIST & ANKLE TO COMPUTE' });
      return;
    }
    maxLBM = caseyButtMaxLBM(heightCm, wristCm, ankleCm);
  }

  const maxWeight    = maxLBM / (1 - targetBF / 100);
  const gap          = maxLBM * 0.5; // rough half your max LBM is "still to gain"
  const yearsEstimate = Math.ceil(gap / 2);

  renderResult(resultEl, {
    value: formatWeight(maxLBM).replace(/ (kg|lb)$/, ''),
    unit: 'MAX NATURAL LEAN BODY MASS',
    label: formula === 'berkhan' ? 'BERKHAN · FFMI CEILING @ 25' : 'CASEY BUTT · BONE STRUCTURE LIMIT',
    extras: [
      { value: formatWeight(maxLBM), label: 'MAX LEAN MASS' },
      { value: formatWeight(maxWeight), label: `MAX BODY WEIGHT @ ${targetBF}% BF` },
      { value: `~${yearsEstimate}+ yrs`, label: 'NATURAL TIMELINE EST.' },
    ],
  });
}

export function initMaxPotential(section) {
  bindInput(section.querySelector('[data-input="wrist"]'),   { onChange: () => compute(section), profileKey: 'wrist',  min: 1 });
  bindInput(section.querySelector('[data-input="ankle"]'),   { onChange: () => compute(section), profileKey: 'ankle',  min: 1 });
  bindInput(section.querySelector('[data-input="targetBF"]'),{ onChange: () => compute(section), min: 5, max: 25 });
  bindSegment(section.querySelector('[data-segment="formula"]'), { onChange: () => compute(section) });
  bindFormulaPanel(section);

  ['wrist', 'ankle'].forEach((k) => {
    const v  = getProfileValue(k);
    const el = section.querySelector(`[data-input="${k}"]`);
    if (v && el) el.value = v;
  });

  compute(section);
}

export { compute as computeMaxPotential };
