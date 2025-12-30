from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Host])
def get_hosts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    hosts = db.query(models.Host).offset(skip).limit(limit).all()
    return hosts

@router.get("/{host_id}", response_model=schemas.Host)
def get_host(host_id: str, db: Session = Depends(get_db)):
    host = db.query(models.Host).filter(models.Host.id == host_id).first()
    if not host:
        raise HTTPException(status_code=404, detail="Host not found")
    return host

@router.post("/", response_model=schemas.Host)
def create_host(host: schemas.HostCreate, db: Session = Depends(get_db)):
    db_host = models.Host(**host.model_dump())
    db.add(db_host)
    db.commit()
    db.refresh(db_host)
    return db_host

@router.put("/{host_id}", response_model=schemas.Host)
def update_host(host_id: str, host: schemas.HostCreate, db: Session = Depends(get_db)):
    db_host = db.query(models.Host).filter(models.Host.id == host_id).first()
    if not db_host:
        raise HTTPException(status_code=404, detail="Host not found")
    for key, value in host.model_dump().items():
        setattr(db_host, key, value)
    db.commit()
    db.refresh(db_host)
    return db_host

@router.delete("/{host_id}")
def delete_host(host_id: str, db: Session = Depends(get_db)):
    db_host = db.query(models.Host).filter(models.Host.id == host_id).first()
    if not db_host:
        raise HTTPException(status_code=404, detail="Host not found")
    db.delete(db_host)
    db.commit()
    return {"message": "Host deleted"}

