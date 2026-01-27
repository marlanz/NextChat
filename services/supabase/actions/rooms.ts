"use server";

import z from "zod";
import { createRoomSchema } from "../schema";
import { getCurrentUser } from "../lib/getCurrentUser";
import { createAdminClient } from "../server";
import { redirect } from "next/navigation";

export async function createRoom(unsafeData: z.infer<typeof createRoomSchema>) {
  const { success, data } = createRoomSchema.safeParse(unsafeData);

  if (!success) {
    return { error: true, message: "Invalid room data" };
  }

  const user = await getCurrentUser();
  if (user == null) {
    return { error: true, message: "User not authenticated" };
  }

  const supabase = createAdminClient();
  const { data: roomData, error: roomError } = await supabase
    .from("chat_room")
    .insert({ name: data.name, is_public: data.isPublic })
    .select("id")
    .single();

  if (roomError || roomData == null) {
    return { error: true, message: "Failed to create room" };
  }

  const { error: addMemberError } = await supabase
    .from("chat_room_member")
    .insert({ chat_room_id: roomData.id, member_id: user.id });

  if (addMemberError) {
    console.error(addMemberError);

    return {
      error: true,
      message: "Failed to add user to room",
      addMemberError,
    };
  }

  redirect(`/rooms/${roomData.id}`);
}
