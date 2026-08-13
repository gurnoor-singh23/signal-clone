# app/models.py
from sqlalchemy import (Column, Integer, String, DateTime, ForeignKey,
                         Boolean, Enum, Text)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum

class ConversationType(str, enum.Enum):
    direct = "direct"
    group = "group"

class MemberRole(str, enum.Enum):
    admin = "admin"
    member = "member"

class MessageStatus(str, enum.Enum):
    sending = "sending"
    sent = "sent"
    delivered = "delivered"
    read = "read"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    phone = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True, nullable=True)
    display_name = Column(String)
    avatar_url = Column(String, nullable=True)
    password_hash = Column(String, nullable=True)   # not really used, mocked auth
    is_online = Column(Boolean, default=False)
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Contact(Base):
    __tablename__ = "contacts"
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    contact_user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(Integer, primary_key=True)
    type = Column(Enum(ConversationType))
    name = Column(String, nullable=True)     # null for direct chats
    avatar_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_message_at = Column(DateTime(timezone=True), server_default=func.now())

    members = relationship("ConversationMember", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation")

class ConversationMember(Base):
    __tablename__ = "conversation_members"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(Enum(MemberRole), default=MemberRole.member)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="members")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    status = Column(Enum(MessageStatus), default=MessageStatus.sent)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    conversation = relationship("Conversation", back_populates="messages")

class MessageReceipt(Base):
    """Per-user delivery/read state — needed because in a GROUP, each member
    has their own delivered/read status for the same message. A single
    `status` column on Message can't represent that."""
    __tablename__ = "message_receipts"
    id = Column(Integer, primary_key=True)
    message_id = Column(Integer, ForeignKey("messages.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(Enum(MessageStatus), default=MessageStatus.delivered)
    updated_at = Column(DateTime(timezone=True), server_default=func.now())