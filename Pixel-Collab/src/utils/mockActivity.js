const MOCK_ACTIONS = [
  'added a sticky note',
  'drew a shape',
  'moved an element',
  'added text',
  'drew a freehand path',
  'updated styles',
  'duplicated selection',
];

/** @returns {{ userId: string, userName: string, userColor: string, action: string, timestamp: number } | null} */
export const generateMockActivity = (mockUsers) => {
  if (!mockUsers?.length) return null;
  const idx = Math.floor(Math.random() * mockUsers.length);
  const randomUser = mockUsers[idx];
  const randomAction = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];

  return {
    userId: randomUser.id,
    userName: randomUser.name,
    userColor: randomUser.color,
    action: randomAction,
    timestamp: Date.now(),
  };
};
