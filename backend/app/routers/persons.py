from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Person])
def get_persons(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    persons = db.query(models.Person).offset(skip).limit(limit).all()
    return persons

@router.get("/{person_id}", response_model=schemas.Person)
def get_person(person_id: str, db: Session = Depends(get_db)):
    person = db.query(models.Person).filter(models.Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person

@router.post("/", response_model=schemas.Person)
def create_person(person: schemas.PersonCreate, db: Session = Depends(get_db)):
    db_person = models.Person(**person.model_dump())
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person

@router.put("/{person_id}", response_model=schemas.Person)
def update_person(person_id: str, person: schemas.PersonCreate, db: Session = Depends(get_db)):
    db_person = db.query(models.Person).filter(models.Person.id == person_id).first()
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    for key, value in person.model_dump().items():
        setattr(db_person, key, value)
    db.commit()
    db.refresh(db_person)
    return db_person

@router.delete("/{person_id}")
def delete_person(person_id: str, db: Session = Depends(get_db)):
    db_person = db.query(models.Person).filter(models.Person.id == person_id).first()
    if not db_person:
        raise HTTPException(status_code=404, detail="Person not found")
    db.delete(db_person)
    db.commit()
    return {"message": "Person deleted"}

