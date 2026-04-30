import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchAnalytics } from "../api/analyzer";
import { fetchRecommendations, formatNote } from "../api/recommendations";
import ReactMarkdown from "react-markdown";
import "./Dashboard.css";

function Dashboard() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [mode, setMode] = useState(0);
    const [amountOfQuestions, setAmountOfQuestions] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [analytics, setAnalytics] = useState<string | null>(null);
    const [analyticsError, setAnalyticsError] = useState<string | null>(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [recommendationTrackId, setRecommendationTrackId] = useState<string | null>(null);
    const [recommendationNote, setRecommendationNote] = useState<string | null>(null);
    const [recommendationsError, setRecommendationsError] = useState<string | null>(null);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);

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
                        <p className="dashboard-card-subtitle">Pick a mode and number of questions.</p>
                    </div>
                    <div className="dashboard-options">
                        <div className="dashboard-option">
                            <label htmlFor="mode-select">Game mode</label>
                            <div className="dashboard-select-wrap">
                                <select
                                    id="mode-select"
                                    onChange={e => setMode(Number(e.target.value))}
                                    value={mode}
                                >
                                    <option value={0}>Single notes</option>
                                    <option value={1}>Major and minor chords</option>
                                </select>
                            </div>
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
                    </div>
                    <button
                        className="dashboard-play-btn"
                        onClick={() => navigate(`/game?mode=${mode}&amountOfQuestions=${amountOfQuestions}`)}
                    >
                        Start session
                    </button>
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
