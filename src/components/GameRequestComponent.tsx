import { useState, useCallback, useMemo, useEffect } from "react";
import { useGameRequest } from "../context/GameRequestContext.tsx";
import { fetchSounds, fetchAudioBuffer } from "../api/audio.ts";
import "../styles/GameRequestComponent.css";

function pickChoices(correct: string, allNotes: string[]): string[] {
    const distractors = allNotes.filter((n) => n !== correct);
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

function GameRequestComponent() {
    const { session, loading, error } = useGameRequest();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [soundMap, setSoundMap] = useState<Record<string, string>>({});
    const [noteOctaves, setNoteOctaves] = useState<Record<string, number[]>>({});
    const [soundsLoading, setSoundsLoading] = useState(true);
    const [soundsError, setSoundsError] = useState<string | null>(null);

    useEffect(() => {
        fetchSounds()
            .then((sounds) => {
                if (sounds.length === 0) {
                    setSoundsError("No sounds returned from API");
                    return;
                }
                const map: Record<string, string> = {};
                const octaves: Record<string, number[]> = {};
                for (const s of sounds) {
                    const key = s.name.replace(" - sine", "");
                    map[key] = s.id;
                    const match = key.match(/^([A-G]s?)(\d)$/);
                    if (match) {
                        const root = match[1];
                        const oct = parseInt(match[2]);
                        if (!octaves[root]) octaves[root] = [];
                        octaves[root].push(oct);
                    }
                }
                if (Object.keys(map).length === 0) {
                    setSoundsError(`Sound names didn't match expected pattern. First name received: "${sounds[0].name}"`);
                    return;
                }
                setSoundMap(map);
                setNoteOctaves(octaves);
            })
            .catch((err) => setSoundsError(`Failed to fetch sounds: ${err}`))
            .finally(() => setSoundsLoading(false));
    }, []);

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
        const ctx = new AudioContext();
        const ab = await fetchAudioBuffer(id);
        const buf = await ctx.decodeAudioData(ab);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start();
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
        return (
            <div className="game-over">
                <h2>Game over</h2>
                <p>Score: {score} / {session.sounds.length}</p>
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

export default GameRequestComponent;