import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.tsx";

interface Sound {
    rootNote: string;
    chordType: string;
}

function SoundsRequestComponent() {
    const { token } = useAuth();
    const [sounds, setSounds] = useState<Sound[]>([]);

    useEffect(() => {
        const controller = new AbortController();

        fetch('http://localhost:8080/api/game/session', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            signal: controller.signal,
        })
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then(session => setSounds(session.sounds))
            .catch(err => {
                if (err !== 'AbortError') console.error("Failed to fetch session:", err);
            });

        return () => controller.abort();
    }, [token]);

    return (
        <div>
            {sounds.map((sound, index) => (
                <p key={index}>{sound.rootNote} - {sound.chordType}</p>
            ))}
        </div>
    );
}

export default SoundsRequestComponent;