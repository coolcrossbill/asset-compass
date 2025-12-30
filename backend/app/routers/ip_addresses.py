from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.IPAddress])
def get_ip_addresses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    ip_addresses = db.query(models.IPAddress).offset(skip).limit(limit).all()
    return ip_addresses

@router.get("/{ip_id}", response_model=schemas.IPAddress)
def get_ip_address(ip_id: str, db: Session = Depends(get_db)):
    ip_address = db.query(models.IPAddress).filter(models.IPAddress.id == ip_id).first()
    if not ip_address:
        raise HTTPException(status_code=404, detail="IP address not found")
    return ip_address

@router.post("/", response_model=schemas.IPAddress)
def create_ip_address(ip_address: schemas.IPAddressCreate, db: Session = Depends(get_db)):
    db_ip = models.IPAddress(**ip_address.model_dump())
    db.add(db_ip)
    db.commit()
    db.refresh(db_ip)
    return db_ip

@router.put("/{ip_id}", response_model=schemas.IPAddress)
def update_ip_address(ip_id: str, ip_address: schemas.IPAddressCreate, db: Session = Depends(get_db)):
    db_ip = db.query(models.IPAddress).filter(models.IPAddress.id == ip_id).first()
    if not db_ip:
        raise HTTPException(status_code=404, detail="IP address not found")
    for key, value in ip_address.model_dump().items():
        setattr(db_ip, key, value)
    db.commit()
    db.refresh(db_ip)
    return db_ip

@router.delete("/{ip_id}")
def delete_ip_address(ip_id: str, db: Session = Depends(get_db)):
    db_ip = db.query(models.IPAddress).filter(models.IPAddress.id == ip_id).first()
    if not db_ip:
        raise HTTPException(status_code=404, detail="IP address not found")
    db.delete(db_ip)
    db.commit()
    return {"message": "IP address deleted"}

