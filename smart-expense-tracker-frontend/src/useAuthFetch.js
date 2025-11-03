import { useState, useCallback } from 'react';
import { refreshToken } from "./api";

export function useAuthFetch() {
    const [error, setError] = useState("");

    const authFetch = useCallback(async (url, options = {}) => {
        try {
            const token = localStorage.getItem("token");
            let response = await fetch(url, {
               ...options,
               headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                  ...(options.headers || {}),
               },
            });

            // If unauthorized, try refreshing the token
            if (response.status === 401) {
               try {
                  const newToken = await refreshToken(token);
                  localStorage.setItem("token", newToken);


                  response = await fetch(url, {
                     ...options,
                     headers: {
                     "Authorization": `Bearer ${newToken}`,
                     "Content-Type": "application/json",
                     ...(options.headers || {}),
                     },
                  });
               } catch (err) {
                 console.error("Token refresh failed:", err);
                 setError("Session expired. Please log in again");
               }
            }

            return response;
        } catch (err) {
          console.error("Auth fetch error:", err);
          setError("Network error - could not connect to server");
          throw err; // ensure Dashboard can handle it gracefullly
        }
    }, []); //useCallback ensures this never changes across renders

    return { authFetch, error };
}