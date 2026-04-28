import { fetchAudioBuffer } from "../api/audio.ts";

export async function playNote(id: string): Promise<void> {
    const ctx = new AudioContext();
    const ab = await fetchAudioBuffer(id);
    const buf = await ctx.decodeAudioData(ab);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
}
