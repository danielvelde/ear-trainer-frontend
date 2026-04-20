import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardComponent() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            <header>
                <h1>Ear Trainer</h1>
                <button onClick={logout}>Logout</button>
            </header>
            <main>
                <h2>Welcome to your Dashboard</h2>
                <p>Select an exercise to get started.</p>
                <div>
                    <button onClick={() => navigate("/game")}>Play</button>
                </div>
            </main>
        </div>
    );
}

export default DashboardComponent;
