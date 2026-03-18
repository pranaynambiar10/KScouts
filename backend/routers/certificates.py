from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
import models, schemas
import hashlib
import os

try:
    from blockchain_client import verify_certificate_hash, is_blockchain_available
    BLOCKCHAIN_ENABLED = True
except ImportError:
    BLOCKCHAIN_ENABLED = False
    print("⚠️  blockchain_client not found — certificates will save without blockchain")

router = APIRouter(
    prefix="/certificates",
    tags=["Certificates"]
)

UPLOAD_DIR = "uploads/certificates"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/verify-certificate")
async def verify_certificate_demo(file: UploadFile = File(...)):
    """
    Demo endpoint: Accept a file, hash it, and check if it's verifying on the blockchain.
    Does NOT store the file or the hash. Strictly Read-Only.
    """
    contents = await file.read()
    sha256_hash = hashlib.sha256(contents).hexdigest()
    
    if not BLOCKCHAIN_ENABLED:
        return {"verified": False, "message": "Blockchain disabled on server"}
        
    result = verify_certificate_hash(sha256_hash)
    return result

@router.post("/", response_model=schemas.CertificateOut, status_code=status.HTTP_201_CREATED)
async def upload_certificate(
    title: str = Form(...),
    issuer: str = Form(None),
    description: str = Form(None),
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a certificate and verify it against trusted hashes on the blockchain."""
    contents = await file.read()
    sha256_hash = hashlib.sha256(contents).hexdigest()

    file_ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
    filename = f"{current_user.id}_{sha256_hash[:12]}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(contents)

    cert = models.Certificate(
        user_id=current_user.id,
        title=title,
        issuer=issuer,
        description=description,
        file_url=f"/uploads/certificates/{filename}",
        sha256_hash=sha256_hash,
        is_verified=False
    )
    
    # Verify hash against blockchain (read-only checking if a Club issued it)
    if BLOCKCHAIN_ENABLED:
        # Check if hash is already claimed by another user
        existing_cert = db.query(models.Certificate).filter(
            models.Certificate.sha256_hash == sha256_hash,
            models.Certificate.is_verified == True
        ).first()

        if existing_cert and existing_cert.user_id != current_user.id:
            print(f"⚠️  Certificate hash already claimed by user {existing_cert.user_id}")
            cert.is_verified = False
        else:
            result = verify_certificate_hash(sha256_hash)
            if result.get("verified"):
                cert.is_verified = True
                print(f"🔗 Certificate verified on blockchain matching hash: {sha256_hash}")
            else:
                print(f"⚠️  Certificate hash not found on blockchain: {sha256_hash}")

    db.add(cert)
    db.commit()
    db.refresh(cert)
    
    return cert

@router.get("/my", response_model=list[schemas.CertificateOut])
def my_certificates(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == current_user.id).all()
    return certs

@router.get("/user/{user_id}", response_model=list[schemas.CertificateOut])
def user_certificates(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    certs = db.query(models.Certificate).filter(models.Certificate.user_id == user_id).all()
    return certs

@router.get("/verify/{cert_id}")
def verify_certificate(cert_id: int, db: Session = Depends(get_db)):
    cert = db.query(models.Certificate).filter(models.Certificate.id == cert_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")

    on_chain = None
    if BLOCKCHAIN_ENABLED and cert.sha256_hash:
        on_chain = verify_certificate_hash(cert.sha256_hash)

    return {
        "certificate_id": cert.id,
        "title": cert.title,
        "sha256_hash": cert.sha256_hash,
        "is_verified": cert.is_verified,
        "on_chain": on_chain,
    }
