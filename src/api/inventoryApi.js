// src/api/inventoryApi.js
// ─── Central API layer for FabLab Inventory ────────────────────────

export const BASE_URL =
  'https://script.google.com/macros/s/AKfycbyyLfvcQZ4Ml-lexk4HXPFbRDqAQzcbDAKrhQGl4P29a4TwQ_PmH54xYQLP63AMcvlt7g/exec';

// ── Generic POST helper ──────────────────────────────────────────────
async function post(payload) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    redirect: 'follow',
  });

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

  const json = await res.json();
  if (json.status === 'error') throw new Error(json.msg || 'Server error');

  return { data: json };
}

// ── 1. Inventory (GET) ───────────────────────────────────────────────
// Fetches the live component list for the library grid
export async function getInventory() {
  const res = await fetch(BASE_URL, { method: 'GET', redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const json = await res.json();
  return { data: Array.isArray(json) ? json : [] };
}

// ── 2. Take / Borrow components ────────────────────────────────────────
// Logic: Submits as "Taken" if in stock, "Waitlist" otherwise
export async function takeComponents(formData) {
  return post({ action: 'request', ...formData });
}

// ── 3. Return components ───────────────────────────────────────────────
// Logic: Marks status as "Returned" and restores stock quantity
export async function returnComponents(id) {
  return post({ action: 'updateStatus', id, newStatus: 'Returned' });
}

// ── 4. Lookup requests (Enhanced Search) ─────────────────────────────
// Supports searching by Name, Email, or Request ID
export async function lookupRequests(query) {
  return post({ action: 'lookup', query });
}

// ── 5. EVE Bot: Quick Stock Check ────────────────────────────────────
// Specifically for the AI chat widget to answer availability questions
export async function checkStock(itemName) {
  return post({ action: 'checkStock', item: itemName });
}

// ── 6. Contact Us / Support ──────────────────────────────────────────
// Sends a direct email notification to the owner (prembagya822@gmail.com)
export async function sendContactMessage(contactData) {
  return post({ action: 'contact', ...contactData });
}

// ── 7. Admin Dashboard Data ──────────────────────────────────────────
export async function getRequests() {
  return post({ action: 'getAll' });
}

export async function getRequestById(id) {
  return post({ action: 'getById', id });
}