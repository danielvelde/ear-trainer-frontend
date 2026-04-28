import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { login as loginRequest } from "../api/auth.ts";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            const data = await loginRequest({ email, password });
            login(data.access_token);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "Login failed");
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

export default Login;
