import React, { useState } from "react";
import { loginUser } from "./api";

function Login ({ onLogin }) {
    const [username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
        await loginUser(username, password);
        alert("Login successful!");
        window.location.href = "/dashboard"; //later, redirect to main app
    } catch (err) {
      setError("Invalid username or password");
    }
};


 return (
    <div className="login-container" style={styles.container}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                required
            />
            <button type="submit" style={styles.button}>Login</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
        </div>

 );
}

const styles = {
    container: {
        maxWidth: "300px",
        margin: "100px auto",
        textAlign: "center",
        background: "#f5f5f5",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    },

    form: {
        display: "flex",
        flexDirection: "column",

    },

    input: {
        margin: "8px 0",
        padding: "10px",
        fontSize: "16px",
    },

    button : {
        background: "#007bff",
        color: "white",
        border: "none",
        padding: "10px",
        cursor: "pointer",
        borderRadius: "5px",
    },

    error: {
        color: "red",
        marginTop: "10px",
    },

};


export default Login;