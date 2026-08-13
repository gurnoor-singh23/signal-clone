"use client";

import { useEffect, useState } from "react";
import ChatRoom from "@/components/ChatRoom";
import { apiGet, getCurrentUser } from "@/lib/api";
import { useParams } from "next/navigation";

type Message = {
  id: number;
  content: string;
  sender_id: number;
  is_own: boolean;
  created_at: string;
  status: string;
};

export default function ChatPage() {
  const params = useParams();
  const id = params.id as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    apiGet(`/conversations/${id}/messages`)
      .then(setMessages)
      .catch((e) => console.error("Failed to load messages", e))
      .finally(() => setLoaded(true));
  }, [id]);

  if (!loaded) {
    return <div className="flex-1 flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  return (
    <ChatRoom
      conversationId={Number(id)}
      initialMessages={messages}
      currentUserId={currentUser?.id}
      chatName={`Conversation #${id}`}
    />
  );
}