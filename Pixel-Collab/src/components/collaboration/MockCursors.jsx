import useStore from '../../store/useStore';

const MockCursors = () => {
  const mockUsers = useStore((s) => s.mockUsers);
  const viewport = useStore((s) => s.viewport);
  const presentationMode = useStore((s) => s.presentationMode);

  if (presentationMode || mockUsers.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-[92] overflow-hidden" aria-hidden>
      {mockUsers.map((user) => {
        const screenX = user.cursor.x * viewport.zoom + viewport.x;
        const screenY = user.cursor.y * viewport.zoom + viewport.y;

        return (
          <div
            key={user.id}
            className="absolute will-change-[left,top] transition-all duration-300 ease-out"
            style={{
              left: screenX,
              top: screenY,
            }}
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M0 0V18.75L4.85 13.9L8.45 19.9L11.85 17.85L8.25 11.85H15.65L0 0Z" fill={user.color} />
              <path
                d="M1 2.45V16.3L4.85 12.45L5.35 12.35L8.95 18.35L10.7 17.3L7.1 11.3L6.9 10.85H13.2L1 2.45Z"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            <div
              className="ml-4 px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap shadow-sm translate-y-[-2px]"
              style={{ backgroundColor: user.color }}
            >
              {user.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MockCursors;
