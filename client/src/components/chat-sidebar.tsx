import { Hash, Book } from "lucide-react";
import type { ChatRoom } from "@shared/schema";

interface ChatSidebarProps {
  rooms: ChatRoom[];
  selectedRoom: ChatRoom | null;
  onRoomSelect: (room: ChatRoom) => void;
}

export default function ChatSidebar({ rooms, selectedRoom, onRoomSelect }: ChatSidebarProps) {
  const universityRooms = rooms.filter(room => room.type === 'university');
  const studyGroups = rooms.filter(room => room.type === 'study_group');

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto" data-testid="chat-sidebar">
      {/* University Rooms */}
      <div className="mb-6">
        <h3 className="font-semibold text-dark-text mb-3" data-testid="text-university-rooms">
          University Rooms
        </h3>
        <div className="space-y-2">
          {universityRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedRoom?.id === room.id
                  ? 'bg-primary-blue text-white'
                  : 'hover:bg-gray-100'
              }`}
              data-testid={`room-university-${room.id}`}
            >
              <Hash size={14} className={selectedRoom?.id === room.id ? 'text-white' : 'text-neutral-gray'} />
              <span className={`text-sm font-medium ${
                selectedRoom?.id === room.id ? 'text-white' : 'text-neutral-gray'
              }`}>
                {room.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Study Groups */}
      <div>
        <h3 className="font-semibold text-dark-text mb-3" data-testid="text-study-groups">
          Study Groups
        </h3>
        <div className="space-y-2">
          {studyGroups.map((room) => (
            <button
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`w-full flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                selectedRoom?.id === room.id
                  ? 'bg-primary-blue text-white'
                  : 'hover:bg-gray-100'
              }`}
              data-testid={`room-study-${room.id}`}
            >
              <Book size={14} className={selectedRoom?.id === room.id ? 'text-white' : 'text-secondary-green'} />
              <span className={`text-sm ${
                selectedRoom?.id === room.id ? 'text-white' : 'text-neutral-gray'
              }`}>
                {room.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
