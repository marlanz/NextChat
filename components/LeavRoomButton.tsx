"use client";

import React, { Component, ComponentProps, ReactNode } from "react";
import { ActionButton } from "./ui/action-button";
import { useCurrentUser } from "@/services/hooks/useCurrentUser";
import { createClient } from "@/services/supabase/client";
import { useRouter } from "next/navigation";

const LeaveRoomButton = ({
  children,
  roomId,
  ...props
}: Omit<ComponentProps<typeof ActionButton>, "action"> & {
  roomId: string;
}) => {
  const { user } = useCurrentUser();
  const router = useRouter();

  const handleLeaveRoom = async () => {
    if (user == null) {
      return { error: true, message: "User not logged in" };
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("chat_room_member")
      .delete()
      .eq("chat_room_id", roomId)
      .eq("member_id", user.id);

    if (error) {
      return { error: true, message: "Failed to leave room" };
    }

    router.refresh();
    // router.push(`/rooms/${roomId}`);
    return { error: false };
  };

  return (
    <ActionButton {...props} action={handleLeaveRoom}>
      {children}
    </ActionButton>
  );
};

export default LeaveRoomButton;
