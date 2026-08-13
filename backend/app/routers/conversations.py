from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, auth, schemas
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




@router.post("")
def create_conversation(payload: schemas.CreateConversationRequest, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    conv_type = models.ConversationType.group if payload.type == "group" else models.ConversationType.direct

    conv = models.Conversation(type=conv_type, name=payload.name, created_by=current_user.id)
    db.add(conv)
    db.commit()
    db.refresh(conv)

    all_member_ids = set(payload.member_ids)
    all_member_ids.add(current_user.id)

    for uid in all_member_ids:
        role = models.MemberRole.admin if uid == current_user.id else models.MemberRole.member
        db.add(models.ConversationMember(conversation_id=conv.id, user_id=uid, role=role))
    db.commit()

    return {"id": conv.id, "type": conv.type, "name": conv.name}


@router.get("/{conversation_id}/members")
def get_members(conversation_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    memberships = db.query(models.ConversationMember).filter(
        models.ConversationMember.conversation_id == conversation_id
    ).all()

    result = []
    for m in memberships:
        user = db.query(models.User).filter(models.User.id == m.user_id).first()
        result.append({
            "user_id": m.user_id,
            "display_name": user.display_name if user else "Unknown",
            "role": m.role,
        })
    return result


@router.post("/{conversation_id}/members")
def add_member(conversation_id: int, user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    requester = db.query(models.ConversationMember).filter(
        models.ConversationMember.conversation_id == conversation_id,
        models.ConversationMember.user_id == current_user.id
    ).first()
    if not requester or requester.role != models.MemberRole.admin:
        raise HTTPException(403, "Only admins can add members")

    existing = db.query(models.ConversationMember).filter(
        models.ConversationMember.conversation_id == conversation_id,
        models.ConversationMember.user_id == user_id
    ).first()
    if existing:
        raise HTTPException(400, "User already a member")

    db.add(models.ConversationMember(conversation_id=conversation_id, user_id=user_id, role=models.MemberRole.member))
    db.commit()
    return {"message": "Member added"}


@router.delete("/{conversation_id}/members/{user_id}")
def remove_member(conversation_id: int, user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    requester = db.query(models.ConversationMember).filter(
        models.ConversationMember.conversation_id == conversation_id,
        models.ConversationMember.user_id == current_user.id
    ).first()
    if not requester or requester.role != models.MemberRole.admin:
        raise HTTPException(403, "Only admins can remove members")

    member = db.query(models.ConversationMember).filter(
        models.ConversationMember.conversation_id == conversation_id,
        models.ConversationMember.user_id == user_id
    ).first()
    if member:
        db.delete(member)
        db.commit()
    return {"message": "Member removed"}