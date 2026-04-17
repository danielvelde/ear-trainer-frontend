import { useState } from "react";
import * as React from "react";

function LoginFormComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const loginData = {
            email,
            password,
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // important for your JWT cookie
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json(); // your backend's JSON response
                console.log("Login success:", data);
                alert("Login successful!");
                localStorage.setItem("token", data.token);

                // Optional: redirect to a dashboard or protected route
                window.location.href = "/dashboard";
            } else {
                const errorData = await response.json();
                console.error("Server Error:", errorData);
                alert(`Error: ${errorData.message || "Login failed"}`);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("Could not connect to the backend.");
        }
    }

    return (
        <div>
            <form onSubmit={login}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default LoginFormComponent;