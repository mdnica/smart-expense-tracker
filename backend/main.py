from fastapi import FastAPI, Depends, HTTPException, Path, Response, status
from fastapi.middleware.cors import CORSMiddleware
from backend.dependencies import get_current_user
from sqlalchemy.orm import Session
from backend import models, database, schemas, auth
from .database import engine, get_db
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta




# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Smart Expense Tracker")

app.add_middleware(

    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# endpoints
@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/expenses", response_model=schemas.ExpenseOut)
def create_expense(
        expense: schemas.ExpenseCreate,
        db: Session = Depends(database.get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
    new_expense = models.Expense(**expense.dict(), user_id=current_user.id)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense


@app.get("/expenses", response_model=list[schemas.ExpenseOut])
def get_expenses(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()
    return expenses


# ----------NEW: Get single expense ---------
@app.get("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(
        expense_id: int,
        db: Session = Depends(database.get_db),
        current_user : models.User = Depends(auth.get_current_user),
):
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id

    ).first()


    if not expense:
        raise HTTPException(status_code=404, detail=f"Expense {expense_id} not found")
    return expense

@app.put("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense_full(
        expense_id: int,
        updated_expense: schemas.ExpenseUpdate,
        db: Session = Depends(database.get_db),
        current_user: models.User = Depends(auth.get_current_user)
):
        expense = db.query(models.Expense).filter(
            models.Expense.id == expense_id,
            models.Expense.user_id == current_user.id
        ).first()

        if not expense:
            raise HTTPException(status_code=404, detail= "Expense not found")

       # Replace all editable fields
        expense.title = updated_expense.title
        expense.amount = updated_expense.amount
        expense.category = updated_expense.category
        expense.date = updated_expense.date

        db.commit()
        db.refresh(expense)
        return expense



@app.patch("/expenses/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(
        expense_id: int,
        updated_expense: schemas.ExpensePatch,
        db: Session = Depends(database.get_db),
        current_user: models.User = Depends(auth.get_current_user),
):
        expense = db.query(models.Expense).filter(
            models.Expense.id == expense_id,
            models.Expense.user_id == current_user.id

        ).first()

        if not expense:
            raise HTTPException(status_code=404, detail="Expense not found")

        for key, value in updated_expense.dict(exclude_unset=True).items():
            setattr(expense, key,value)

        db.commit()
        db.refresh(expense)
        return expense




@app.delete("/expenses/{expense_id}", status_code=200)
def delete_expense(
        expense_id: int,
        db: Session = Depends(database.get_db),
        current_user: models.User = Depends(auth.get_current_user),
):

    # Fetch the expense that belongs to the current user
    expense = db.query(models.Expense).filter(
        models.Expense.id == expense_id,
        models.Expense.user_id == current_user.id

    ).first()

    # If expense doesn#t exist, raise a 404 error
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    #Delete the expense
    db.delete(expense)
    db.commit()
    # 204 No content --> return empty response
    return {"message": "Expense deleted successfully"}



