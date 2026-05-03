const KEYS = {
  members: 'pixel-collab:workspace-members',
  theme: 'pixel-collab:theme',
  gridSnap: 'pixel-collab:grid-snap-size',
  presentation: 'pixel-collab:presentation',
};

export function loadStoredMembers() {
  try {
    const raw = sessionStorage.getItem(KEYS.members);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveMembersToStorage(members) {
  try {
    sessionStorage.setItem(KEYS.members, JSON.stringify(members));
  } catch {
    /* quota / private mode */
  }
}

export function loadThemePreference() {
  try {
    return localStorage.getItem(KEYS.theme);
  } catch {
    return null;
  }
}

export function saveThemePreference(mode) {
  try {
    localStorage.setItem(KEYS.theme, mode);
  } catch {
    /* ignore */
  }
}

export function loadGridSnapSize() {
  try {
    const v = sessionStorage.getItem(KEYS.gridSnap);
    return v != null ? parseInt(v, 10) : null;
  } catch {
    return null;
  }
}

export function saveGridSnapSize(n) {
  try {
    sessionStorage.setItem(KEYS.gridSnap, String(n));
  } catch {
    /* ignore */
  }
}

export function loadPresentationFlag() {
  try {
    return sessionStorage.getItem(KEYS.presentation) === '1';
  } catch {
    return false;
  }
}

export function savePresentationFlag(on) {
  try {
    sessionStorage.setItem(KEYS.presentation, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}
