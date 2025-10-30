from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional

class ExpenseBase(BaseModel):
    title: str
    amount: float
    category: str
    date: date

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
    model_config = ConfigDict(from_attributes=True) # Pydantic v2: tell it we'll feed it SQLAlchemy objects





