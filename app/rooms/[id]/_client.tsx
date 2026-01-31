"use client";
import ChatInput from "@/components/ChatInput";
import { Message, RoomClientProps } from "@/type";

export const RoomClient = ({ room, messages, user }: RoomClientProps) => {
  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <p className="text-muted-foreground text-sm">0 users online</p>
        </div>
      </div>
      <div
        className="grow overflow-x-auto flex flex-col-reverse"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        <div className="">
          {messages.map((m) => (
            <ChatMessage key={m.id} {...m} />
          ))}
        </div>
      </div>
      <ChatInput roomId={room.id} />
    </div>
  );
};

function InviteUserModal({ roomId }: { roomId: string }) {
  return <></>;
}

function ChatMessage(message: Message) {
  return message.text;
}
