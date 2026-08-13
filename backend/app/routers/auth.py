from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter()

@router.post("/register")
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.phone == payload.phone).first()
    if not user:
        user = models.User(phone=payload.phone, display_name=payload.display_name)
        db.add(user); db.commit(); db.refresh(user)
    return {"message": "OTP sent (mocked)", "otp_hint": auth.MOCK_OTP, "user_id": user.id}

@router.post("/verify-otp")
def verify_otp(payload: schemas.VerifyOtpRequest, db: Session = Depends(get_db)):
    if payload.otp != auth.MOCK_OTP:
        raise HTTPException(400, "Invalid OTP")
    user = db.query(models.User).filter(models.User.phone == payload.phone).first()
    if not user:
        raise HTTPException(404, "User not found")
    token = auth.create_token(user.id)
    return {"token": token, "user": user}