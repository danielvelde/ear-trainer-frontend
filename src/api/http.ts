const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function postJson<TResponse, TBody>(
    path: string,
    body: TBody
): Promise<TResponse> {
    const res = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
    }

    return res.json() as Promise<TResponse>;
}