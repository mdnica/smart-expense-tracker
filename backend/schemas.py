from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class ExpenseBase(BaseModel):
    title: str
    amount: float
    category: str
    date: datetime

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(ExpenseBase): #for PUT (full update)
    pass

class ExpensePatch(BaseModel): # for PATCH (partial update)
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date] = None

class ExpenseOut(ExpenseBase):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True) # Pydantic v2: tell it we'll feed it SQLAlchemy objects


class UserCreate(BaseModel):
    username: str
    email: str
    password: str



