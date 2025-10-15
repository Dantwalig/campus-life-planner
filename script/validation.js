export function compileRegex(input, flags = 'iu') {
  try {
    if (!input) return null;
    if (/(\.\*){3,}|(\(\?:.*\|\.*\))/u.test(input)) return null;
    return new RegExp(input, flags);
  } catch {
    return null;
  }
}
export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function highlight(text, re) {
  if (!re) return escapeHtml(text);
  return escapeHtml(text).replace(re, m => `<mark role="text">${escapeHtml(m)}</mark>`);
}
export function validateForm(values) {
  const errors = {};
  if (!/^(?=.{2,})(?!\s+$).+/.test(values.title || '')) errors.title = 'Title must be at least 2 characters';
  if (values.duration && !/^([0-9]{1,2}):([0-5][0-9])$/.test(values.duration)) errors.duration = 'Duration must be HH:MM';
  if (values.tags) {
    const toks = values.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (new Set(toks).size !== toks.length) errors.tags = 'Duplicate tags not allowed';
    const tagRe = /^[\p{L}\p{N}\p{Emoji}_-]{1,30}$/u;
    for (const t of toks) if (!tagRe.test(t)) { errors.tags = 'Invalid tag token'; break; }
  }
  return errors;
}
