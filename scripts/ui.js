import { highlight as hl, escapeHtml } from './validation.js';
import { normalizeItemForRender } from './search.js';

const list = document.getElementById('items-list');
const emptyState = document.getElementById('empty-state');
const live = document.getElementById('live');
const liveAssertive = document.getElementById('live-assertive');
const settingsModal = document.getElementById('settings-modal');

let settings = {
  durationUnit: 'hours',
  weeklyCapMinutes: null
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem('app:settings');
    if (raw) settings = Object.assign({}, settings, JSON.parse(raw));
  } catch (e) {
    console.error('Settings load error:', e);
  }
}

export function saveSettings() {
  try {
    localStorage.setItem('app:settings', JSON.stringify(settings));
  } catch (e) {
    console.error('Settings save error:', e);
  }
}

export function getSettings() {
  return Object.assign({}, settings);
}

export function updateSettings(newSettings) {
  settings = Object.assign({}, settings, newSettings);
  saveSettings();
}

function calculateStats(items) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const total = items.length;
  
  const thisWeek = items.filter(it => {
    const itemDate = it.date ? new Date(it.date) : null;
    return itemDate && itemDate >= sevenDaysAgo && itemDate <= now;
  }).length;
  
  const tagCounts = {};
  items.forEach(it => {
    (it.tags || []).forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTag = Object.entries(tagCounts).length > 0
    ? Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0][0]
    : '–';
  
  let totalMinutes = 0;
  items.forEach(it => {
    if (it.duration) {
      const [h, m] = it.duration.split(':').map(Number);
      totalMinutes += h * 60 + m;
    }
  });
  
  const totalDurationText = settings.durationUnit === 'hours'
    ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
    : `${totalMinutes}m`;
  
  const dailyCounts = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    dailyCounts[dateStr] = 0;
  }
  
  items.forEach(it => {
    if (it.date) {
      const itemDateStr = it.date.split('T')[0];
      if (itemDateStr in dailyCounts) {
        dailyCounts[itemDateStr]++;
      }
    }
  });
  
  return {
    total,
    thisWeek,
    topTag,
    totalDurationText,
    totalMinutes,
    weeklyCapMinutes: settings.weeklyCapMinutes,
    dailyCounts
  };
}

export function renderStats(items) {
  const stats = calculateStats(items);
  
  document.getElementById('stat-total').textContent = stats.total;
  document.getElementById('stat-week').textContent = stats.thisWeek;
  document.getElementById('stat-top-tag').textContent = escapeHtml(stats.topTag);
  document.getElementById('stat-total-duration').textContent = stats.totalDurationText;
 
  renderTrendChart(stats.dailyCounts);
  
  const capMsg = document.getElementById('cap-message');
  if (stats.weeklyCapMinutes) {
    if (stats.totalMinutes > stats.weeklyCapMinutes) {
      const overage = stats.totalMinutes - stats.weeklyCapMinutes;
      const msg = `⚠ You've exceeded your weekly cap by ${overage} minutes`;
      capMsg.textContent = msg;
      capMsg.classList.remove('hidden');
      capMsg.setAttribute('aria-live', 'assertive');
      liveAssertive.textContent = msg;
    } else {
      const remaining = stats.weeklyCapMinutes - stats.totalMinutes;
      const msg = `You have ${remaining} minutes remaining in your weekly cap`;
      capMsg.textContent = msg;
      capMsg.classList.add('hidden');
      capMsg.setAttribute('aria-live', 'polite');
      live.textContent = msg;
    }
  } else {
    capMsg.classList.add('hidden');
  }
}

function renderTrendChart(dailyCounts) {
  const container = document.getElementById('trend-chart');
  if (!container) return;
  
  const dates = Object.keys(dailyCounts).sort();
  const maxCount = Math.max(...Object.values(dailyCounts), 1);
  
  let html = '<div class="chart-bars" aria-label="7-day task trend">';
  
  dates.forEach(dateStr => {
    const count = dailyCounts[dateStr];
    const percentage = (count / maxCount) * 100;
    const d = new Date(dateStr + 'T00:00:00');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    
    html += `
      <div class="chart-bar" title="${dateStr}: ${count} task${count !== 1 ? 's' : ''}">
        <div class="bar-fill" style="height: ${percentage}%;" aria-label="${dayName}: ${count} task${count !== 1 ? 's' : ''}"></div>
        <div class="bar-label">${dayName}</div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

export function initSettingsModal() {
  const settingsBtn = document.getElementById('settings-btn');
  const closeBtn = document.getElementById('close-settings');
  const modalCancel = document.getElementById('modal-cancel');
  const settingsForm = document.getElementById('settings-form');
  
  settingsBtn.addEventListener('click', () => {
    const durationRadios = document.querySelectorAll('input[name="duration-unit"]');
    durationRadios.forEach(r => {
      r.checked = r.value === settings.durationUnit;
    });
    
    const capInput = document.getElementById('cap-input');
    capInput.value = settings.weeklyCapMinutes ? settings.weeklyCapMinutes : '';
    
    settingsModal.showModal();
  });
  
  closeBtn.addEventListener('click', () => settingsModal.close());
  modalCancel.addEventListener('click', () => settingsModal.close());
  
  settingsForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const unit = document.querySelector('input[name="duration-unit"]:checked').value;
    const capInput = document.getElementById('cap-input');
    const cap = capInput.value ? parseInt(capInput.value, 10) : null;
    
    updateSettings({
      durationUnit: unit,
      weeklyCapMinutes: cap
    });
    
    announce('Settings saved');
    settingsModal.close();
  });
}

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
  document.getElementById('date-hint').textContent = '';
  document.getElementById('duration-hint').textContent = '';
  document.getElementById('tags-hint').textContent = '';
}

export function populateForm(item) {
  document.getElementById('title').value = item.title || '';
  document.getElementById('description').value = item.description || '';
  if (item.date) document.getElementById('date').value = item.date.slice(0,16);
  document.getElementById('duration').value = item.duration || '';
  const tags = Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || '');
  document.getElementById('tags').value = tags;
}

export function showFormErrors(errors) {
  document.getElementById('title-hint').textContent = errors.title || '';
  document.getElementById('date-hint').textContent = errors.date || '';
  document.getElementById('duration-hint').textContent = errors.duration || '';
  document.getElementById('tags-hint').textContent = errors.tags || '';
}