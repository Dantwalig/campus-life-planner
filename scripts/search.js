export function filterByRegex(items, re) {
  if (!re) return items;
  return items.filter(it => re.test(it.title || '') || re.test(it.description || '') || (Array.isArray(it.tags) && it.tags.some(t => re.test(t))));
}
export function splitTags(s) {
  if (!s) return [];
  return s.split(',').map(t => t.trim()).filter(Boolean);
}
export function normalizeItemForRender(item) {
  const tags = Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? splitTags(item.tags) : []);
  return Object.assign({}, item, { tags });
}
