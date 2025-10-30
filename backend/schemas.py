from pydantic import BaseModel
from datetime import date

class ExpenseCreate(BaseModel):
    title: str
    amount: float
    category: str
    date: date
