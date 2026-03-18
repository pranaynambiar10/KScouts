from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# ==================== AUTH ====================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "player"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# ==================== PLAYER PROFILE ====================
class PlayerProfileCreate(BaseModel):
    position: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    age: Optional[int] = None
    preferred_foot: Optional[str] = None
    district: Optional[str] = None
    bio: Optional[str] = None

class PlayerProfileUpdate(PlayerProfileCreate):
    pass

class PlayerProfileOut(BaseModel):
    id: int
    user_id: int
    position: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    age: Optional[int] = None
    preferred_foot: Optional[str] = None
    district: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class PlayerProfileWithUser(PlayerProfileOut):
    user: UserOut

    class Config:
        from_attributes = True

# ==================== EVENTS ====================
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "trial"
    location: Optional[str] = None
    event_date: Optional[datetime] = None
    max_participants: Optional[int] = None

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[datetime] = None
    max_participants: Optional[int] = None
    status: Optional[str] = None

class EventOut(BaseModel):
    id: int
    creator_id: int
    title: str
    description: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[datetime] = None
    max_participants: Optional[int] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== EVENT APPLICATIONS ====================
class EventApplicationCreate(BaseModel):
    event_id: int

class EventApplicationOut(BaseModel):
    id: int
    event_id: int
    player_id: int
    status: str
    applied_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EventApplicationWithDetails(EventApplicationOut):
    player: Optional[UserOut] = None
    player_profile: Optional[PlayerProfileOut] = None

    class Config:
        from_attributes = True

class ApplicationStatusUpdate(BaseModel):
    status: str  # "accepted" | "rejected" | "pending"

# ==================== CERTIFICATES ====================
class CertificateCreate(BaseModel):
    title: str
    issuer: Optional[str] = None
    description: Optional[str] = None

class CertificateOut(BaseModel):
    id: int
    user_id: int
    title: str
    issuer: Optional[str] = None
    description: Optional[str] = None
    file_url: Optional[str] = None
    sha256_hash: Optional[str] = None
    blockchain_tx: Optional[str] = None
    is_verified: bool
    uploaded_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ==================== NOTIFICATIONS ====================
class NotificationOut(BaseModel):
    id: int
    user_id: int
    message: str
    read_status: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
