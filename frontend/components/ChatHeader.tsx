type Props = {
  name: string;
  status: string;
};

export default function ChatHeader({ name, status }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-signal-border bg-signal-panel">
      <div className="h-10 w-10 rounded-full bg-signal-blue flex items-center justify-center text-white font-semibold">
        {name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-zinc-500">{status}</div>
      </div>
    </div>
  );
}