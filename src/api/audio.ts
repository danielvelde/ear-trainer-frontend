import { getJson, API_URL } from "./http.ts";

export interface SoundMeta {
    id: string;
    name: string;
}

export async function fetchSounds(): Promise<SoundMeta[]> {
    return getJson<SoundMeta[]>("/api/audio/sounds");
}

export async function fetchAudioBuffer(id: string): Promise<ArrayBuffer> {
    const res = await fetch(`${API_URL}/api/audio/get/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Audio fetch failed");
    return res.arrayBuffer();
}