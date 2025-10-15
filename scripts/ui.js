import { highlight as hl, escapeHtml } from './validation.js';
import { normalizeItemForRender } from './search.js';
const list = document.getElementById('items-list');
const emptyState = document.getElementById('empty-state');
const live = document.getElementById('live');
export function renderList(items, re) {
  list.innerHTML = '';
  if (!items || items.length === 0) {
    emptyState.hidden = false;
    return;
  } else {
    emptyState.hidden = true;
  }
  items.forEach(item => {
    const safe = normalizeItemForRender(item);
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.className = 'planner-item';
    li.dataset.id = safe.id;
    const t = hl(safe.title || '', re);
    const d = hl(safe.description || '', re);
    const dt = safe.date ? new Date(safe.date).toLocaleString() : '';
    const tags = (safe.tags || []).map(tg => `<span class="tag">${escapeHtml(tg)}</span>`).join(' ');
    li.innerHTML = `
      <div class="item-head">
        <strong>${t}</strong>
        <small>${escapeHtml(dt)}</small>
      </div>
      <div class="item-body">${d}</div>
      <div class="item-tags">${tags}</div>
      <div class="item-actions">
        <button data-action="edit" aria-label="Edit ${escapeHtml(safe.title)}">Edit</button>
        <button data-action="delete" aria-label="Delete ${escapeHtml(safe.title)}">Delete</button>
      </div>
    `;
    li.classList.add('item-enter');
    list.appendChild(li);
  });
}
export function announce(message) {
  live.textContent = message;
}
export function focusItemById(id) {
  const el = list.querySelector(`[data-id="${id}"]`);
  if (el) el.focus();
}
export function clearForm() {
  document.getElementById('item-form').reset();
  document.getElementById('title-hint').textContent = '';
}
export function populateForm(item) {
  document.getElementById('title').value = item.title || '';
  document.getElementById('description').value = item.description || '';
  if (item.date) document.getElementById('date').value = item.date.slice(0,16);
  document.getElementById('duration').value = item.duration || '';
  const tags = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
  document.getElementById('tags').value = tags;
}
