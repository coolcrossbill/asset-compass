from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Assignment])
def get_assignments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    assignments = db.query(models.Assignment).offset(skip).limit(limit).all()
    return assignments

@router.get("/{assignment_id}", response_model=schemas.Assignment)
def get_assignment(assignment_id: str, db: Session = Depends(get_db)):
    assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment

@router.post("/", response_model=schemas.Assignment)
def create_assignment(assignment: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = models.Assignment(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.put("/{assignment_id}", response_model=schemas.Assignment)
def update_assignment(assignment_id: str, assignment: schemas.AssignmentCreate, db: Session = Depends(get_db)):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    for key, value in assignment.model_dump().items():
        setattr(db_assignment, key, value)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment

@router.delete("/{assignment_id}")
def delete_assignment(assignment_id: str, db: Session = Depends(get_db)):
    db_assignment = db.query(models.Assignment).filter(models.Assignment.id == assignment_id).first()
    if not db_assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    db.delete(db_assignment)
    db.commit()
    return {"message": "Assignment deleted"}

