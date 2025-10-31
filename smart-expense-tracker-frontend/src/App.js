import React, { useState, useEffect } from "react";
import Login from "./Login";
import { getExpenses, getToken, loginUser } from "./api";

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        if (token) {
            getExpenses(token)
                .then(setExpenses)
                .catch(() => setExpenses([]));
        }
    }, [token]);

    if (!token) {
        return <Login onLogin={setToken} />;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>My expenses</h1>
            {expenses.length === 0 ? (
            <p>No expenses found. </p>
            ) : (
               <ul>
               {expenses.map((e) => (
               <li key={e.id}>
                {e.title}  —  £{e.amount} ({e.category})
               </li>
               ))}
               </ul>
            )}
            <button
                onClick={() => {
                    localStorage.removeItem("token");
                    setToken(null);
                }}
            >
            Logout
            </button>
            </div>
    );
}

export default App;