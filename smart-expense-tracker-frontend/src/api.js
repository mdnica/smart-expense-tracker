const API_URL ="http://127.0.0.1:8000"; //FastAPI backend URL

export async function loginUser(username, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            username: username,
            password: password,
            grant_type: "password", // <-- required for FastAPI OAuth2
        }),
    });

    if (!response.ok)  {
        throw new Error("Login failed");
}


    const data = await response.json();
    // Save JWT token to localStorage
    localStorage.setItem("token", data.access_token);
    return data;
}

export function getToken() {
    return localStorage.getItem("token");
}

// Add function getExpenses
export async function getExpenses(token) {
    const response = await fetch(`${API_URL}/expenses`, {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
    }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch expenses");
    }

    return await response.json();
}
