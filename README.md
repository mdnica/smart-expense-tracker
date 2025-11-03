# 💰 Smart Expense Tracker

A full-stack expense tracking application built with **React (frontend)** and **FastAPI (backend)**.  
It allows users to **sign up, log in, and manage their daily expenses** securely with JWT-based authentication.

---

## 🚀 Features

✅ User Authentication (Login / Signup)  
✅ Secure JWT Token Management  
✅ Token Auto-Refresh & Protected Routes  
✅ Add / View / Update / Delete Expenses  
✅ Loading Spinner + Error Handling  
✅ Logout & Session Expiry  
✅ Responsive & Minimal UI  

---

## 🧩 Tech Stack

**Frontend**
- React (Hooks + Router)
- Custom Hook for Auth (`useAuthFetch`)
- Modern CSS styling

**Backend**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite Database
- JWT Authentication (using `python-jose` and `passlib`)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/smart-expense-tracker.git
cd smart-expense-tracker

2️⃣ Backend setup (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

The backend will start on:
http://127.0.0.1:8000


3️⃣ Frontend setup (React)
cd ../smart-expense-tracker-frontend
npm install
npm start

The frontend will start on
http://localhost:3000


🧠 How It Works

Users sign up / log in → get a JWT access token.

Token is stored in localStorage and used in every API call.

If token expires → useAuthFetch automatically refreshes it.

All expenses are linked to the logged-in user only.


🛡️ Security Notes

Passwords are hashed using bcrypt.

JWTs include expiry times and validation checks.

Protected endpoints require a valid token.



💡 Future Improvements

Expense filters and monthly reports

Chart visualization (using Chart.js or Recharts)

Dark Mode toggle

Deploy to AWS / Vercel


👩‍💻 Author

mdnica
📍 Built with ❤️ in the UK
🎓 Learning full-stack & cloud technologies
