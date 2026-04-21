import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import "../styles/LoginPageComponent.css";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function LoginFormComponent() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.access_token);
                navigate("/dashboard", { replace: true });
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed");
            }
        } catch {
            setError("Could not connect to the server.");
        }
    }

    return (
        <div className="login-wrapper">
            <h1 className="login-title">Ear Trainer</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="login-field">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="login-error">{error}</p>}
                <button className="login-btn" type="submit">Sign in</button>
            </form>
        </div>
    );
}

export default LoginFormComponent;