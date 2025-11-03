import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import { getExpenses, getToken, loginUser } from "./api";
import Dashboard from "./Dashboard";
import AddExpense from './AddExpense';

function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    return (
        <Router>
          <Routes>
           <Route path="/" element={<Login onLogin={setToken} />} />
           <Route path="/dashboard" element={<Dashboard token={token} />} />
           <Route path="/add-expense" element={<AddExpense token={token} />} />
          </Routes>
        </Router>
    );
}

export default App;