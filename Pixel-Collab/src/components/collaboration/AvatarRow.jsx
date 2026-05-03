import useStore from '../../store/useStore';

const AvatarRow = () => {
  const mockUsers = useStore((state) => state.mockUsers);

  return (
    <div className="flex items-center -space-x-2 mr-2">
      {mockUsers.map((user) => (
        <div 
          key={user.id}
          className="relative group cursor-help"
        >
          <div 
            className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-transform hover:scale-110 hover:z-10"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#4CAF7D] border-2 border-white rounded-full" />
          
          {/* Tooltip */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            {user.name} (Online)
          </div>
        </div>
      ))}
      <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 hover:bg-gray-200 cursor-pointer transition-colors shadow-sm">
        +2
      </div>
    </div>
  );
};

export default AvatarRow;
