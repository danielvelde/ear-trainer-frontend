import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";

export interface Sound {
    rootNote: string;
    chordType: string;
}

export interface GameSession {
    id: number;
    mode: number;
    amountOfQuestions: number;
    sounds: Sound[];
}

interface GameRequestContextType {
    session: GameSession | null;
    loading: boolean;
    error: string | null;
}

const GameRequestContext = createContext<GameRequestContextType | null>(null);

export function GameRequestProvider({ children }: { children: ReactNode }) {
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get("mode") ?? "0";
    const amountOfQuestions = searchParams.get("amountOfQuestions") ?? "5";
    const [session, setSession] = useState<GameSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL ?? "null";
        fetch(`${apiUrl}/api/game/session?mode=${mode}&amountOfQuestions=${amountOfQuestions}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            signal: controller.signal,
        })
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then((data: GameSession) => {
                setSession(data);
                setError(null);
            })
            .catch(err => {
                if (err?.name !== "AbortError") setError(`Failed to fetch session: ${err}`);
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [token, mode, amountOfQuestions]);

    return (
        <GameRequestContext.Provider value={{ session, loading, error }}>
            {children}
        </GameRequestContext.Provider>
    );
}

export function useGameRequest() {
    const ctx = useContext(GameRequestContext);
    if (!ctx) throw new Error("useGameRequest must be used within GameRequestProvider");
    return ctx;
}