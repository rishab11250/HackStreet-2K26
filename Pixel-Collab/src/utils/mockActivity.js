const MOCK_ACTIONS = [
  'added a sticky note',
  'drew a shape',
  'moved an element',
  'added text',
  'drew a freehand path',
  'updated styles',
  'duplicated selection',
];

export const generateMockActivity = (mockUsers) => {
  const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
  const randomAction = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];
  
  return {
    userId: randomUser.id,
    userName: randomUser.name,
    userColor: randomUser.color,
    action: randomAction,
    timestamp: Date.now()
  };
};
