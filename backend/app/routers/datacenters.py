from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Datacenter])
def get_datacenters(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    datacenters = db.query(models.Datacenter).offset(skip).limit(limit).all()
    return datacenters

@router.get("/{datacenter_id}", response_model=schemas.Datacenter)
def get_datacenter(datacenter_id: str, db: Session = Depends(get_db)):
    datacenter = db.query(models.Datacenter).filter(models.Datacenter.id == datacenter_id).first()
    if not datacenter:
        raise HTTPException(status_code=404, detail="Datacenter not found")
    return datacenter

@router.post("/", response_model=schemas.Datacenter)
def create_datacenter(datacenter: schemas.DatacenterCreate, db: Session = Depends(get_db)):
    db_datacenter = models.Datacenter(**datacenter.model_dump())
    db.add(db_datacenter)
    db.commit()
    db.refresh(db_datacenter)
    return db_datacenter

@router.put("/{datacenter_id}", response_model=schemas.Datacenter)
def update_datacenter(datacenter_id: str, datacenter: schemas.DatacenterCreate, db: Session = Depends(get_db)):
    db_datacenter = db.query(models.Datacenter).filter(models.Datacenter.id == datacenter_id).first()
    if not db_datacenter:
        raise HTTPException(status_code=404, detail="Datacenter not found")
    for key, value in datacenter.model_dump().items():
        setattr(db_datacenter, key, value)
    db.commit()
    db.refresh(db_datacenter)
    return db_datacenter

@router.delete("/{datacenter_id}")
def delete_datacenter(datacenter_id: str, db: Session = Depends(get_db)):
    db_datacenter = db.query(models.Datacenter).filter(models.Datacenter.id == datacenter_id).first()
    if not db_datacenter:
        raise HTTPException(status_code=404, detail="Datacenter not found")
    db.delete(db_datacenter)
    db.commit()
    return {"message": "Datacenter deleted"}

