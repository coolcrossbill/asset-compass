from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.OperatingSystem])
def get_operating_systems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    operating_systems = db.query(models.OperatingSystem).offset(skip).limit(limit).all()
    return operating_systems

@router.get("/{os_id}", response_model=schemas.OperatingSystem)
def get_operating_system(os_id: str, db: Session = Depends(get_db)):
    operating_system = db.query(models.OperatingSystem).filter(models.OperatingSystem.id == os_id).first()
    if not operating_system:
        raise HTTPException(status_code=404, detail="Operating system not found")
    return operating_system

@router.post("/", response_model=schemas.OperatingSystem)
def create_operating_system(os: schemas.OperatingSystemCreate, db: Session = Depends(get_db)):
    db_os = models.OperatingSystem(**os.model_dump())
    db.add(db_os)
    db.commit()
    db.refresh(db_os)
    return db_os

@router.put("/{os_id}", response_model=schemas.OperatingSystem)
def update_operating_system(os_id: str, os: schemas.OperatingSystemCreate, db: Session = Depends(get_db)):
    db_os = db.query(models.OperatingSystem).filter(models.OperatingSystem.id == os_id).first()
    if not db_os:
        raise HTTPException(status_code=404, detail="Operating system not found")
    for key, value in os.model_dump().items():
        setattr(db_os, key, value)
    db.commit()
    db.refresh(db_os)
    return db_os

@router.delete("/{os_id}")
def delete_operating_system(os_id: str, db: Session = Depends(get_db)):
    db_os = db.query(models.OperatingSystem).filter(models.OperatingSystem.id == os_id).first()
    if not db_os:
        raise HTTPException(status_code=404, detail="Operating system not found")
    db.delete(db_os)
    db.commit()
    return {"message": "Operating system deleted"}

