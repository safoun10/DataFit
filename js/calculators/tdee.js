import { getInputValue, getSelectValue, renderResult, bindInput, bindSelect, bindFormulaPanel, getActivityLabel, getCentralActivity } from '../ui.js';
import { getStoredBMR } from './bmr.js';
import { getProfileValue } from '../profile.js';

function getBMR(section) {
  const stored = getStoredBMR();
  if (stored) return stored;

  // If BMR not computed yet, return null - user must go to BMR module first
  return null;
}

function compute(section) {
  const bmr = getBMR(section);
  const activity = getCentralActivity() || 1.55;
  const resultEl = section.querySelector('.result-display');

  if (!bmr) {
    renderResult(resultEl, { value: '-', unit: 'KCAL/DAY', label: 'COMPLETE BMR MODULE OR SET ACTIVITY LEVEL' });
    return;
  }

  const tdee = Math.round(bmr * activity);
  const cut = tdee - 500;
  const bulk = tdee + 300;

  section.dataset.tdee = tdee;
  section.dataset.bmr = bmr;

  // Persist last computed values for session restore
  try { localStorage.setItem('datafit_tdee', String(tdee)); localStorage.setItem('datafit_bmr', String(bmr)); } catch (e) { /* noop */ }

  renderResult(resultEl, {
    value: tdee.toLocaleString(),
    unit: 'KCAL/DAY',
    label: `${getActivityLabel(String(activity))} · MAINTENANCE`,
    extras: [
      { value: cut.toLocaleString(), label: 'CUT (−500)' },
      { value: bulk.toLocaleString(), label: 'BULK (+300)' },
      { value: bmr.toLocaleString(), label: 'BMR BASE' },
    ],
  });
}

export function getStoredTDEE() {
  const section = document.getElementById('tdee');
  return section?.dataset.tdee ? parseInt(section.dataset.tdee, 10) : null;
}

export function getStoredTDEE_BMR() {
  const section = document.getElementById('tdee');
  return section?.dataset.bmr ? parseInt(section.dataset.bmr, 10) : null;
}

export function initTDEE(section) {
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeTDEE };
