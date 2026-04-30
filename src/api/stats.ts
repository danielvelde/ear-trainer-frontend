import { API_URL } from "./http.ts";

export interface SessionHistory {
    accuracy: number;
    score: number;
    createdAt: string;
}

export async function fetchSessionHistory(token: string | null): Promise<SessionHistory[]> {
    const res = await fetch(`${API_URL}/api/stats/history`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}
