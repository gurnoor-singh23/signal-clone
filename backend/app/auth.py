from jose import jwt
from datetime import datetime, timedelta

SECRET = "dev-secret-change-me"
ALGORITHM = "HS256"
MOCK_OTP = "123456"

def create_token(user_id: int):
    payload = {"sub": str(user_id), "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, SECRET, algorithm=ALGORITHM)

def decode_token(token: str):
    return jwt.decode(token, SECRET, algorithms=[ALGORITHM])