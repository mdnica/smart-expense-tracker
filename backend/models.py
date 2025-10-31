from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    amount = Column(String)
    category = Column(String)
    date = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="expenses")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    expenses = relationship("Expense", back_populates="owner")
