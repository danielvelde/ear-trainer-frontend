import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardComponent() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(0);
    const [amountOfQuestions, setAmountOfQuestions] = useState(5);

    return (
        <div>
            <header>
                <h1>Ear Trainer</h1>
                <button onClick={logout}>Logout</button>
            </header>
            <main>
                <h2>Welcome to your Dashboard</h2>
                <p>Select mode and amount of questions & start playing!</p>
                <label>gamemode: </label>
                <select onChange={e => setMode(Number(e.target.value))} value={mode}>
                    <option value={0}>Single notes</option>
                    <option value={1}>Major and minor chords</option>
                </select>
                <br/>
                <label>questions amount: </label>
                <select onChange={e => setAmountOfQuestions(Number(e.target.value))} value={amountOfQuestions}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                </select>
                <div>
                    <button onClick={() => navigate(`/game?mode=${mode}&amountOfQuestions=${amountOfQuestions}`)}>Play</button>
                </div>
            </main>
        </div>
    );
}

export default DashboardComponent;
