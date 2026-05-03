import { useEffect } from 'react';
import useStore from '../store/useStore';

const MOCK_ACTIONS = [
  'added a sticky note',
  'drew a shape',
  'moved an element',
  'added text',
  'drew a freehand path',
  'updated styles',
  'duplicated selection',
];

export const useMockCollaboration = () => {
  const { mockUsers, updateMockCursor, addActivityEvent } = useStore();

  useEffect(() => {
    // Cursor movement timers
    const timers = mockUsers.map((user, idx) => {
      const interval = 900 + (idx * 200); // 900ms, 1100ms, 1300ms
      
      return setInterval(() => {
        // 30% chance to stay in place (simulate reading)
        if (Math.random() < 0.3) return;

        const canvasWidth = window.innerWidth - 56;
        const canvasHeight = window.innerHeight - 52;
        
        const newPos = {
          x: 100 + Math.random() * (canvasWidth - 200),
          y: 100 + Math.random() * (canvasHeight - 200)
        };
        
        updateMockCursor(user.id, newPos);
      }, interval);
    });

    // Activity event timer
    const activityTimer = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomAction = MOCK_ACTIONS[Math.floor(Math.random() * MOCK_ACTIONS.length)];
      
      addActivityEvent({
        userId: randomUser.id,
        userName: randomUser.name,
        userColor: randomUser.color,
        action: randomAction,
        timestamp: Date.now()
      });
    }, 12000); // Every 12 seconds

    return () => {
      timers.forEach(t => clearInterval(t));
      clearInterval(activityTimer);
    };
  }, [mockUsers, updateMockCursor, addActivityEvent]);
};
