import { useEffect } from 'react';
import useStore from '../store/useStore';
import { generateMockActivity } from '../utils/mockActivity';

export const useMockCollaboration = () => {
  const { updateMockCursor, addActivityEvent } = useStore();
  const mockUsers = useStore.getState().mockUsers;

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

    // Initial event to show it's working
    const initialEvent = generateMockActivity(mockUsers);
    addActivityEvent(initialEvent);

    // 2. Activity event timer using the new utility
    // Reduced interval to 8 seconds for more "action"
    const activityTimer = setInterval(() => {
      const currentMockUsers = useStore.getState().mockUsers;
      const event = generateMockActivity(currentMockUsers);
      addActivityEvent(event);
    }, 8000); 

    return () => {
      timers.forEach(t => clearInterval(t));
      clearInterval(activityTimer);
    };
  }, [updateMockCursor, addActivityEvent]); // eslint-disable-line react-hooks/exhaustive-deps -- demo timers use initial mockUsers snapshot
};
