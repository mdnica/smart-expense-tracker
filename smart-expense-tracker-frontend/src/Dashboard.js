import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "./useAuthFetch";
import Spinner from "./Spinner";
import "./Dashboard.css";


function Dashboard() {
    const [expenses,setExpenses] = useState()
    const [loading, setLoading] = useState(true);
    const { authFetch } = useAuthFetch();
    const navigate = useNavigate();

//Fetch user expenses
useEffect(() => {
    const fetchExpenses = async () => {
        try {
           const response =  await authFetch(`${process.env.REACT_APP_API_URL}/expenses`);
           if (response.ok) {
               const data = await response.json();
               setExpenses(data);
           } else {
             console.error("Failed to fetch expenses");
           }
        } catch (error) {
          console.error("Error fetching expenses:", error);
        } finally {
          setLoading(false);
        }
    };
    fetchExpenses();

}, [authFetch]);

//Logout function
const handleLogout = () => {
    localStorage.removeItem("token"); //delete token
    navigate("/");                    //go to Login page
 };

 if (loading) return <Spinner />;

 return (
    <div className="dashboard">
        <header className="dashboard-header">
            <h2>Dashboard</h2>
            <button className="logout-btn" onClick={handleLogout}>
            Logout
            </button>
        </header>

        <div className="expenses-list">
            {expenses.length > 0 ? (
                expenses.map((exp) => (
                    <div className="expense-card" key={exp.id}>
                    <p><b>{exp.title}</b> - £{exp.amount}</p>
                    <small>{exp.category} | {new Date(exp.date).toLocaleDateString()}</small>
                    </div>
                ))
            ) : (
                <p>No expenses yet.Add one!</p>
            )}
        </div>
     </div>
 );
}

export default Dashboard;
