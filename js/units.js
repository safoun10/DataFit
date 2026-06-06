/**
 * Unit conversion utilities - all calculators work internally in metric.
 */

const STORAGE_KEY = 'datafit_unit_mode';

let unitMode = localStorage.getItem(STORAGE_KEY) || 'metric';

export function getUnitMode() {
  return unitMode;
}

export function setUnitMode(mode) {
  unitMode = mode === 'imperial' ? 'imperial' : 'metric';
  localStorage.setItem(STORAGE_KEY, unitMode);
  window.dispatchEvent(new CustomEvent('unitchange', { detail: { mode: unitMode } }));
}

export function isMetric() {
  return unitMode === 'metric';
}

// Height
export function cmToInches(cm) {
  return cm / 2.54;
}

export function inchesToCm(inches) {
  return inches * 2.54;
}

export function cmToFeetInches(cm) {
  const totalInches = cmToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches, totalInches };
}

export function feetInchesToCm(feet, inches) {
  return inchesToCm(feet * 12 + inches);
}

// Weight
export function kgToLbs(kg) {
  return kg * 2.20462;
}

export function lbsToKg(lbs) {
  return lbs / 2.20462;
}

// Circumference
export function cmToIn(cm) {
  return cm / 2.54;
}

export function inToCm(inches) {
  return inches * 2.54;
}

export function heightLabel() {
  return isMetric() ? 'cm' : 'ft/in';
}

export function weightLabel() {
  return isMetric() ? 'kg' : 'lb';
}

export function lengthLabel() {
  return isMetric() ? 'cm' : 'in';
}

export function formatHeight(cm) {
  if (!cm || cm <= 0) return '-';
  if (isMetric()) return `${Math.round(cm)} cm`;
  const { feet, inches } = cmToFeetInches(cm);
  return `${feet}'${inches}"`;
}

export function formatWeight(kg) {
  if (!kg || kg <= 0) return '-';
  if (isMetric()) return `${kg.toFixed(1)} kg`;
  return `${kgToLbs(kg).toFixed(1)} lb`;
}

export function formatLength(cm) {
  if (!cm || cm <= 0) return '-';
  if (isMetric()) return `${cm.toFixed(1)} cm`;
  return `${cmToIn(cm).toFixed(1)} in`;
}

export function parseHeight(value, feetValue, inchesValue) {
  if (isMetric()) {
    const cm = parseFloat(value);
    return isNaN(cm) ? null : cm;
  }
  const feet = parseFloat(feetValue) || 0;
  const inches = parseFloat(inchesValue) || 0;
  if (feet === 0 && inches === 0) return null;
  return feetInchesToCm(feet, inches);
}

export function parseWeight(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return null;
  return isMetric() ? num : lbsToKg(num);
}

export function parseLength(value) {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) return null;
  return isMetric() ? num : inToCm(num);
}

export function displayWeight(kg) {
  if (!kg || kg <= 0) return '';
  if (isMetric()) return kg.toFixed(1);
  return kgToLbs(kg).toFixed(1);
}

export function displayHeight(cm) {
  if (!cm || cm <= 0) return '';
  if (isMetric()) return Math.round(cm).toString();
  const { feet, inches } = cmToFeetInches(cm);
  return { feet: feet.toString(), inches: inches.toString() };
}

export function displayLength(cm) {
  if (!cm || cm <= 0) return '';
  if (isMetric()) return cm.toFixed(1);
  return cmToIn(cm).toFixed(1);
}

export function weightRange(minKg, maxKg) {
  if (isMetric()) return `${minKg.toFixed(1)} – ${maxKg.toFixed(1)} kg`;
  return `${kgToLbs(minKg).toFixed(1)} – ${kgToLbs(maxKg).toFixed(1)} lb`;
}

export function proteinUnit() {
  return isMetric() ? 'g/day' : 'g/day';
}

export function kcalUnit() {
  return 'kcal/day';
}

// Convert stored metric values to display values for current unit mode
export function displayWeightForInput(kg) {
  if (!kg || kg <= 0) return '';
  if (isMetric()) return kg.toFixed(1);
  return kgToLbs(kg).toFixed(1);
}

export function displayHeightForInput(cm) {
  if (!cm || cm <= 0) return { metric: '', feet: '', inches: '' };
  if (isMetric()) return { metric: Math.round(cm).toString(), feet: '', inches: '' };
  const { feet, inches } = cmToFeetInches(cm);
  return { metric: '', feet: feet.toString(), inches: inches.toString() };
}
