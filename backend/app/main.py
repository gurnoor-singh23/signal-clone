from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import auth, contacts, conversations, messages, ws

Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/admin/seed")
def trigger_seed():
    from .seed import run_seed
    result = run_seed()
    return {"message": "Seed executed", "users": result}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(contacts.router, prefix="/contacts", tags=["contacts"])
app.include_router(conversations.router, prefix="/conversations", tags=["conversations"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
app.include_router(ws.router, tags=["ws"])