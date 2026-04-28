import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAnalytics } from "../api/analyzer";
import "./Dashboard.css";

function Dashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(0);
    const [amountOfQuestions, setAmountOfQuestions] = useState(5);
    const [analytics, setAnalytics] = useState<string | null>(null);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    const handleGetAnalytics = async () => {
        setLoadingAnalytics(true);
        setAnalyticsError(null);
        try {
            const res = await fetchAnalytics(token);
            setAnalytics(res.text);
        } catch (err) {
            setAnalyticsError(err instanceof Error ? err.message : "Request failed");
            setAnalytics(null);
        } finally {
            setLoadingAnalytics(false);
        }
    };

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
                <button
                    className="dashboard-analytics-btn"
                    onClick={handleGetAnalytics}
                    disabled={loadingAnalytics}
                >
                    {loadingAnalytics ? "Loading..." : "Get analytics"}
                </button>
                {analyticsError && (
                    <div className="dashboard-analytics-error">{analyticsError}</div>
                )}
                {analytics !== null && (
                    <div className="dashboard-analytics-result">{analytics}</div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;