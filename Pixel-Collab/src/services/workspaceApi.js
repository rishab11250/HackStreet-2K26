/**
 * Workspace / members API — persists to sessionStorage with optional latency
 * to mimic network. Swap implementations here for a real backend.
 */

import { saveMembersToStorage } from '../utils/workspaceStorage';

const SIMULATED_LATENCY_MS = 180;

const delay = (ms = SIMULATED_LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Mock directory for "invite" search */
export const MOCK_DIRECTORY = [
  { id: 'dir-1', name: 'Jordan Lee', email: 'jordan@example.com', role: 'editor' },
  { id: 'dir-2', name: 'Sam Rivera', email: 'sam@example.com', role: 'viewer' },
  { id: 'dir-3', name: 'Taylor Kim', email: 'taylor@example.com', role: 'editor' },
  { id: 'dir-4', name: 'Riley Chen', email: 'riley@example.com', role: 'viewer' },
  { id: 'dir-5', name: 'Morgan Patel', email: 'morgan@example.com', role: 'editor' },
];

/**
 * @param {string} query
 * @returns {Promise<{ results: typeof MOCK_DIRECTORY, error?: string }>}
 */
export async function searchDirectory(query) {
  await delay(120);
  const q = (query || '').trim().toLowerCase();
  if (!q) return { results: MOCK_DIRECTORY.slice(0, 5) };
  const results = MOCK_DIRECTORY.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
  );
  return { results };
}

/**
 * @param {{ name: string, email?: string, role: string, color?: string }} member
 * @returns {Promise<{ member: object, error?: string }>}
 */
export async function inviteMember(member) {
  await delay();
  if (!member?.name?.trim()) {
    return { member: null, error: 'Name is required' };
  }
  const initials = member.name
    .split(/\s+/)
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const invited = {
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: member.name.trim(),
    email: member.email || '',
    role: member.role || 'editor',
    color: member.color || '#5B6AF0',
    initials,
    online: true,
  };
  return { member: invited };
}

/**
 * @param {object[]} members
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function persistMembers(members) {
  await delay(80);
  try {
    saveMembersToStorage(members);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

/**
 * @param {string} memberId
 * @param {string} role
 * @returns {Promise<{ ok: boolean, error?: string }>}
 */
export async function updateMemberRoleApi(memberId, role) {
  await delay(100);
  if (!memberId || !role) return { ok: false, error: 'Invalid payload' };
  return { ok: true };
}
