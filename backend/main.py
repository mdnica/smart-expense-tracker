from fastapi import FastAPI, Depends, HTTPException, Path, Response
from sqlalchemy.orm import Session
from backend import models, database, schemas
from .database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Smart Expense Tracker")

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# endpoints
@app.post("/expenses", response_model=schemas.ExpenseOut)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense

@app.get("/expenses", response_model=list[schemas.ExpenseOut])
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).all()
    return expenses

# ----------NEW: Get single expense ---------
@app.get("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(
        expense_id: int = Path(..., ge=1, description="ID of the expense"),
        db: Session = Depends(get_db),
):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(status_code=404, detail=f"Expense {expense_id} not found")
    return expense

@app.put("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(expense_id: int,
                   payload: schemas.ExpenseUpdate,
                   db: Session = Depends(database.get_db)):
    """Full update: client must send all fields."""
    expense = db.get(models.Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    # Assign every field from payload
    data = payload.model_dump()
    for field, value in data.items():
        setattr(expense, field, value)

    db.commit()
    db.refresh(expense)
    return expense

@app.patch("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def patch_expense(expense_id: int,
                  payload: schemas.ExpensePatch,
                  db: Session = Depends(database.get_db)):
    expense = db.get(models.Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    data = payload.model_dump(exclude_unset=True)

    # Filter out None values so they don't overwrite existing data
    data = {k: v for k, v in data.items() if v is not None}

    for field, value in data.items():
        setattr(expense, field, value)

    db.commit()
    db.refresh(expense)
    return expense


@app.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int,
                   db: Session = Depends(database.get_db)):
    expense = db.get(models.Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(expense)
    db.commit()
    # 204 No content --> return empty response
    return Response(status_code=204)

