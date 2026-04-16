export type LoginPayload = {
    email: string;
    password: string;
}

export type RegisterPayload = {
    email: string;
    password: string;
    name?: string;
}

export type AuthResponse = {
    success: boolean;
    message?: string;
}

export type User = {
    email: string;
    name?: string;
}