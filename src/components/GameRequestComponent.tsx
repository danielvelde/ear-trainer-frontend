import { useGameRequest } from "../context/GameRequestContext.tsx";

function GameRequestComponent() {
    const { session, loading, error } = useGameRequest();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!session) return null;

    return (
        <div>
            {session.sounds.map((sound, index) => (
                <p key={index}>{sound.rootNote} - {sound.chordType}</p>
            ))}
        </div>
    );
}

export default GameRequestComponent;