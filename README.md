# Signal Clone

A functional clone of Signal's messaging experience — real-time 1-on-1 and group chat, mocked auth, message delivery/read receipts, built as a fullstack assignment.

## Tech Stack
- Frontend: Next.js 16 (TypeScript, App Router), Tailwind CSS v4
- Backend: FastAPI, SQLAlchemy, SQLite
- Real-time: native WebSockets

## Architecture Overview
The frontend is a Next.js app using client components for anything interactive (chat rooms, login, group creation) since these need browser APIs (WebSocket, localStorage). The backend is a FastAPI app exposing REST endpoints for auth/conversations/contacts, plus a single WebSocket endpoint (`/ws`) that handles real-time message send, typing events, and read receipts. On login, the frontend stores a JWT in localStorage and attaches it to every REST call (`Authorization: Bearer`) and the WebSocket connection (`?token=`). The WebSocket connection manager keeps an in-memory map of `user_id -> active sockets`, and every event (new message, read receipt) is persisted to SQLite first, then broadcast to every member of that conversation who's currently connected.

## Database Schema
- **users** — phone, display_name, avatar, online status
- **contacts** — links a user to another user they've added
- **conversations** — either `direct` or `group`, with a name (used for groups; null for direct chats, where the UI derives the display name from the other member)
- **conversation_members** — join table between users and conversations, also carries `role` (admin/member) for group permission checks
- **messages** — content, sender, conversation, timestamp, status
- **message_receipts** — per-recipient delivery/read status, kept separate from `messages` because in a group, each member has independent delivered/read state for the same message — a single status field on the message can't represent that

## Setup Instructions

### Backend (Windows)

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed
uvicorn app.main:app --reload

(macOS/Linux: `python3 -m venv venv && source venv/bin/activate`)

### Frontend

cd frontend
npm install
npm run dev


Visit `http://localhost:3000`, log in with any seeded phone number below and OTP `123456`.

## Seeded Test Users
| Phone | Name |
|---|---|
| +911111111111 | Aarav Mehta |
| +911111111112 | Priya Singh |
| +911111111113 | Rohan Gupta |
| +911111111114 | Sneha Kapoor |
| +911111111115 | Vikram Rao |

## API Overview

POST /auth/register {phone, display_name} -> {otp_hint, user_id}
POST /auth/verify-otp {phone, otp} -> {token, user}
GET /conversations -> list, sorted by most recent activity
POST /conversations {type, name?, member_ids[]} -> new conversation
GET /conversations/{id}/messages
GET /conversations/{id}/members
POST /conversations/{id}/members?user_id=X (admin only)
DELETE /conversations/{id}/members/{user_id} (admin only)
WS /ws?token=... -> real-time channel (message / typing / read events)


## Assumptions / Mocked Parts
- OTP is fully mocked per the assignment brief — any phone number works, OTP is always `123456`, no real SMS is sent.
- End-to-end encryption is not implemented; this is a UI/UX clone, not a security implementation, per the brief.
- Online/last-seen status is approximated from active WebSocket connections, not persisted presence tracking.
- Voice/video calls, Stories, and Linked Devices are placeholder "Coming Soon" screens, as permitted by the brief.
- New Group member selection is currently a fixed list of seeded users rather than a live user search, due to time constraints.