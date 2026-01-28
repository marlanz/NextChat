export interface RoomListProps {
  title: string;
  rooms: {
    id: string;
    name: string;
    memberCount: number;
  }[];
  isJoined?: boolean;
}

interface RoomCardProps {
  id: string;
  name: string;
  memberCount: number;
  isJoined?: boolean;
}
