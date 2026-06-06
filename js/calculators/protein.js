import { isMetric, lbsToKg } from '../units.js';
import { getSegmentValue, renderResult, bindSegment, bindFormulaPanel, getCentralActivity, getCentralWeightKg } from '../ui.js';

// Protein ranges g/kg by activity level and goal
const goalRanges = {
  sedentary: { cut: [1.6, 2.0], maintain: [0.8, 1.0], bulk: [1.6, 2.2] },
  light:     { cut: [1.8, 2.2], maintain: [1.0, 1.2], bulk: [1.8, 2.4] },
  moderate:  { cut: [2.0, 2.4], maintain: [1.2, 1.4], bulk: [2.0, 2.6] },
  active:    { cut: [2.2, 2.6], maintain: [1.4, 1.6], bulk: [2.2, 2.8] },
  very:      { cut: [2.4, 2.8], maintain: [1.6, 1.8], bulk: [2.4, 3.0] },
};

function getActivityKey(multiplier) {
  const m = parseFloat(multiplier);
  if (m <= 1.2)   return 'sedentary';
  if (m <= 1.375) return 'light';
  if (m <= 1.55)  return 'moderate';
  if (m <= 1.725) return 'active';
  return 'very';
}

function renderProteinTable(section, weightKg, activity) {
  let tableEl = section.querySelector('.protein-table');
  if (!tableEl) {
    tableEl = document.createElement('table');
    tableEl.className = 'percent-table protein-table';
    tableEl.setAttribute('aria-label', 'Protein targets by goal');
    tableEl.innerHTML = `
      <thead>
        <tr><th>GOAL</th><th>RANGE (G/DAY)</th><th>G/KG</th></tr>
      </thead>
      <tbody></tbody>
    `;
    // Insert before formula panel
    const formulaPanel = section.querySelector('.formula-panel');
    if (formulaPanel) formulaPanel.before(tableEl);
  }

  const goals = ['cut', 'maintain', 'bulk'];
  const labels = { cut: 'CUT', maintain: 'MAINTAIN', bulk: 'BULK' };
  const tbody = tableEl.querySelector('tbody');
  tbody.innerHTML = goals.map((goal) => {
    const range = goalRanges[activity]?.[goal] ?? goalRanges.moderate[goal];
    const low = Math.round(weightKg * range[0]);
    const high = Math.round(weightKg * range[1]);
    return `<tr><td>${labels[goal]}</td><td>${low} – ${high} g</td><td>${range[0]} – ${range[1]}</td></tr>`;
  }).join('');
}

function compute(section) {
  const weightKg = getCentralWeightKg(isMetric, lbsToKg);
  const selectedGoal = getSegmentValue(section.querySelector('[data-segment="goal"]')) || 'maintain';
  const centralActivity = getCentralActivity();
  const activity = centralActivity ? getActivityKey(centralActivity) : 'moderate';
  const resultEl = section.querySelector('.result-display');

  if (!weightKg) {
    renderResult(resultEl, { value: '-', unit: 'G PROTEIN / DAY', label: 'ADD WEIGHT TO PROFILE' });
    // Hide table if present
    const t = section.querySelector('.protein-table');
    if (t) t.style.display = 'none';
    return;
  }

  const range = goalRanges[activity]?.[selectedGoal] ?? goalRanges.moderate.maintain;
  const low = Math.round(weightKg * range[0]);
  const high = Math.round(weightKg * range[1]);
  const mid = Math.round((low + high) / 2);

  renderResult(resultEl, {
    value: `${low} – ${high}`,
    unit: 'G PROTEIN / DAY',
    label: `${selectedGoal.toUpperCase()} · ${activity.toUpperCase()}`,
    extras: [
      { value: String(mid), label: 'TARGET MIDPOINT' },
      { value: `${range[0]} – ${range[1]} g/kg`, label: 'RATIO RANGE' },
    ],
  });

  // Show full table for all 3 goals
  renderProteinTable(section, weightKg, activity);
  const t = section.querySelector('.protein-table');
  if (t) t.style.display = '';
}

export function initProtein(section) {
  bindSegment(section.querySelector('[data-segment="goal"]'), { onChange: () => compute(section) });
  bindFormulaPanel(section);
  compute(section);
}

export { compute as computeProtein };
