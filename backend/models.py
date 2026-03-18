from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String)  # 'player', 'club', 'admin'
    is_active = Column(Boolean, default=True)

    # Relationships
    player_profile = relationship("PlayerProfile", back_populates="user", uselist=False)
    events_created = relationship("Event", back_populates="creator")
    certificates = relationship("Certificate", back_populates="user")
    applications = relationship("EventApplication", back_populates="player")
    notifications = relationship("Notification", back_populates="user")


class PlayerProfile(Base):
    __tablename__ = "player_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    position = Column(String)          # GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST
    height_cm = Column(Float)
    weight_kg = Column(Float)
    age = Column(Integer)
    preferred_foot = Column(String)    # Left, Right, Both
    district = Column(String)          # Kerala district
    bio = Column(Text)
    profile_image_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="player_profile")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    creator_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    event_type = Column(String)        # 'trial', 'match', 'combine'
    location = Column(String)
    event_date = Column(DateTime)
    max_participants = Column(Integer)
    status = Column(String, default="open")  # 'open', 'closed', 'completed'
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    creator = relationship("User", back_populates="events_created")
    applications = relationship("EventApplication", back_populates="event")


class EventApplication(Base):
    __tablename__ = "event_applications"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    player_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")  # 'pending', 'accepted', 'rejected'
    applied_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    event = relationship("Event", back_populates="applications")
    player = relationship("User", back_populates="applications")


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, nullable=False)
    issuer = Column(String)
    description = Column(Text)
    file_url = Column(String)
    sha256_hash = Column(String)       # For blockchain verification
    blockchain_tx = Column(String)     # Transaction hash on Polygon
    is_verified = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="certificates")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String)
    read_status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="notifications")
