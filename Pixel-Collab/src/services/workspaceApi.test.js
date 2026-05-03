import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { inviteMember, persistMembers, searchDirectory } from './workspaceApi';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('searchDirectory', () => {
  it('returns matches for name query', async () => {
    const p = searchDirectory('sam');
    await vi.advanceTimersByTimeAsync(200);
    const { results } = await p;
    expect(results.some((r) => r.email.includes('sam'))).toBe(true);
  });

  it('returns first slice when query empty', async () => {
    const p = searchDirectory('');
    await vi.advanceTimersByTimeAsync(200);
    const { results } = await p;
    expect(results.length).toBeGreaterThan(0);
  });
});

describe('inviteMember', () => {
  it('rejects empty name', async () => {
    const p = inviteMember({ name: '  ', role: 'editor' });
    await vi.advanceTimersByTimeAsync(500);
    const res = await p;
    expect(res.error).toBeDefined();
    expect(res.member).toBeNull();
  });

  it('creates member with initials', async () => {
    const p = inviteMember({ name: 'Ada Lovelace', role: 'viewer' });
    await vi.advanceTimersByTimeAsync(500);
    const { member, error } = await p;
    expect(error).toBeUndefined();
    expect(member?.initials).toBe('AL');
    expect(member?.role).toBe('viewer');
  });
});

describe('persistMembers', () => {
  it('resolves ok for array', async () => {
    const p = persistMembers([{ id: '1', name: 'A' }]);
    await vi.advanceTimersByTimeAsync(200);
    const res = await p;
    expect(res.ok).toBe(true);
  });
});
