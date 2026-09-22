export const safeJson = (raw, fallback) => {
  try {
    if (raw == null || raw === '') return fallback;
    return typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return fallback;
  }
};

export const localDateKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const fmtDateTime = (value) => {
  if (!value) return '-';
  const d = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

export const uidShort = (uid = '') => uid.slice(0, 6);

export const uniqueBy = (items, keyFn) => {
  const map = new Map();
  items.forEach((item) => map.set(keyFn(item), item));
  return [...map.values()];
};
