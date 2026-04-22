import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGameRequest } from "../context/GameRequestContext.tsx";
import { useSoundMap } from "../hooks/useSoundMap.ts";
import { pickChoices } from "../audio/soundMap.ts";
import { playNote } from "../audio/player.ts";
import "./GameQuiz.css";

function GameQuiz() {
    const { session, loading, error } = useGameRequest();
    const { map: soundMap, noteOctaves, loading: soundsLoading, error: soundsError } = useSoundMap();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const allNotes = useMemo(() => Object.keys(noteOctaves), [noteOctaves]);

    const options = useMemo(
        () => (session && allNotes.length > 0 ? pickChoices(session.sounds[currentIndex].rootNote, allNotes) : []),
        [session, currentIndex, allNotes]
    );

    const handlePlay = useCallback(async () => {
        if (!session) return;
        const rootNote = session.sounds[currentIndex].rootNote;
        const octaves = noteOctaves[rootNote];
        if (!octaves || octaves.length === 0) return;
        const octave = octaves[Math.floor(Math.random() * octaves.length)];
        const id = soundMap[`${rootNote}${octave}`];
        if (!id) return;
        await playNote(id);
    }, [session, currentIndex, soundMap, noteOctaves]);

    const handleSelect = useCallback(
        (choice: string) => {
            if (selected || !session) return;
            setSelected(choice);
            if (choice === session.sounds[currentIndex].rootNote) setScore((s) => s + 1);
        },
        [selected, session, currentIndex]
    );

    const handleNext = useCallback(() => {
        if (!session) return;
        if (currentIndex + 1 >= session.sounds.length) {
            setDone(true);
        } else {
            setCurrentIndex((i) => i + 1);
            setSelected(null);
        }
    }, [currentIndex, session]);

    if (loading || soundsLoading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (soundsError) return <p>{soundsError}</p>;
    if (!session) return null;

    if (done) {
        const total = session.sounds.length;
        const pct = Math.round((score / total) * 100);
        return (
            <div className="game-over">
                <p className="game-over-label">Session complete</p>
                <div className="game-over-score">{score}<span>/{total}</span></div>
                <p className="game-over-pct">{pct}% correct</p>
                <button className="game-next-btn" onClick={() => navigate("/dashboard")}>
                    Play again
                </button>
            </div>
        );
    }

    const current = session.sounds[currentIndex];

    return (
        <div className="game-wrapper">
            <p className="game-progress">Question {currentIndex + 1} of {session.sounds.length}</p>
            <button className="game-play-btn" onClick={handlePlay}>▶</button>
            <div className="game-choices">
                {options.map((opt) => {
                    const isCorrect = selected && opt === current.rootNote;
                    const isWrong = selected && opt === selected && opt !== current.rootNote;
                    return (
                        <button
                            key={opt}
                            className={`game-choice-btn${isCorrect ? " correct" : isWrong ? " wrong" : ""}`}
                            onClick={() => handleSelect(opt)}
                            disabled={!!selected}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
            {selected && <button className="game-next-btn" onClick={handleNext}>Next →</button>}
        </div>
    );
}

export default GameQuiz;
