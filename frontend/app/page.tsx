import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-4">Signal Clone</h1>
        <Link
          href="/chats"
          className="inline-block rounded-full bg-signal-blue px-6 py-3 text-white font-medium"
        >
          Enter App
        </Link>
      </div>
    </div>
  );
}