import {getToken} from "../auth/storage.ts";
import type {User} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchUsers(): Promise<User[]> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/users`, {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}