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

interface RoomClientProps {
  user: {
    id: string;
    name: string;
    image_url: string | null;
  };
  room: {
    id: string;
    name: string;
  };
  messages: Message[];
}

interface Message {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  author: {
    name: string;
    image_url: string | null;
  };
}
