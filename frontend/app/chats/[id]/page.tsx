import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";
import { apiGet } from "@/lib/api";

type Message = {
  id: number;
  content: string;
  sender_id: number;
  is_own: boolean;
  created_at: string;
  status: string;
};

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let messages: Message[] = [];
  try {
    messages = await apiGet(`/conversations/${id}/messages`);
  } catch (e) {
    console.error("Failed to load messages", e);
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader name={`Conversation #${id}`} status="online" />
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 mt-8">No messages yet</div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              content={m.content}
              time={new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              isOwn={m.is_own}
              status={m.status as "sent" | "delivered" | "read"}
            />
          ))
        )}
      </div>
      <div className="p-3 border-t border-signal-border">
        <input
          type="text"
          placeholder="Type a message"
          className="w-full rounded-full bg-signal-dark px-4 py-2 text-sm outline-none border border-signal-border"
        />
      </div>
    </div>
  );
}