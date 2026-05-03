import { useEffect } from 'react';
import useStore from '../store/useStore';
import { generateMockActivity } from '../utils/mockActivity';

export const useMockCollaboration = () => {
  const workspaceMembers = useStore((state) => state.workspaceMembers);
  const currentUserId = useStore((state) => state.currentUserId);

  useEffect(() => {
    const timers = [];
    let bootstrap = null;

    const clearAll = () => {
      timers.forEach(clearInterval);
      timers.splice(0, timers.length);
      if (bootstrap != null) {
        clearTimeout(bootstrap);
        bootstrap = null;
      }
    };

    const restart = () => {
      clearAll();
      useStore.getState().reconcileCollaboratorMocks();
      const collaborators = useStore.getState().mockUsers;

      collaborators.forEach((user, idx) => {
        const ms = 900 + idx * 220;
        timers.push(
          setInterval(() => {
            if (Math.random() < 0.35) return;
            const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
            const h = typeof window !== 'undefined' ? window.innerHeight : 720;
            useStore.getState().updateMockCursor(user.id, {
              x: 140 + Math.random() * Math.max(240, (w - 320) * 0.72),
              y: 120 + Math.random() * Math.max(200, (h - 200) * 0.62),
            });
          }, ms)
        );
      });

      if (collaborators.length > 0) {
        timers.push(
          setInterval(() => {
            const current = useStore.getState().mockUsers;
            const event = generateMockActivity(current);
            if (!event) return;
            useStore.getState().addActivityEvent(event);
          }, 8000)
        );

        bootstrap = setTimeout(() => {
          const fresh = generateMockActivity(useStore.getState().mockUsers);
          if (fresh) useStore.getState().addActivityEvent(fresh);
          bootstrap = null;
        }, 1600);
      }
    };

    restart();

    return () => {
      clearAll();
    };
    // Restart intervals when collaborators set changes (invite/remove/switch persona)
  }, [workspaceMembers, currentUserId]);
};
