import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../api/auth.ts";
import "./Login.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        try {
            await registerRequest({ email, password, defaultDifficulty: 0 });
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err instanceof Error && err.message ? err.message : "Registration failed");
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
                <button className="login-btn" type="submit">Sign up</button>
            </form>
        </div>
    );
}

export default Signup;
