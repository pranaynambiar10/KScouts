from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter(
    prefix="/players",
    tags=["Player Profiles"]
)

@router.get("/me", response_model=schemas.PlayerProfileOut)
def get_my_profile(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get the current player's profile."""
    profile = db.query(models.PlayerProfile).filter(models.PlayerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Please create one first.")
    return profile

@router.post("/me", response_model=schemas.PlayerProfileOut, status_code=status.HTTP_201_CREATED)
def create_my_profile(profile_data: schemas.PlayerProfileCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create the current player's profile."""
    existing = db.query(models.PlayerProfile).filter(models.PlayerProfile.user_id == current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Profile already exists. Use PUT to update.")

    profile = models.PlayerProfile(user_id=current_user.id, **profile_data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

@router.put("/me", response_model=schemas.PlayerProfileOut)
def update_my_profile(profile_data: schemas.PlayerProfileUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update the current player's profile."""
    profile = db.query(models.PlayerProfile).filter(models.PlayerProfile.user_id == current_user.id).first()
    if not profile:
        # Auto-create if doesn't exist
        profile = models.PlayerProfile(user_id=current_user.id, **profile_data.model_dump(exclude_unset=True))
        db.add(profile)
    else:
        update_data = profile_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/", response_model=list[schemas.PlayerProfileWithUser])
def list_all_players(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """List all player profiles (for clubs/scouts to browse)."""
    profiles = db.query(models.PlayerProfile).all()
    return profiles

@router.get("/{user_id}", response_model=schemas.PlayerProfileWithUser)
def get_player_by_id(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get a specific player's profile by user ID (for clubs reviewing applicants)."""
    profile = db.query(models.PlayerProfile).filter(models.PlayerProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Player profile not found")
    return profile

@router.get("/{user_id}/certificates", response_model=list[schemas.CertificateOut])
def get_player_certificates(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Get all certificates for a player (for clubs to verify credentials)."""
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()
    return certs
