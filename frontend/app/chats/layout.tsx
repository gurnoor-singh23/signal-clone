import ConversationListItem from "@/components/ConversationListItem";
import { apiGet } from "@/lib/api";

type Conversation = {
  id: number;
  type: string;
  name: string;
  last_message: string | null;
  last_message_at: string;
};

export default async function ChatsLayout({ children }: { children: React.ReactNode }) {
  let conversations: Conversation[] = [];
  try {
    conversations = await apiGet("/conversations");
  } catch (e) {
    console.error("Failed to load conversations", e);
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <div className="w-[380px] border-r border-signal-border flex flex-col bg-signal-panel">
        <div className="p-4 border-b border-signal-border flex items-center justify-between">
          <h1 className="text-xl font-semibold">Chats</h1>
        </div>
        <div className="p-3">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-signal-dark px-4 py-2 text-sm outline-none border border-signal-border"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No conversations yet
            </div>
          ) : (
            conversations.map((c) => (
              <ConversationListItem
                key={c.id}
                name={c.name}
                lastMessage={c.last_message || "No messages yet"}
                time={new Date(c.last_message_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                href={`/chats/${c.id}`}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}