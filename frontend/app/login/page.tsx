"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, setToken, setCurrentUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/register", { phone, display_name: displayName || "New User" }, false);
      setStep("otp");
    } catch (e) {
      setError("Failed to send OTP. Check your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    setError("");
    setLoading(true);
    try {
      const res = await apiPost("/auth/verify-otp", { phone, otp }, false);
      setToken(res.token);
      setCurrentUser(res.user);
      router.push("/chats");
    } catch (e) {
      setError("Invalid OTP. Try 123456.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background text-foreground">
      <div className="w-full max-w-sm p-6">
        <h1 className="text-2xl font-semibold mb-1 text-center">Signal Clone</h1>
        <p className="text-sm text-zinc-500 text-center mb-6">
          {step === "phone" ? "Enter your phone number to continue" : "Enter the OTP sent to your phone"}
        </p>

        {step === "phone" ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Phone number (e.g. +911111111112)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg bg-signal-panel px-4 py-3 text-sm outline-none border border-signal-border"
            />
            <input
              type="text"
              placeholder="Display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="rounded-lg bg-signal-panel px-4 py-3 text-sm outline-none border border-signal-border"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !phone}
              className="rounded-full bg-signal-blue px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Enter OTP (hint: 123456)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="rounded-lg bg-signal-panel px-4 py-3 text-sm outline-none border border-signal-border"
            />
            <button
              onClick={handleVerify}
              disabled={loading || !otp}
              className="rounded-full bg-signal-blue px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </div>
        )}

        {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}