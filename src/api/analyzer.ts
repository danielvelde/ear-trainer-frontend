import { API_URL } from "./http.ts";

export interface AnalyzerResponse {
    text: string;
}

export async function fetchAnalytics(token: string | null): Promise<AnalyzerResponse> {
    const res = await fetch(`${API_URL}/api/analyzer/getanalytics`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}