import * as storage from './storage.js';
import * as state from './state.js';
import * as ui from './ui.js';
import * as val from './validation.js';
import * as search from './search.js';
const addBtn = document.getElementById('add-btn');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const exportBtn = document.getElementById('export-btn');
const importFile = document.getElementById('import-file');
const itemsList = document.getElementById('items-list');
const form = document.getElementById('item-form');
const cancelBtn = document.getElementById('cancel-btn');
let editingId = null;
function uid(prefix='id') {
  return `${prefix}_${Math.random().toString(36).slice(2,9)}`;
}
function refresh(re) {
  const items = state.getItems();
  ui.renderList(items, re);
}
function loadInitial() {
  const items = state.getItems();
  if (!items || items.length === 0) {
    fetch('seed.json').then(r => r.json()).then(s => {
      if (Array.isArray(s)) {
        const norm = s.map(search.normalizeItemForRender);
        state.setItems(norm);
        refresh();
      } else {
        refresh();
      }
    }).catch(()=>refresh());
  } else refresh();
}
addBtn.addEventListener('click', () => {
  editingId = null;
  ui.clearForm();
  document.getElementById('title').focus();
});
searchInput.addEventListener('input', e => {
  const q = e.target.value.trim();
  if (q === '') {
    refresh();
    ui.announce('');
    return;
  }
  const re = val.compileRegex(q, 'iu');
  if (!re) {
    ui.announce('Invalid search pattern');
    return;
  }
  const filtered = search.filterByRegex(state.getItems(), re);
  ui.renderList(filtered, re);
  ui.announce(`${filtered.length} result${filtered.length === 1 ? '' : 's'}`);
});
itemsList.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  const action = btn.dataset.action;
  if (action === 'edit') {
    const item = state.findItem(id);
    if (!item) return;
    editingId = id;
    ui.populateForm(item);
    document.getElementById('title').focus();
  } else if (action === 'delete') {
    if (!confirm('Delete this item?')) return;
    state.deleteItem(id);
    refresh();
    ui.announce('Item deleted');
  }
});
itemsList.addEventListener('keydown', e => {
  if (e.key === 'Delete' || e.key === 'd') {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    if (!confirm('Delete this item?')) return;
    state.deleteItem(id);
    refresh();
    ui.announce('Item deleted');
  }
  if (e.key === 'Enter') {
    const li = e.target.closest('li');
    if (!li) return;
    const id = li.dataset.id;
    const item = state.findItem(id);
    if (!item) return;
    editingId = id;
    ui.populateForm(item);
    document.getElementById('title').focus();
  }
});
form.addEventListener('submit', e => {
  e.preventDefault();
  const values = {
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    date: document.getElementById('date').value ? document.getElementById('date').value : '',
    duration: document.getElementById('duration').value.trim(),
    tags: document.getElementById('tags').value
  };
  const errors = val.validateForm(values);
  const hint = document.getElementById('title-hint');
  if (Object.keys(errors).length > 0) {
    hint.textContent = Object.values(errors).join('; ');
    ui.announce('Form has errors');
    return;
  }
  hint.textContent = '';
  const payload = {
    id: editingId || uid('item'),
    title: values.title,
    description: values.description,
    date: values.date ? values.date : '',
    duration: values.duration,
    tags: search.splitTags(values.tags),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (editingId) {
    state.updateItem(editingId, Object.assign({}, payload, { updatedAt: new Date().toISOString() }));
    ui.announce('Item updated');
  } else {
    state.addItem(payload);
    ui.announce('Item created');
  }
  editingId = null;
  ui.clearForm();
  refresh();
});
cancelBtn.addEventListener('click', () => {
  editingId = null;
  ui.clearForm();
});
exportBtn.addEventListener('click', () => {
  const url = storage.exportJson(state.getItems());
  const a = document.createElement('a');
  a.href = url;
  a.download = 'campus-planner-export.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  ui.announce('Export started');
});
importFile.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  storage.importJsonFile(file).then(valid => {
    const existing = state.getItems();
    const merged = valid.concat(existing);
    state.setItems(merged);
    refresh();
    ui.announce(`${valid.length} items imported`);
  }).catch(err => {
    ui.announce('Import failed');
    alert('Import error: ' + (err && err.message ? err.message : 'unknown'));
  }).finally(() => {
    importFile.value = '';
  });
});
sortSelect.addEventListener('change', () => {
  const v = sortSelect.value;
  const items = state.getItems().slice();
  if (v === 'date') items.sort((a,b) => new Date(a.date || 0) - new Date(b.date || 0));
  if (v === 'title') items.sort((a,b) => (a.title || '').localeCompare(b.title || ''));
  if (v === 'duration') items.sort((a,b) => {
    const pa = a.duration || '00:00';
    const pb = b.duration || '00:00';
    return parseInt(pa.split(':')[0])*60 + parseInt(pa.split(':')[1]) - (parseInt(pb.split(':')[0])*60 + parseInt(pb.split(':')[1]));
  });
  state.setItems(items);
  refresh();
});
document.addEventListener('keydown', e => {
  if (e.key === 'n') {
    addBtn.click();
    e.preventDefault();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    const formEvent = new Event('submit', { cancelable: true });
    form.dispatchEvent(formEvent);
    e.preventDefault();
  }
});
loadInitial();
