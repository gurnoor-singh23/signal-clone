const API_URL = "http://127.0.0.1:8000";

// Temporary hardcoded token for testing — replace with real login flow later.
// Paste YOUR actual token from the verify-otp response here.
export const TEMP_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzg3MjMzODA2fQ.4WcXy3CPrSsOHLCoJGkGfSzEppbR2Si3j_q3rwfRsk8";

export async function apiGet(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${TEMP_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}