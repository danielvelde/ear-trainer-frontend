import { API_URL } from "./http.ts";

export interface SongRecommendation {
    track: string;
    artist: string;
    trackId: string;
    rootnote: string;
}

export function formatNote(note: string): string {
    return note.endsWith("s") && note.length === 2 ? note[0] + "#" : note;
}

export async function fetchRecommendations(token: string | null): Promise<SongRecommendation[]> {
    const res = await fetch(`${API_URL}/api/recommendations/worst`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}
