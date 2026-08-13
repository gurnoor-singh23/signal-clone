"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";

const SEEDED_USERS = [
  { id: 1, name: "Aarav Mehta" },
  { id: 2, name: "Priya Singh" },
  { id: 3, name: "Rohan Gupta" },
  { id: 4, name: "Sneha Kapoor" },
  { id: 5, name: "Vikram Rao" },
];

export default function NewGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleMember(id: number) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleCreate() {
    if (!name.trim() || selected.length === 0) return;
    setLoading(true);
    try {
      await apiPost("/conversations", { type: "group", name, member_ids: selected });
      onCreated();
    } catch (e) {
      console.error("Failed to create group", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-signal-panel rounded-xl w-full max-w-sm p-5 border border-signal-border">
        <h2 className="text-lg font-semibold mb-4">New Group</h2>

        <input
          type="text"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-signal-dark px-4 py-2 text-sm outline-none border border-signal-border mb-4"
        />

        <p className="text-xs text-zinc-500 mb-2">Select members</p>
        <div className="max-h-48 overflow-y-auto flex flex-col gap-1 mb-4">
          {SEEDED_USERS.map((u) => (
            <label
              key={u.id}
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-signal-dark/50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(u.id)}
                onChange={() => toggleMember(u.id)}
              />
              <span className="text-sm">{u.name}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm border border-signal-border"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading || !name.trim() || selected.length === 0}
            className="px-4 py-2 rounded-full text-sm bg-signal-blue text-white disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}