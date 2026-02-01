"use client";
import ChatInput from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { createClient } from "@/services/supabase/client";
import { Message, RoomClientProps } from "@/type";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const RoomClient = ({ room, messages, user }: RoomClientProps) => {
  const { connectedUsers, messages: realtimeMessages } = useRealtimeChat({
    roomId: room.id,
    userId: user.id,
  });

  const visibleMessages = messages.toReversed().concat(realtimeMessages);

  return (
    <div className="container mx-auto h-screen-with-header border border-y-0 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{room.name}</h1>
          <p className="text-muted-foreground text-sm">
            {connectedUsers} users online
          </p>
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
          {visibleMessages.map((m) => (
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

function useRealtimeChat({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const supabase = createClient();
    let newChannel: RealtimeChannel;
    let cancel = false;

    supabase.realtime.setAuth().then(() => {
      if (cancel) return;

      newChannel = supabase.channel(`room:${roomId}:messages`, {
        config: {
          private: true,
          presence: {
            key: userId,
          },
        },
      });

      newChannel
        .on("presence", { event: "sync" }, () => {
          setConnectedUsers(Object.keys(newChannel.presenceState()).length);
        })
        .on("broadcast", { event: "INSERT" }, (payload) => {
          const record = payload.payload;
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: record.id,
              text: record.text,
              created_at: record.created_at,
              author_id: record.author_id,
              author: {
                name: record.author_name,
                image_url: record.author_image_url,
              },
            },
          ]);
        })
        .subscribe((status) => {
          if (status !== "SUBSCRIBED") return;

          newChannel.track({ userId });
        });
    });

    return () => {
      cancel = true;
      if (!newChannel) return;
      newChannel.untrack();
      newChannel.unsubscribe();
    };
  }, [roomId, userId]);

  return { connectedUsers, messages };
}
