import type { SoundMeta } from "../api/audio.ts";

export interface SoundMap {
    map: Record<string, string>;
    noteOctaves: Record<string, number[]>;
}

export function buildSoundMap(sounds: SoundMeta[]): SoundMap {
    const map: Record<string, string> = {};
    const noteOctaves: Record<string, number[]> = {};
    for (const s of sounds) {
        const key = s.name.replace(" - sine", "");
        map[key] = s.id;
        const match = key.match(/^([A-G]s?)(\d)$/);
        if (match) {
            const root = match[1];
            const oct = parseInt(match[2]);
            if (!noteOctaves[root]) noteOctaves[root] = [];
            noteOctaves[root].push(oct);
        }
    }
    return { map, noteOctaves };
}

export function pickChoices(correct: string, allNotes: string[]): string[] {
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
