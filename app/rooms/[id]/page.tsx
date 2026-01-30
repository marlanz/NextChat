import { getCurrentUser } from "@/services/supabase/lib/getCurrentUser";
import { createAdminClient } from "@/services/supabase/server";
import React from "react";

const RoomPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return <div>page</div>;
};

export default RoomPage;

async function getRoom(id: string) {
  const user = await getCurrentUser();
  if (user == null) return null;

  const supabase = await createAdminClient();
  const { data: room, error } = await supabase
    .from("chat_room")
    .select("id, name, chat_room_member!inner ()")
    .eq("id", id)
    .eq("chat_room_member.member_id", user.id)
    .single();

  if (error) return null;
  return room;
}

async function getUser() {
  const user = await getCurrentUser();
  const supabase = await createAdminClient();
  if (user == null) return null;

  const { data, error } = await supabase
    .from("user_profile")
    .select("id, name, image_url")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data;
}

async function getMessages(roomId: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("message")
    .select(
      "id, text, created_at, author_id, author:user_profiles (name, image_url)",
    )
    .eq("chat_room_id", roomId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return [];
  return data;
}
