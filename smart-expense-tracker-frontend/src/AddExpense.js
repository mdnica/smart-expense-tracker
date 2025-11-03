import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "./useAuthFetch";

function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // 🟢 NEW: for spinner state

  const { authFetch, error } = useAuthFetch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true); // 🟢 start spinner

    try {
      const response = await authFetch(`${process.env.REACT_APP_API_URL}/expenses`, {
        method: "POST",
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          category,
          date,
        }),
      });

      if (response.ok) {
        setMessage("✅ Expense added successfully!");
        setTitle("");
        setAmount("");
        setCategory("");
        setDate("");

        // redirect to dashboard after 2 seconds
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        const data = await response.json();
        setMessage(data.detail || "Error adding expense");
      }
    } catch (err) {
      console.error("Add expense failed", err);
      setMessage("Server error, please try again");
    } finally {
      setLoading(false); // 🟢 stop spinner
    }
  };

  return (
    <div className="add-expense">
      <h2>Add Expense</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && (
        <p style={{ color: message.includes("success") ? "green" : "red" }}>{message}</p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"} {/* 🌀 dynamic text */}
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
