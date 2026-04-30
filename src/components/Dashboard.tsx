import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAnalytics } from "../api/analyzer";
import { fetchRecommendations, formatNote } from "../api/recommendations";
import { fetchSessionHistory, type SessionHistory } from "../api/stats";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ReactMarkdown from "react-markdown";
import "./Dashboard.css";

function Dashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [amountOfQuestions, setAmountOfQuestions] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState<string | null>(null);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [history, setHistory] = useState<SessionHistory[]>([]);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [recommendationTrackId, setRecommendationTrackId] = useState<string | null>(null);
    const [recommendationNote, setRecommendationNote] = useState<string | null>(null);
    const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

    useEffect(() => {
        fetchSessionHistory(token)
            .then(setHistory)
            .catch(err => setHistoryError(err instanceof Error ? err.message : "Failed to load history"));
    }, [token]);

    const handleGetAnalytics = async () => {
        setModalOpen(true);
        setAnalytics(null);
        setAnalyticsError(null);
        setLoadingAnalytics(true);
        try {
            const res = await fetchAnalytics(token);
            setAnalytics(res.text);
        } catch (err) {
            setAnalyticsError(err instanceof Error ? err.message : "Request failed");
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleGetRecommendations = async () => {
        setRecommendationTrackId(null);
        setRecommendationNote(null);
        setRecommendationsError(null);
        setLoadingRecommendations(true);
        try {
            const res = await fetchRecommendations(token);
            console.log("recommendations response:", res);
            setRecommendationTrackId(res[0]?.trackId ?? null);
            setRecommendationNote(res[0]?.rootnote ?? null);
            if (!res[0]?.trackId) {
                setRecommendationsError("No recommendation found for your weakest note.");
            }
        } catch (err) {
            setRecommendationsError(err instanceof Error ? err.message : "Request failed");
        } finally {
            setLoadingRecommendations(false);
        }
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div className="dashboard-logo">
                    <div className="dashboard-logo-icon">♪</div>
                    <h1 className="dashboard-heading">Ear Trainer</h1>
                </div>
                <button className="dashboard-logout-btn" onClick={logout}>Log out</button>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-card">
                    <div>
                        <p className="dashboard-card-title">New session</p>
                        <p className="dashboard-card-subtitle">How many questions do you want?</p>
                    </div>
                    <div className="dashboard-option">
                        <label htmlFor="questions-select">Questions</label>
                        <div className="dashboard-select-wrap">
                            <select
                                id="questions-select"
                                onChange={e => setAmountOfQuestions(Number(e.target.value))}
                                value={amountOfQuestions}
                            >
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
                        onClick={() => navigate(`/game?mode=0&amountOfQuestions=${amountOfQuestions}`)}
                    >
                        Start session
                    </button>
                </div>

                <div className="dashboard-analytics-card">
                    <p className="dashboard-analytics-title">Progress</p>
                    <p className="dashboard-analytics-subtitle">Accuracy over your last sessions.</p>
                    {historyError && <p className="dashboard-analytics-error">{historyError}</p>}
                    {!historyError && history.length === 0 && (
                        <p className="dashboard-analytics-subtitle">Play a session to see your progress here.</p>
                    )}
                    {history.length > 0 && (
                        <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={history} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="createdAt" hide />
                                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                                <Tooltip formatter={(v: number) => [`${v}%`, "Accuracy"]} labelFormatter={() => ""} />
                                <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="dashboard-analytics-card">
                    <div className="dashboard-analytics-header">
                        <div>
                            <p className="dashboard-analytics-title">AI analysis</p>
                            <p className="dashboard-analytics-subtitle">Get personalised feedback on your scores.</p>
                        </div>
                        <button
                            className="dashboard-analytics-btn"
                            onClick={handleGetAnalytics}
                        >
                            Analyse
                        </button>
                    </div>
                </div>

                <div className="dashboard-analytics-card">
                    <div className="dashboard-analytics-header">
                        <div>
                            <p className="dashboard-analytics-title">Song recommendation</p>
                            <p className="dashboard-analytics-subtitle">A song in your weakest key to train your ear.</p>
                        </div>
                        <button
                            className="dashboard-analytics-btn"
                            onClick={handleGetRecommendations}
                            disabled={loadingRecommendations}
                        >
                            {loadingRecommendations ? "Loading…" : "Get song"}
                        </button>
                    </div>
                    {recommendationsError && (
                        <p className="dashboard-analytics-error">{recommendationsError}</p>
                    )}
                    {recommendationTrackId && recommendationNote && (
                        <p className="recommendation-note-text">
                            You have difficulty with the note <strong>{formatNote(recommendationNote)}</strong>, so have a listen to this song. The root note of this song is <strong>{formatNote(recommendationNote)}</strong>.
                        </p>
                    )}
                    {recommendationTrackId && (
                        <iframe
                            style={{ borderRadius: "12px" }}
                            src={`https://open.spotify.com/embed/track/${recommendationTrackId}?utm_source=generator&theme=0`}
                            width="100%"
                            height="152"
                            frameBorder={0}
                            allowFullScreen
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            loading="lazy"
                        />
                    )}
                </div>
            </main>

            {modalOpen && (
                <div className="analytics-overlay" onClick={handleCloseModal}>
                    <div className="analytics-modal" onClick={e => e.stopPropagation()}>
                        <div className="analytics-modal-header">
                            <p className="analytics-modal-title">AI analysis</p>
                            <button className="analytics-modal-close" onClick={handleCloseModal}>✕</button>
                        </div>
                        <div className="analytics-modal-body">
                            {loadingAnalytics && (
                                <div className="analytics-loading">
                                    <div className="analytics-spinner" />
                                    <span>Analysing your scores…</span>
                                </div>
                            )}
                            {analyticsError && (
                                <p className="analytics-error">{analyticsError}</p>
                            )}
                            {analytics !== null && (
                                <div className="analytics-result">
                                    <ReactMarkdown>{analytics}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
