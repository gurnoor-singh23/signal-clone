import ChatHeader from "@/components/ChatHeader";
import MessageBubble from "@/components/MessageBubble";

const fakeMessages = [
  { content: "Hey, how's it going?", time: "2:10 PM", isOwn: false },
  { content: "Good! Working on the assignment", time: "2:11 PM", isOwn: true, status: "read" as const },
  { content: "Nice, good luck!", time: "2:12 PM", isOwn: false },
];

export default function DemoChatPage() {
  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader name="Priya Singh" status="online" />
      <div className="flex-1 overflow-y-auto py-4">
        {fakeMessages.map((m, i) => (
          <MessageBubble key={i} {...m} />
        ))}
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