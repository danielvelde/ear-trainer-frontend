import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import Login from "../components/Login.tsx";

function LoginPage() {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;
    return <Login />;
}

export { LoginPage };