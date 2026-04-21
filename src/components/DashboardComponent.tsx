import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardComponent.css";

function DashboardComponent() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(0);
    const [amountOfQuestions, setAmountOfQuestions] = useState(5);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1 className="dashboard-heading">Ear Trainer</h1>
                <button className="dashboard-logout-btn" onClick={logout}>Logout</button>
            </header>
            <main className="dashboard-main">
                <div className="dashboard-intro">
                    <h2>Start a session</h2>
                    <p>Pick a mode and number of questions, then hit play.</p>
                </div>
                <div className="dashboard-options">
                    <div className="dashboard-option">
                        <label>Game mode</label>
                        <select onChange={e => setMode(Number(e.target.value))} value={mode}>
                            <option value={0}>Single notes</option>
                            <option value={1}>Major and minor chords</option>
                        </select>
                    </div>
                    <div className="dashboard-option">
                        <label>Questions</label>
                        <select onChange={e => setAmountOfQuestions(Number(e.target.value))} value={amountOfQuestions}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={25}>25</option>
                        </select>
                    </div>
                </div>
                <button
                    className="dashboard-play-btn"
                    onClick={() => navigate(`/game?mode=${mode}&amountOfQuestions=${amountOfQuestions}`)}
                >
                    Play
                </button>
            </main>
        </div>
    );
}

export default DashboardComponent;