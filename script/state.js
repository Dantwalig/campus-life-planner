import { load, save } from './storage.js';
let items = load();
export const getItems = () => items.slice();
export const setItems = newItems => {
  items = Array.isArray(newItems) ? newItems.slice() : [];
  save(items);
};
export const addItem = item => {
  items.unshift(item);
  save(items);
};
export const updateItem = (id, patch) => {
  items = items.map(i => i.id === id ? Object.assign({}, i, patch) : i);
  save(items);
};
export const deleteItem = id => {
  items = items.filter(i => i.id !== id);
  save(items);
};
export const findItem = id => items.find(i => i.id === id);
