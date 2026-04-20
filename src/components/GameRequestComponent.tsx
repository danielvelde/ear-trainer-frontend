import { useState, useCallback, useMemo } from "react";
import { useGameRequest } from "../context/GameRequestContext.tsx";

const noteFiles = import.meta.glob<string>("../assets/notes/*.wav", { eager: true, query: "?url", import: "default" });

const NOTE_OCTAVES: Record<string, number[]> = {
    C: [4, 5], Cs: [4, 5], D: [4, 5], Ds: [4, 5], E: [4, 5],
    F: [3, 4], Fs: [3, 4], G: [3, 4], Gs: [3, 4], A: [3, 4], As: [3, 4], B: [3, 4],
};

const ALL_NOTES = Object.keys(NOTE_OCTAVES);

function pickChoices(correct: string): string[] {
    const distractors = ALL_NOTES.filter((n) => n !== correct);
    for (let i = distractors.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
    }
    const four = [correct, ...distractors.slice(0, 3)];
    for (let i = four.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [four[i], four[j]] = [four[j], four[i]];
    }
    return four;
}

async function playNote(rootNote: string) {
    const octaves = NOTE_OCTAVES[rootNote];
    if (!octaves) return;
    const octave = octaves[Math.floor(Math.random() * octaves.length)];
    const url = noteFiles[`../assets/notes/${rootNote}${octave}.wav`];
    if (!url) return;
    const ctx = new AudioContext();
    const buf = await fetch(url).then((r) => r.arrayBuffer()).then((ab) => ctx.decodeAudioData(ab));
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
}

function GameRequestComponent() {
    const { session, loading, error } = useGameRequest();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const options = useMemo(
        () => (session ? pickChoices(session.sounds[currentIndex].rootNote) : []),
        [session, currentIndex]
    );

    const handlePlay = useCallback(() => {
        if (!session) return;
        playNote(session.sounds[currentIndex].rootNote);
    }, [session, currentIndex]);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!session) return null;

    if (done) {
        return (
            <div>
                <h2>Game over</h2>
                <p>Score: {score} / {session.sounds.length}</p>
            </div>
        );
    }

    const current = session.sounds[currentIndex];

    return (
        <div>
            <p>Question {currentIndex + 1} of {session.sounds.length}</p>
            <button onClick={handlePlay}>Play</button>
            <div>
                {options.map((opt) => {
                    const isCorrect = selected && opt === current.rootNote;
                    const isWrong = selected && opt === selected && opt !== current.rootNote;
                    return (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            disabled={!!selected}
                            style={isCorrect ? { color: "green" } : isWrong ? { color: "red" } : {}}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
            {selected && <button onClick={handleNext}>Next</button>}
        </div>
    );
}

export default GameRequestComponent;