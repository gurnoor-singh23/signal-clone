from .database import SessionLocal, Base, engine
from . import models
from datetime import datetime, timedelta


def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    users_data = [
        ("+911111111111", "Aarav Mehta"),
        ("+911111111112", "Priya Singh"),
        ("+911111111113", "Rohan Gupta"),
        ("+911111111114", "Sneha Kapoor"),
        ("+911111111115", "Vikram Rao"),
    ]
    users = []
    for phone, name in users_data:
        existing = db.query(models.User).filter(models.User.phone == phone).first()
        if existing:
            users.append(existing)
            continue
        u = models.User(phone=phone, display_name=name)
        db.add(u)
        users.append(u)
    db.commit()
    for u in users:
        db.refresh(u)

    existing_conv = db.query(models.Conversation).filter(models.Conversation.type == models.ConversationType.direct).first()
    if not existing_conv:
        c1 = models.Conversation(type=models.ConversationType.direct)
        db.add(c1)
        db.commit()
        db.refresh(c1)
        db.add_all([
            models.ConversationMember(conversation_id=c1.id, user_id=users[0].id),
            models.ConversationMember(conversation_id=c1.id, user_id=users[1].id),
        ])
        db.commit()

        msgs = ["Hey, how's it going?", "Good! Working on the assignment", "Nice, good luck!"]
        for i, m in enumerate(msgs):
            sender = users[0] if i % 2 == 0 else users[1]
            db.add(models.Message(
                conversation_id=c1.id, sender_id=sender.id, content=m,
                created_at=datetime.utcnow() - timedelta(minutes=(len(msgs) - i))
            ))
        db.commit()

        g1 = models.Conversation(type=models.ConversationType.group, name="Project Squad")
        db.add(g1)
        db.commit()
        db.refresh(g1)
        for i, u in enumerate(users[:3]):
            role = models.MemberRole.admin if i == 0 else models.MemberRole.member
            db.add(models.ConversationMember(conversation_id=g1.id, user_id=u.id, role=role))
        db.commit()

    result = [(u.id, u.display_name) for u in users]
    db.close()
    return result


if __name__ == "__main__":
    result = run_seed()
    print("Seed complete. User IDs:", result)