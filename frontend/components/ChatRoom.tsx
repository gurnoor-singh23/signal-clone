"use client";

import { useEffect, useState, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import { connectWS, onWSMessage, sendWS } from "@/lib/ws";
import { getToken } from "@/lib/api";

type Message = {
  id: number;
  content: string;
  sender_id: number;
  is_own: boolean;
  created_at: string;
  status: string;
};

export default function ChatRoom({
  conversationId,
  initialMessages,
  currentUserId,
  chatName,
}: {
  conversationId: number;
  initialMessages: Message[];
  currentUserId: number;
  chatName: string;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = getToken();
  if (token) connectWS(token);
    const unsubscribe = onWSMessage((data) => {
  if (data.type === "message" && data.conversation_id === conversationId) {
    setMessages((prev) => {
      if (prev.some((m) => m.id === data.id)) {
        return prev; // already have this message, skip duplicate
      }
      return [
        ...prev,
        {
          id: data.id,
          content: data.content,
          sender_id: data.sender_id,
          is_own: data.sender_id === currentUserId,
          created_at: data.created_at,
          status: data.status,
        },
      ];
    });
  }
});
    return unsubscribe;
  }, [conversationId, currentUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    if (!input.trim()) return;
    sendWS({ type: "message", conversation_id: conversationId, content: input });
    setInput("");
  }

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <ChatHeader name={chatName} status="online" />
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-0.5 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-zinc-500 mt-8">No messages yet</div>
        ) : (
          messages.map((m) => (
            <MessageBubble
              key={m.id}
              content={m.content}
              time={new Date(m.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              isOwn={m.is_own}
              status={m.status as "sent" | "delivered" | "read"}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t border-signal-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message"
          className="flex-1 rounded-full bg-signal-dark px-4 py-2 text-sm outline-none border border-signal-border"
        />
        <button
          onClick={handleSend}
          className="rounded-full bg-signal-blue px-5 py-2 text-sm font-medium text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}