import ChatRoom from "@/components/ChatRoom";
import { apiGet } from "@/lib/api";

type Message = {
  id: number;
  content: string;
  sender_id: number;
  is_own: boolean;
  created_at: string;
  status: string;
};

const CURRENT_USER_ID = 2; // Priya's user_id — temporary, replace once real login exists

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let messages: Message[] = [];
  try {
    messages = await apiGet(`/conversations/${id}/messages`);
  } catch (e) {
    console.error("Failed to load messages", e);
  }

  return (
    <ChatRoom
      conversationId={Number(id)}
      initialMessages={messages}
      currentUserId={CURRENT_USER_ID}
      chatName={`Conversation #${id}`}
    />
  );
}