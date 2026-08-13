import ConversationListItem from "@/components/ConversationListItem";

const fakeConversations = [
  { name: "Priya Singh", lastMessage: "Good! Working on the assignment", time: "2:14 PM", unread: 2 },
  { name: "Rohan Gupta", lastMessage: "See you tomorrow!", time: "1:02 PM" },
  { name: "Project Squad", lastMessage: "Sneha: sounds good", time: "11:45 AM", unread: 5 },
  { name: "Vikram Rao", lastMessage: "Thanks a lot 🙌", time: "Yesterday" },
];

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
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
          {fakeConversations.map((c) => (
            <ConversationListItem key={c.name} {...c} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}