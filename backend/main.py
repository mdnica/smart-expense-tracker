from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, database, schemas
from .database import engine  # <-- that's why 'engine' was not defined

app = FastAPI()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Create database tables
models.Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Welcome to Smart Expense Tracker API"}

@app.post("/expenses")
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    new_expense = models.Expense(
        title=expense.title,
        amount=expense.amount,
        category=expense.category,
        date=expense.date
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense
