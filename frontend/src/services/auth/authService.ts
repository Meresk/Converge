import type {LoginParams, LoginResponse} from "./types.ts";
import {getDecodedToken} from "./storage.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function loginRequest(params: LoginParams): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
    }

    return res.json()
}

export function getUserRole(): string | null {
    const decoded = getDecodedToken();
    return decoded?.role ?? null;
}
