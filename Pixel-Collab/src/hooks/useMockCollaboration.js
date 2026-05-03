import { useEffect } from 'react';
import useStore from '../store/useStore';
import { generateMockActivity } from '../utils/mockActivity';

export const useMockCollaboration = () => {
  const { mockUsers, updateMockCursor, addActivityEvent } = useStore();

  useEffect(() => {
    // 1. Cursor movement timers
    const timers = mockUsers.map((user, idx) => {
      const interval = 900 + (idx * 200); 
      
      return setInterval(() => {
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

    // 2. Activity event timer using the new utility
    const activityTimer = setInterval(() => {
      const event = generateMockActivity(mockUsers);
      addActivityEvent(event);
    }, 12000); 

    return () => {
      timers.forEach(t => clearInterval(t));
      clearInterval(activityTimer);
    };
  }, [mockUsers, updateMockCursor, addActivityEvent]);
};
