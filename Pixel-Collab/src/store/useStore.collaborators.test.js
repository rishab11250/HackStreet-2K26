import { beforeEach, describe, expect, it } from 'vitest';
import useStore, { buildCollaboratorMockUsers } from './useStore';

describe('buildCollaboratorMockUsers', () => {
  it('excludes the current user and preserves prior cursor positions', () => {
    const members = [
      { id: 'a', name: 'Ada', initials: 'AD', role: 'owner', color: '#f00', online: true },
      { id: 'b', name: 'Ben', initials: 'BE', role: 'editor', color: '#0f0', online: true },
    ];
    const previous = [
      { id: 'b', name: 'Ben', initials: 'BE', color: '#0f0', cursor: { x: 501, y: 402 } },
    ];
    const mocks = buildCollaboratorMockUsers(members, 'a', previous);
    expect(mocks).toHaveLength(1);
    expect(mocks[0].id).toBe('b');
    expect(mocks[0].cursor).toEqual({ x: 501, y: 402 });
  });
});

describe('updateCurrentUserProfile', () => {
  beforeEach(() => {
    useStore.setState({
      workspaceMembers: [
        { id: 'me', name: 'Alex', email: '', role: 'owner', color: '#111', initials: 'AL', online: true },
      ],
      currentUserId: 'me',
      activityLog: [],
    });
  });

  it('renames current user, initials, and persists activity', () => {
    useStore.getState().updateCurrentUserProfile({ name: 'Alex Rivers' });
    const m = useStore.getState().workspaceMembers[0];
    expect(m.name).toBe('Alex Rivers');
    expect(m.initials).toBe('AR');
    expect(useStore.getState().activityLog[0]?.kind).toBe('profile');
  });
});

describe('workspace member invitations', () => {
  beforeEach(() => {
    useStore.setState({
      workspaceMembers: [
        { id: 'me', name: 'Me', email: '', role: 'owner', color: '#111', initials: 'ME', online: true },
        { id: 'p', name: 'Peer', email: '', role: 'editor', color: '#222', initials: 'PE', online: true },
      ],
      currentUserId: 'me',
      activityLog: [],
    });
    useStore.getState().reconcileCollaboratorMocks();
  });

  it('addWorkspaceMember exposes a synthetic cursor for the newcomer', () => {
    expect(useStore.getState().mockUsers.map((u) => u.id)).toEqual(['p']);

    useStore.getState().addWorkspaceMember({
      id: 'new',
      name: 'Nia',
      email: 'nia@example.com',
      role: 'viewer',
      color: '#5B6AF0',
      initials: 'NI',
      online: true,
    });

    const ids = useStore.getState().mockUsers.map((u) => u.id).sort();
    expect(ids).toEqual(['new', 'p']);

    expect(useStore.getState().activityLog[0]?.kind).toBe('member');
  });
});
