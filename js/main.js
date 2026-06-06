import { loadProfile, saveProfile } from './profile.js';
import { getUnitMode, setUnitMode, isMetric, feetInchesToCm, lbsToKg, displayHeightForInput, displayWeightForInput } from './units.js';
import { activityLevels, bindCentralProfileInputs, populateCentralProfileFromStorage, getCentralHeightCm, getCentralWeightKg, getCentralAge, getCentralSex, getCentralActivity, updateCentralProfileDisplay } from './ui.js';
import { initBMI } from './calculators/bmi.js';
import { initBMR } from './calculators/bmr.js';
import { initTDEE } from './calculators/tdee.js';
import { initIBW } from './calculators/ibw.js';
import { initBodyFat } from './calculators/bodyfat.js';
import { initFFMI } from './calculators/ffmi.js';
import { initBFMI } from './calculators/bfmi.js';
import { initLeanMass } from './calculators/leanmass.js';
import { initProtein } from './calculators/protein.js';
import { initMaxPotential } from './calculators/maxpotential.js';
import { computeBMI } from './calculators/bmi.js';
import { computeBMR } from './calculators/bmr.js';
import { computeTDEE } from './calculators/tdee.js';
import { computeIBW } from './calculators/ibw.js';
import { computeBodyFat } from './calculators/bodyfat.js';
import { computeFFMI } from './calculators/ffmi.js';
import { computeBFMI } from './calculators/bfmi.js';
import { computeLeanMass } from './calculators/leanmass.js';
import { computeProtein } from './calculators/protein.js';
import { computeMaxPotential } from './calculators/maxpotential.js';

let notificationTimeouts = { hide: null, fadeOut: null };

const SECTIONS = [
  'hero',
  'profile',
  'bmi',
  'bmr',
  'tdee',
  'ibw',
  'bodyfat',
  'ffmi',
  'bfmi',
  'leanmass',
  'protein',
  'maxpotential',
];

const computeMap = {
  bmi: computeBMI,
  bmr: computeBMR,
  tdee: computeTDEE,
  ibw: computeIBW,
  bodyfat: computeBodyFat,
  ffmi: computeFFMI,
  bfmi: computeBFMI,
  leanmass: computeLeanMass,
  protein: computeProtein,
  maxpotential: computeMaxPotential,
};

function buildActivityOptions() {
  return activityLevels()
    .map((l) => `<option value="${l.value}">${l.label} - ${l.desc}</option>`)
    .join('');
}

function injectActivitySelects() {
  const html = buildActivityOptions();
  document.querySelectorAll('[data-central-select="activity"]').forEach((sel) => {
    if (!sel.options.length) sel.innerHTML = html;
  });
}

function updateUnitLabels() {
  const metric = isMetric();
  document.querySelectorAll('[data-unit-height]').forEach((el) => {
    el.textContent = metric ? 'HEIGHT (CM)' : 'HEIGHT (FT / IN)';
  });
  document.querySelectorAll('[data-unit-weight]').forEach((el) => {
    el.textContent = metric ? 'WEIGHT (KG)' : 'WEIGHT (LB)';
  });
  document.querySelectorAll('[data-unit-length]').forEach((el) => {
    el.textContent = metric ? 'MEASUREMENT (CM)' : 'MEASUREMENT (IN)';
  });
  document.querySelectorAll('[data-unit-length-suffix]').forEach((el) => {
    el.textContent = metric ? 'CM' : 'IN';
  });

  document.querySelectorAll('.height-metric').forEach((el) => {
    el.style.display = metric ? '' : 'none';
  });
  document.querySelectorAll('.height-imperial').forEach((el) => {
    el.style.display = metric ? 'none' : '';
  });

  const toggle = document.getElementById('unit-toggle');
  if (toggle) {
    toggle.innerHTML = metric
      ? 'UNIT: <span class="unit-toggle__active">METRIC</span> | IMPERIAL'
      : 'UNIT: METRIC | <span class="unit-toggle__active">IMPERIAL</span>';
  }

  updateCentralProfileDisplay(isMetric, displayHeightForInput, displayWeightForInput);
}

function recomputeAll() {
  SECTIONS.slice(1).forEach((id) => {
    const section = document.getElementById(id);
    const fn = computeMap[id];
    if (section && fn) fn(section);
  });
}

function initDotNav() {
  const nav = document.getElementById('dot-nav');
  if (!nav) return;

  const line = document.createElement('span');
  line.className = 'dot-nav__line';
  line.setAttribute('aria-hidden', 'true');
  nav.appendChild(line);

  SECTIONS.forEach((id, i) => {
    const dot = document.createElement('button');
    dot.className = `dot-nav__dot${i === 0 ? ' is-active' : ''}`;
    dot.dataset.section = id;
    dot.setAttribute('aria-label', `Go to section ${i + 1}: ${id}`);
    if (i === 0) dot.setAttribute('aria-current', 'true');
    dot.addEventListener('click', () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
    nav.appendChild(dot);
  });
}

function initScrollObserver() {
  const sections = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
  const dots = document.querySelectorAll('.dot-nav__dot');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          const id = entry.target.id;
          dots.forEach((dot) => {
            const active = dot.dataset.section === id;
            dot.classList.toggle('is-active', active);
            dot.setAttribute('aria-current', active ? 'true' : 'false');
          });
        }
      });
    },
    { threshold: 0.5 }
  );

  sections.forEach((s) => observer.observe(s));
}

function initUnitToggle() {
  document.getElementById('unit-toggle')?.addEventListener('click', () => {
    setUnitMode(isMetric() ? 'imperial' : 'metric');
    showUnitNotification();
  });

  window.addEventListener('unitchange', () => {
    updateUnitLabels();
    recomputeAll();
  });
}

function showUnitNotification() {
  const notification = document.getElementById('unit-notification');
  const newUnit = isMetric() ? 'METRIC' : 'IMPERIAL';
  const text = document.getElementById('notification-text');
  text.textContent = `Switched to ${newUnit}. Please verify your input values - they have been converted.`;
  
  // Clear any existing timeouts
  if (notificationTimeouts.hide) clearTimeout(notificationTimeouts.hide);
  if (notificationTimeouts.fadeOut) clearTimeout(notificationTimeouts.fadeOut);
  
  notification.style.display = 'block';
  notification.classList.remove('fade-out');
  
  notificationTimeouts.fadeOut = setTimeout(() => {
    notification.classList.add('fade-out');
    notificationTimeouts.hide = setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  }, 3500);
}

function initHeroCTA() {
  document.getElementById('start-btn')?.addEventListener('click', () => {
    document.getElementById('bmi')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initModal() {
  const overlay = document.getElementById('info-modal');
  const openBtn = document.getElementById('info-btn');
  const closeBtn = document.getElementById('modal-close');

  openBtn?.addEventListener('click', () => overlay?.classList.add('is-open'));
  closeBtn?.addEventListener('click', () => overlay?.classList.remove('is-open'));
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });
}

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const active = document.querySelector('.dot-nav__dot.is-active');
    if (!active) return;

    const idx = SECTIONS.indexOf(active.dataset.section);
    const next = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
    if (next < 0 || next >= SECTIONS.length) return;

    e.preventDefault();
    document.getElementById(SECTIONS[next])?.scrollIntoView({ behavior: 'smooth' });
  });
}

function initCalculators() {
  initBMI(document.getElementById('bmi'));
  initBMR(document.getElementById('bmr'));
  initTDEE(document.getElementById('tdee'));
  initIBW(document.getElementById('ibw'));
  initBodyFat(document.getElementById('bodyfat'));
  initFFMI(document.getElementById('ffmi'));
  initBFMI(document.getElementById('bfmi'));
  initLeanMass(document.getElementById('leanmass'));
  initProtein(document.getElementById('protein'));
  initMaxPotential(document.getElementById('maxpotential'));
}

function initCentralProfile(profile) {
  bindCentralProfileInputs();
  populateCentralProfileFromStorage(profile, isMetric, displayHeightForInput, displayWeightForInput);

  window.addEventListener('centralprofilechange', () => {
    const heightCm = getCentralHeightCm(isMetric, feetInchesToCm);
    const weightKg = getCentralWeightKg(isMetric, lbsToKg);
    const age = getCentralAge();
    const sex = getCentralSex();
    const activity = getCentralActivity();
    const bodyFatInput = document.querySelector('[data-central-input="bodyFat"]');
    const bodyFatVal = bodyFatInput ? parseFloat(bodyFatInput.value) : NaN;

    const data = {};
    if (heightCm) data.height = String(heightCm);
    if (weightKg) data.weight = String(weightKg);
    if (age) data.age = String(age);
    if (sex) data.sex = sex;
    if (activity) data.activity = String(activity);
    if (!isNaN(bodyFatVal) && bodyFatVal > 0) data.bodyFat = String(bodyFatVal);

    saveProfile(data);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const profile = loadProfile();
  injectActivitySelects();
  initDotNav();
  initScrollObserver();
  initUnitToggle();
  initHeroCTA();
  initModal();
  initKeyboardNav();
  updateUnitLabels();
  initCentralProfile(profile);
  initCalculators();

  // Restore last computed TDEE/BMR (session memory)
  try {
    const storedTDEE = localStorage.getItem('datafit_tdee');
    const storedBMR = localStorage.getItem('datafit_bmr');
    const tdeeSection = document.getElementById('tdee');
    if (tdeeSection && storedTDEE) tdeeSection.dataset.tdee = storedTDEE;
    if (tdeeSection && storedBMR) tdeeSection.dataset.bmr = storedBMR;
  } catch (e) { /* noop */ }

  window.addEventListener('profilechange', () => {
    recomputeAll();
  });
});
