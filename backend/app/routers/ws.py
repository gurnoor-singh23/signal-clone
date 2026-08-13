from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from .. import auth, models
from ..database import SessionLocal
from ..ws_manager import manager
import json
from datetime import datetime

router = APIRouter()

@router.websocket("/ws")
async def websocket_endpoint(ws: WebSocket, token: str = Query(...)):
    try:
        payload = auth.decode_token(token)
        user_id = int(payload["sub"])
    except Exception:
        await ws.close(code=4001)
        return

    await manager.connect(user_id, ws)
    db = SessionLocal()
    try:
        while True:
            raw = await ws.receive_text()
            event = json.loads(raw)
            await handle_event(event, user_id, db)
    except WebSocketDisconnect:
        manager.disconnect(user_id, ws)
    finally:
        db.close()


async def handle_event(event: dict, user_id: int, db):
    event_type = event.get("type")
    conversation_id = event.get("conversation_id")

    members = db.query(models.ConversationMember).filter(
        models.ConversationMember.conversation_id == conversation_id
    ).all()
    member_ids = [m.user_id for m in members]

    if event_type == "message":
        content = event.get("content", "").strip()
        if not content:
            return

        msg = models.Message(
            conversation_id=conversation_id,
            sender_id=user_id,
            content=content,
            status=models.MessageStatus.sent,
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)

        for m_id in member_ids:
            if m_id != user_id:
                receipt = models.MessageReceipt(
                    message_id=msg.id, user_id=m_id,
                    status=models.MessageStatus.delivered
                )
                db.add(receipt)
        conv = db.query(models.Conversation).filter(models.Conversation.id == conversation_id).first()
        conv.last_message_at = datetime.utcnow()
        db.commit()


        payload = {
            "type": "message",
            "id": msg.id,
            "conversation_id": conversation_id,
            "sender_id": user_id,
            "content": msg.content,
            "created_at": msg.created_at.isoformat(),
            "status": "sent",
        }
        for m_id in member_ids:
            await manager.send_to_user(m_id, payload)

    elif event_type == "typing":
        payload = {"type": "typing", "user_id": user_id, "conversation_id": conversation_id}
        for m_id in member_ids:
            if m_id != user_id:
                await manager.send_to_user(m_id, payload)

    elif event_type == "read":
        db.query(models.MessageReceipt).filter(
            models.MessageReceipt.user_id == user_id,
            models.MessageReceipt.message_id.in_(
                db.query(models.Message.id).filter(models.Message.conversation_id == conversation_id)
            )
        ).update({"status": models.MessageStatus.read}, synchronize_session=False)
        db.commit()

        payload = {"type": "read", "conversation_id": conversation_id, "reader_id": user_id}
        for m_id in member_ids:
            if m_id != user_id:
                await manager.send_to_user(m_id, payload)