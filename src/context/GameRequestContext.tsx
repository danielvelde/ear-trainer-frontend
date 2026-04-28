import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "./AuthContext.tsx";
import { fetchGameSession } from "../api/game.ts";
import type { GameSession } from "../api/game.ts";

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
        fetchGameSession(token, mode, amountOfQuestions, controller.signal)
            .then((data) => {
                setSession(data);
                setError(null);
            })
            .catch((err) => {
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
