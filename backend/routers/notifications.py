from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas

router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)

@router.get("/my", response_model=list[schemas.NotificationOut])
def get_my_notifications(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all notifications for the currently logged-in user, ordered by newest first.
    """
    notifications = db.query(models.Notification)\
        .filter(models.Notification.user_id == current_user.id)\
        .order_by(models.Notification.created_at.desc())\
        .all()
    
    return notifications
