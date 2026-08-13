import Link from "next/link";

type Props = {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  active?: boolean;
  href?: string;
};

export default function ConversationListItem({ name, lastMessage, time, unread, active, href = "/chats/demo" }: Props) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-signal-dark/50 ${
        active ? "bg-signal-dark" : ""
      }`}
    >
      <div className="h-12 w-12 rounded-full bg-signal-blue flex items-center justify-center text-white font-semibold shrink-0">
        {name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{name}</span>
          <span className="text-xs text-zinc-500 shrink-0">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-sm text-zinc-400 truncate">{lastMessage}</span>
          {unread ? (
            <span className="bg-signal-blue text-white text-xs rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shrink-0">
              {unread}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}