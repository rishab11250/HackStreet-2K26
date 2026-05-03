import React from 'react';
import useStore from '../../store/useStore';

const TypingIndicator = () => {
  const { mockUsers, activityLog } = useStore();
  
  // Find users who are "typing" based on recent activity log or just pick one for mock effect
  // For the sake of "feeling alive", we'll show a random mock user typing occasionally
  const typingUser = mockUsers.find(u => activityLog.some(a => a.userId === u.id && a.type === 'text' && (Date.now() - a.timestamp < 3000)));

  if (!typingUser) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-gray-100 shadow-sm animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex gap-1">
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      <span className="text-[10px] font-medium text-gray-500">{typingUser.name} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
