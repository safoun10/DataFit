/**
 * Shared operator profile - persisted in localStorage.
 * Stores values in metric (cm, kg) internally for consistency.
 */

const PROFILE_KEY = 'datafit_profile';

const defaults = {
  sex: 'male',
  age: '',
  height: '', // Always stored in cm
  weight: '', // Always stored in kg
  bodyFat: '',
  neck: '',
  waist: '',
  hip: '',
  wrist: '',
  ankle: '',
  activity: '1.55',
};

let profile = { ...defaults };

export function loadProfile() {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) {
      profile = { ...defaults, ...JSON.parse(stored) };
    }
  } catch {
    profile = { ...defaults };
  }
  return profile;
}

export function getProfile() {
  return { ...profile };
}

export function saveProfileField(key, value) {
  if (profile[key] === value) return;
  profile[key] = value;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('profilefieldchange', { detail: { key, value } }));
}

export function saveProfile(data) {
  let changed = false;
  for (const k in data) {
    if (profile[k] !== data[k]) {
      profile[k] = data[k];
      changed = true;
    }
  }
  if (!changed) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new CustomEvent('profilechange', { detail: data }));
}

export function getProfileNumber(key) {
  const val = parseFloat(profile[key]);
  return isNaN(val) ? null : val;
}

export function getProfileValue(key) {
  return profile[key] ?? '';
}
