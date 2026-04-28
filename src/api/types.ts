export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    defaultDifficulty: number;
};

export type AuthResponse = {
    access_token: string;
};
