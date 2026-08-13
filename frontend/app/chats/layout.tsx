export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left pane - conversation list */}
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
          {/* Conversation list items will go here */}
          <div className="px-4 py-8 text-center text-sm text-zinc-500">
            No conversations yet
          </div>
        </div>
      </div>

      {/* Right pane - active chat */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}