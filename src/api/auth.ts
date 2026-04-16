import type { AuthResponse, LoginPayload, RegisterPayload } from "../auth/auth";
import { postJson } from "./http.ts";

export function login(payload: LoginPayload) {
    return postJson<AuthResponse, LoginPayload>("/api/auth/login", payload);
}

export function register(payload: RegisterPayload) {
    return postJson<AuthResponse, RegisterPayload>("/api/auth/register", payload);
}