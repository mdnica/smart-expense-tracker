import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

function Login ({ onLogin }) {
    const [username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                username: username,
                password: password
            })
        });

    const data = await response.json();

    if (response.ok) {
        alert('Login successful!');
        localStorage.setItem('token', data.access_token);
        window.location.href = '/dashboard';
    } else {
        setError(data.detail || 'Invalid username or password');
    }
} catch (err) {
    setError('Network error');
    console.error(err);
}
};

return (
    <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
           </form>
           {error && <p style={{ color: 'red'}}>{error}</p>}
        </div>
);
}





export default Login;