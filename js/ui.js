/**
 * UI utilities - input binding, validation, formula panels.
 */

import { saveProfileField, getProfile } from './profile.js';

export function $(selector, root = document) {
  return root.querySelector(selector);
}

export function $$(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

export function bindInput(input, { onChange, profileKey, min, max }) {
  if (!input) return;

  const validate = () => {
    const val = parseFloat(input.value);
    if (input.value === '') {
      input.classList.remove('is-invalid');
      return true;
    }
    const invalid = isNaN(val) || (min !== undefined && val < min) || (max !== undefined && val > max);
    input.classList.toggle('is-invalid', invalid);
    return !invalid;
  };

  input.addEventListener('input', () => {
    validate();
    if (profileKey) saveProfileField(profileKey, input.value);
    onChange?.();
  });

  input.addEventListener('change', () => {
    validate();
    onChange?.();
  });
}

export function bindSelect(select, { onChange, profileKey }) {
  if (!select) return;

  select.addEventListener('change', () => {
    if (profileKey) saveProfileField(profileKey, select.value);
    onChange?.();
  });
}

export function bindSegment(container, { onChange, profileKey }) {
  if (!container) return;

  const options = $$('.segment-control__option', container);
  options.forEach((btn) => {
    btn.addEventListener('click', () => {
      options.forEach((o) => o.classList.remove('is-active'));
      btn.classList.add('is-active');
      if (profileKey) saveProfileField(profileKey, btn.dataset.value);
      onChange?.();
    });
  });
}

export function getSegmentValue(container) {
  if (!container) return '';
  const active = $('.segment-control__option.is-active', container);
  return active?.dataset.value ?? '';
}

export function setSegmentValue(container, value) {
  if (!container) return;
  const options = $$('.segment-control__option', container);
  options.forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.value === value);
  });
}

export function bindFormulaPanel(section) {
  const panel = $('.formula-panel', section);
  if (!panel) return;

  const toggle = $('.formula-panel__toggle', panel);
  toggle?.addEventListener('click', () => {
    panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', panel.classList.contains('is-open'));
  });
}

export function renderResult(container, { value, unit, label, extras = [] }) {
  const valueEl = $('.result-display__value', container);
  const unitEl = $('.result-display__unit', container);
  const labelEl = $('.result-display__label', container);
  const extrasEl = $('.result-extras', container);

  if (valueEl) valueEl.textContent = value ?? '-';
  if (unitEl) unitEl.textContent = unit ?? '';
  if (labelEl) labelEl.textContent = label ?? '';

  if (extrasEl) {
    extrasEl.innerHTML = extras
      .map(
        (e) => `
      <div class="result-extra">
        <div class="result-extra__value">${e.value}</div>
        <div class="result-extra__label">${e.label}</div>
      </div>`
      )
      .join('');
  }
}

export function getInputValue(section, name) {
  const input = section.querySelector(`[data-input="${name}"]`);
  if (!input) return '';
  return input.value;
}

export function getSelectValue(section, name) {
  const select = section.querySelector(`[data-select="${name}"]`);
  if (!select) return '';
  return select.value;
}

export function setInputValue(section, name, value) {
  const input = section.querySelector(`[data-input="${name}"]`);
  if (input && value !== undefined) input.value = value;
}

export function readNumber(section, name) {
  const val = parseFloat(getInputValue(section, name));
  return isNaN(val) ? null : val;
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function activityLevels() {
  return [
    { value: '1.2', label: 'Sedentary', desc: 'Little or no exercise' },
    { value: '1.375', label: 'Light', desc: '1–3 days/week' },
    { value: '1.55', label: 'Moderate', desc: '3–5 days/week' },
    { value: '1.725', label: 'Active', desc: '6–7 days/week' },
    { value: '1.9', label: 'Very Active', desc: 'Hard daily + physical job' },
  ];
}

export function getActivityLabel(multiplier) {
  const levels = activityLevels();
  const match = levels.find((l) => l.value === String(multiplier));
  return match ? match.label.toUpperCase() : 'CUSTOM';
}

export function getActivityByValue(value) {
  return activityLevels().find((l) => l.value === value);
}

// Central profile input syncing
export function bindCentralProfileInputs() {
  const heightInput = document.querySelector('[data-central-input="height"]');
  const feetInput = document.querySelector('[data-central-input="heightFeet"]');
  const inchesInput = document.querySelector('[data-central-input="heightInches"]');
  const weightInput = document.querySelector('[data-central-input="weight"]');
  const ageInput = document.querySelector('[data-central-input="age"]');
  const bodyFatInput = document.querySelector('[data-central-input="bodyFat"]');
  const sexSegment = document.querySelector('[data-central-segment="sex"]');
  const activitySelect = document.querySelector('[data-central-select="activity"]');

  const emitChange = () => {
    window.dispatchEvent(new CustomEvent('centralprofilechange'));
  };

  [heightInput, feetInput, inchesInput, weightInput, ageInput, activitySelect, bodyFatInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', emitChange);
    input.addEventListener('change', emitChange);
  });

  if (sexSegment) {
    const options = $$('.segment-control__option', sexSegment);
    options.forEach((btn) => {
      btn.addEventListener('click', () => {
        options.forEach((o) => o.classList.remove('is-active'));
        btn.classList.add('is-active');
        emitChange();
      });
    });
  }
}

export function getCentralHeightCm(isMetricFn, feetInchesToCmFn) {
  const heightInput = document.querySelector('[data-central-input="height"]');
  const feetInput = document.querySelector('[data-central-input="heightFeet"]');
  const inchesInput = document.querySelector('[data-central-input="heightInches"]');

  if (!heightInput) return null;

  if (isMetricFn()) {
    const cm = parseFloat(heightInput.value);
    return isNaN(cm) || cm <= 0 ? null : cm;
  } else {
    const feet = parseFloat(feetInput?.value) || 0;
    const inches = parseFloat(inchesInput?.value) || 0;
    if (feet === 0 && inches === 0) return null;
    return feetInchesToCmFn(feet, inches);
  }
}

export function getCentralWeightKg(isMetricFn, lbsToKgFn) {
  const weightInput = document.querySelector('[data-central-input="weight"]');
  if (!weightInput) return null;
  const num = parseFloat(weightInput.value);
  if (isNaN(num) || num <= 0) return null;
  return isMetricFn() ? num : lbsToKgFn(num);
}

export function getCentralAge() {
  const ageInput = document.querySelector('[data-central-input="age"]');
  if (!ageInput) return null;
  const num = parseFloat(ageInput.value);
  return isNaN(num) || num <= 0 ? null : num;
}

export function getCentralSex() {
  const sexSegment = document.querySelector('[data-central-segment="sex"]');
  if (!sexSegment) return 'male';
  const active = $('.segment-control__option.is-active', sexSegment);
  return active?.dataset.value ?? 'male';
}

export function getCentralActivity() {
  const activitySelect = document.querySelector('[data-central-select="activity"]');
  if (!activitySelect) return null;
  const val = parseFloat(activitySelect.value);
  return isNaN(val) || val <= 0 ? null : val;
}

export function getCentralBodyFat() {
  const bfInput = document.querySelector('[data-central-input="bodyFat"]');
  if (!bfInput) return null;
  const val = parseFloat(bfInput.value);
  return isNaN(val) || val <= 0 ? null : val;
}

export function populateCentralProfileFromStorage(profile, isMetricFn, displayHeightFn, displayWeightFn) {
  const heightInput = document.querySelector('[data-central-input="height"]');
  const feetInput = document.querySelector('[data-central-input="heightFeet"]');
  const inchesInput = document.querySelector('[data-central-input="heightInches"]');
  const weightInput = document.querySelector('[data-central-input="weight"]');
  const ageInput = document.querySelector('[data-central-input="age"]');
  const sexSegment = document.querySelector('[data-central-segment="sex"]');
  const activitySelect = document.querySelector('[data-central-select="activity"]');

  if (profile.height) {
    const dispHeight = displayHeightFn(parseFloat(profile.height));
    if (isMetricFn()) {
      if (heightInput) heightInput.value = dispHeight.metric || '';
    } else {
      if (feetInput) feetInput.value = dispHeight.feet || '';
      if (inchesInput) inchesInput.value = dispHeight.inches || '';
    }
  }

  if (profile.weight && weightInput) {
    const dispWeight = displayWeightFn(parseFloat(profile.weight));
    weightInput.value = dispWeight;
  }

  if (profile.age && ageInput) {
    ageInput.value = profile.age;
  }

  if (profile.sex && sexSegment) {
    const options = $$('.segment-control__option', sexSegment);
    options.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.value === profile.sex);
    });
  }

  if (profile.activity && activitySelect) {
    activitySelect.value = profile.activity;
  }

  const bodyFatInput = document.querySelector('[data-central-input="bodyFat"]');
  if (profile.bodyFat && bodyFatInput) {
    bodyFatInput.value = profile.bodyFat;
  }
}

export function updateCentralProfileDisplay(isMetricFn, displayHeightFn, displayWeightFn) {
  const profile = getProfile();
  populateCentralProfileFromStorage(profile, isMetricFn, displayHeightFn, displayWeightFn);
}
