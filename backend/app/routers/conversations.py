from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, auth
from ..database import get_db

router = APIRouter()

@router.get("")
def list_conversations(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    memberships = db.query(models.ConversationMember).filter(
        models.ConversationMember.user_id == current_user.id
    ).all()

    result = []
    for m in memberships:
        conv = m.conversation
        other_name = conv.name
        if conv.type == models.ConversationType.direct:
            other_member = db.query(models.ConversationMember).filter(
                models.ConversationMember.conversation_id == conv.id,
                models.ConversationMember.user_id != current_user.id
            ).first()
            if other_member:
                other_user = db.query(models.User).filter(models.User.id == other_member.user_id).first()
                other_name = other_user.display_name if other_user else "Unknown"

        last_message = db.query(models.Message).filter(
            models.Message.conversation_id == conv.id
        ).order_by(models.Message.created_at.desc()).first()

        result.append({
            "id": conv.id,
            "type": conv.type,
            "name": other_name,
            "last_message": last_message.content if last_message else None,
            "last_message_at": conv.last_message_at,
        })

    result.sort(key=lambda c: c["last_message_at"] or "", reverse=True)
    return result


@router.get("/{conversation_id}/messages")
def get_messages(conversation_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    messages = db.query(models.Message).filter(
        models.Message.conversation_id == conversation_id
    ).order_by(models.Message.created_at.asc()).all()

    return [
        {
            "id": msg.id,
            "content": msg.content,
            "sender_id": msg.sender_id,
            "is_own": msg.sender_id == current_user.id,
            "created_at": msg.created_at,
            "status": msg.status,
        }
        for msg in messages
    ]