from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Server])
def get_servers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    servers = db.query(models.Server).offset(skip).limit(limit).all()
    return servers

@router.get("/{server_id}", response_model=schemas.Server)
def get_server(server_id: str, db: Session = Depends(get_db)):
    server = db.query(models.Server).filter(models.Server.id == server_id).first()
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server

@router.post("/", response_model=schemas.Server)
def create_server(server: schemas.ServerCreate, db: Session = Depends(get_db)):
    db_server = models.Server(**server.model_dump())
    db.add(db_server)
    db.commit()
    db.refresh(db_server)
    return db_server

@router.put("/{server_id}", response_model=schemas.Server)
def update_server(server_id: str, server: schemas.ServerCreate, db: Session = Depends(get_db)):
    db_server = db.query(models.Server).filter(models.Server.id == server_id).first()
    if not db_server:
        raise HTTPException(status_code=404, detail="Server not found")
    for key, value in server.model_dump().items():
        setattr(db_server, key, value)
    db.commit()
    db.refresh(db_server)
    return db_server

@router.delete("/{server_id}")
def delete_server(server_id: str, db: Session = Depends(get_db)):
    db_server = db.query(models.Server).filter(models.Server.id == server_id).first()
    if not db_server:
        raise HTTPException(status_code=404, detail="Server not found")
    db.delete(db_server)
    db.commit()
    return {"message": "Server deleted"}

