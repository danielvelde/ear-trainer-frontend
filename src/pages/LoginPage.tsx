import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import LoginPageComponent from "../components/LoginPageComponent.tsx";

function LoginPage() {
    const { isLoggedIn } = useAuth();
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;
    return <LoginPageComponent />;
}

export { LoginPage };