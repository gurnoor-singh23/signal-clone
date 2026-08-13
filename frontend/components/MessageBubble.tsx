type Props = {
  content: string;
  time: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
};

export default function MessageBubble({ content, time, isOwn, status }: Props) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-4 py-0.5`}>
      <div
        className={`max-w-[65%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-signal-bubble-out text-white rounded-br-md"
            : "bg-signal-bubble-in text-white rounded-bl-md"
        }`}
      >
        <p className="text-sm">{content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] opacity-70">{time}</span>
          {isOwn && status && (
            <span className="text-[10px] opacity-70">
              {status === "read" ? "✓✓" : status === "delivered" ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}