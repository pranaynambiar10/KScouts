from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user, require_role
import models, schemas

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)

@router.post("/", response_model=schemas.EventOut, status_code=status.HTTP_201_CREATED)
def create_event(event_data: schemas.EventCreate, current_user: models.User = Depends(require_role(["club", "admin"])), db: Session = Depends(get_db)):
    """Create a new event (clubs only)."""
    event = models.Event(creator_id=current_user.id, **event_data.model_dump())
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

@router.get("/", response_model=list[schemas.EventOut])
def list_events(db: Session = Depends(get_db)):
    """List all open events (public)."""
    events = db.query(models.Event).filter(models.Event.status == "open").all()
    return events

@router.get("/my", response_model=list[schemas.EventOut])
def my_events(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get events created by the current club user."""
    events = db.query(models.Event).filter(models.Event.creator_id == current_user.id).all()
    return events

@router.get("/my/applications", response_model=list[schemas.EventApplicationOut])
def my_applications(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all applications by the current player."""
    applications = db.query(models.EventApplication).filter(
        models.EventApplication.player_id == current_user.id
    ).all()
    return applications

@router.get("/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get event details by ID."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.put("/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: int, event_data: schemas.EventUpdate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update an event (creator only)."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this event")

    update_data = event_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)
    return event

# ==================== EVENT APPLICATIONS ====================

@router.post("/{event_id}/apply", response_model=schemas.EventApplicationOut)
def apply_to_event(event_id: int, current_user: models.User = Depends(require_role(["player"])), db: Session = Depends(get_db)):
    """Apply to an event (players only)."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.status != "open":
        raise HTTPException(status_code=400, detail="Event is not open for applications")

    # Check if already applied
    existing = db.query(models.EventApplication).filter(
        models.EventApplication.event_id == event_id,
        models.EventApplication.player_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this event")

    application = models.EventApplication(event_id=event_id, player_id=current_user.id)
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

# NOTE: /my/applications is already registered above /{event_id} to prevent route shadowing

@router.get("/{event_id}/applications", response_model=list[schemas.EventApplicationWithDetails])
def get_event_applications(event_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get applications for an event (event creator or admin only)."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    applications = db.query(models.EventApplication).filter(
        models.EventApplication.event_id == event_id
    ).all()

    # Attach player_profile for each applicant
    for app in applications:
        profile = db.query(models.PlayerProfile).filter(
            models.PlayerProfile.user_id == app.player_id
        ).first()
        app.player_profile = profile

    return applications

@router.patch("/{event_id}/applications/{app_id}", response_model=schemas.EventApplicationOut)
def update_application_status(
    event_id: int,
    app_id: int,
    body: schemas.ApplicationStatusUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Accept or reject a player's application (event creator only)."""
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.creator_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    application = db.query(models.EventApplication).filter(
        models.EventApplication.id == app_id,
        models.EventApplication.event_id == event_id
    ).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    if body.status not in ["accepted", "rejected", "pending"]:
        raise HTTPException(status_code=400, detail="Status must be 'accepted', 'rejected', or 'pending'")

    application.status = body.status
    db.commit()
    db.refresh(application)
    
    print(f"DB Update Success: App {app_id} status changed to '{body.status}'")

    # Create a notification for the player
    if body.status in ["accepted", "rejected"]:
        action_text = "selected for" if body.status == "accepted" else "rejected from"
        notification_msg = f"You have been {action_text} Event: {event.title}"
        new_notification = models.Notification(
            user_id=application.player_id,
            message=notification_msg
        )
        db.add(new_notification)
        db.commit()
    
    return application
