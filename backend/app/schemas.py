from pydantic import BaseModel
from typing import Optional, List

class RegisterRequest(BaseModel):
    phone: str
    display_name: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str
class CreateConversationRequest(BaseModel):
    type: str
    name: Optional[str] = None
    member_ids: List[int]