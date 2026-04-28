import { API_URL } from "./http.ts";

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

export async function fetchGameSession(
    token: string | null,
    mode: string,
    amountOfQuestions: string,
    signal?: AbortSignal
): Promise<GameSession> {
    const res = await fetch(
        `${API_URL}/api/game/session?mode=${mode}&amountOfQuestions=${amountOfQuestions}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            signal,
        }
    );
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}

export async function submitSessionResult(
    token: string | null,
    sessionId: number,
    correctAnswers: boolean[]
): Promise<void> {
    const res = await fetch(`${API_URL}/api/game/session`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: sessionId, correctAnswers }),
    });
    if (!res.ok) throw new Error(String(res.status));
}
