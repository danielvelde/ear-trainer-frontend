import { useEffect, useState } from "react";
import { fetchSounds } from "../api/audio.ts";
import { buildSoundMap } from "../audio/soundMap.ts";

export function useSoundMap() {
    const [map, setMap] = useState<Record<string, string>>({});
    const [noteOctaves, setNoteOctaves] = useState<Record<string, number[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSounds()
            .then((sounds) => {
                if (sounds.length === 0) {
                    setError("No sounds returned from API");
                    return;
                }
                const built = buildSoundMap(sounds);
                if (Object.keys(built.map).length === 0) {
                    setError(`Sound names didn't match expected pattern. First name received: "${sounds[0].name}"`);
                    return;
                }
                setMap(built.map);
                setNoteOctaves(built.noteOctaves);
            })
            .catch((err) => setError(`Failed to fetch sounds: ${err}`))
            .finally(() => setLoading(false));
    }, []);

    return { map, noteOctaves, loading, error };
}
