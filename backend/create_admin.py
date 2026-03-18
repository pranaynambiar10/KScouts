"""
Run this script to create the initial admin account.
Usage: python create_admin.py
"""
from database import SessionLocal
from auth import get_password_hash
import models

db = SessionLocal()

# Check if admin already exists
existing = db.query(models.User).filter(models.User.email == "admin@kscouts.com").first()
if existing:
    print("Admin account already exists!")
    print(f"  Email: admin@kscouts.com")
    print(f"  Role: {existing.role}")
else:
    admin = models.User(
        email="admin@kscouts.com",
        hashed_password=get_password_hash("admin123"),
        full_name="KScouts Admin",
        role="admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("Admin account created successfully!")
    print("  Email: admin@kscouts.com")
    print("  Password: admin123")
    print("  Role: admin")

db.close()
