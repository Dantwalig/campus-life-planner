/**
 * validation.js - Form validation & regex utilities
 * Includes 4+ regex patterns with one advanced (lookahead) pattern
 */

/**
 * REGEX PATTERNS (all documented below):
 * 
 * 1. TITLE VALIDATION (ADVANCED - lookahead/negative lookahead)
 *    Pattern: /^(?=.{2,})(?!\s+$).+/
 *    - (?=.{2,}) : Positive lookahead ensures >=2 chars
 *    - (?!\s+$) : Negative lookahead rejects whitespace-only
 *    Examples: "CS 101" ✓, "Meeting" ✓, "a" ✗, "   " ✗
 * 
 * 2. DURATION VALIDATION (time format HH:MM)
 *    Pattern: /^([0-9]{1,2}):([0-5][0-9])$/
 *    - Captures hours (0-99) and minutes (00-59)
 *    Examples: "01:30" ✓, "2:45" ✓, "1:60" ✗
 * 
 * 3. DATE/TIME VALIDATION (ISO format)
 *    Pattern: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
 *    - Validates YYYY-MM-DDTHH:MM
 *    Examples: "2025-10-17T14:30" ✓, "2025/10/17" ✗
 * 
 * 4. TAG VALIDATION (Unicode letters, numbers, emoji)
 *    Pattern: /^[\p{L}\p{N}\p{Emoji}_-]{1,30}$/u
 *    - Supports letters, numbers, underscore, dash, emoji
 *    - Max 30 chars per tag
 *    Examples: "urgent" ✓, "CS101" ✓, "tag with space" ✗
 * 
 * 5. DUPLICATE TAG DETECTION (back-reference for repeated words)
 *    Pattern: /\b(\w+)\b(?=.*\b\1\b)/
 *    - \b(\w+)\b : Captures word boundary
 *    - (?=.*\b\1\b) : Lookahead ensures word repeats later
 *    Examples: "urgent urgent" ✗, "urgent important" ✓
 * 
 * 6. SAFE REGEX COMPILER (prevents catastrophic backtracking)
 *    Pattern: /(\.\*){3,}|(\(\?:.*\|\.*\))/u
 *    - Detects dangerous patterns like .*.*.* or (?:.*|.*)
 */

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
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

export function highlight(text, re) {
  if (!re) return escapeHtml(text);
  const escaped = escapeHtml(text);
  return escaped.replace(re, m => `<mark role="text">${m}</mark>`);
}

export function validateForm(values) {
  const errors = {};
  
  if (!/^(?=.{2,})(?!\s+$).+/.test(values.title || '')) {
    errors.title = 'Title must be at least 2 characters (not just spaces)';
  }
  
  if (values.duration && !/^([0-9]{1,2}):([0-5][0-9])$/.test(values.duration)) {
    errors.duration = 'Duration must be HH:MM format (e.g., 01:30)';
  }
  
  if (values.date && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(values.date)) {
    errors.date = 'Invalid date/time format (YYYY-MM-DDTHH:MM)';
  }
  
  if (values.tags) {
    const toks = values.tags.split(',').map(t => t.trim()).filter(Boolean);
    
    const tagList = toks.join(' ');
    const dupPattern = /\b(\w+)\b(?=.*\b\1\b)/;
    if (dupPattern.test(tagList)) {
      errors.tags = 'Duplicate tags detected (each tag must be unique)';
    }
    
    const tagRe = /^[\p{L}\p{N}\p{Emoji}_-]{1,30}$/u;
    for (const t of toks) {
      if (!tagRe.test(t)) {
        errors.tags = `Invalid tag "${t}" – use alphanumeric, emoji, underscore, dash (max 30 chars)`;
        break;
      }
    }
  }
  
  return errors;
}

export function runValidationTests() {
  console.log('=== VALIDATION TESTS ===');
  
  const titleTests = [
    { val: 'Valid Title', expect: true },
    { val: 'CS 101', expect: true },
    { val: 'a', expect: false },
    { val: '   ', expect: false },
    { val: 'OK', expect: true }
  ];
  console.log('Title Validation (lookahead):');
  titleTests.forEach(t => {
    const result = /^(?=.{2,})(?!\s+$).+/.test(t.val) === t.expect;
    console.log(`  "${t.val}" → ${result ? '✓' : '✗ FAIL'}`);
  });
  
  const durationTests = [
    { val: '01:30', expect: true },
    { val: '2:45', expect: true },
    { val: '48:00', expect: true },
    { val: '1:60', expect: false },
    { val: 'ab:cd', expect: false }
  ];
  console.log('\nDuration Validation (HH:MM):');
  durationTests.forEach(t => {
    const result = /^([0-9]{1,2}):([0-5][0-9])$/.test(t.val) === t.expect;
    console.log(`  "${t.val}" → ${result ? '✓' : '✗ FAIL'}`);
  });
  
  const dateTests = [
    { val: '2025-10-17T14:30', expect: true },
    { val: '2025-01-01T00:00', expect: true },
    { val: '2025-10-17', expect: false },
    { val: '2025/10/17', expect: false }
  ];
  console.log('\nDate/Time Validation (ISO):');
  dateTests.forEach(t => {
    const result = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(t.val) === t.expect;
    console.log(`  "${t.val}" → ${result ? '✓' : '✗ FAIL'}`);
  });
  
  const tagTests = [
    { val: 'urgent, important', expect: { dup: false, valid: true } },
    { val: 'urgent, urgent', expect: { dup: true, valid: true } },
    { val: 'CS101, ðŸŽ", office_hour', expect: { dup: false, valid: true } },
    { val: 'tag@invalid', expect: { dup: false, valid: false } }
  ];
  console.log('\nTag Validation (Unicode):');
  tagTests.forEach(t => {
    const toks = t.val.split(',').map(s => s.trim());
    const tagList = toks.join(' ');
    const hasDup = /\b(\w+)\b(?=.*\b\1\b)/.test(tagList);
    const tagRe = /^[\p{L}\p{N}\p{Emoji}_-]{1,30}$/u;
    const allValid = toks.every(tk => tagRe.test(tk));
    const result = (hasDup === t.expect.dup && allValid === t.expect.valid);
    console.log(`  "${t.val}" → ${result ? '✓' : '✗ FAIL'}`);
  });
  
  console.log('\nRegex Compiler Safety:');
  const unsafePatterns = ['.*.*.*', '(?:.*|.*)'];
  unsafePatterns.forEach(p => {
    const result = compileRegex(p) === null ? '✓ Blocked' : '✗ FAIL';
    console.log(`  "${p}" → ${result}`);
  });
  
  console.log('\n=== END TESTS ===');
}