from pydantic import BaseModel
from typing import Optional

class RegisterRequest(BaseModel):
    phone: str
    display_name: str

class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str