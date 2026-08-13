import Link from "next/link";
import { ArrowLeft, Bell, Lock, Palette, Phone, Video, Link2 } from "lucide-react";

const items = [
  { icon: Lock, label: "Privacy", desc: "Coming soon" },
  { icon: Bell, label: "Notifications", desc: "Coming soon" },
  { icon: Palette, label: "Appearance", desc: "Coming soon" },
  { icon: Phone, label: "Voice & Video Calls", desc: "Coming soon" },
  { icon: Video, label: "Stories", desc: "Coming soon" },
  { icon: Link2, label: "Linked Devices", desc: "Coming soon" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/chats" className="p-2 rounded-full hover:bg-signal-dark/50">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>
      <div className="flex flex-col gap-1">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-signal-panel">
            <item.icon size={20} className="text-signal-blue" />
            <div>
              <div className="text-sm font-medium">{item.label}</div>
              <div className="text-xs text-zinc-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}