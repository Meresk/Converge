import {getToken} from "../auth/storage.ts";
import type {CreateUserParams, User} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
}

export async function fetchUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/users`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function fetchUserById(id: number): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function createUser(params: CreateUserParams): Promise<User> {
    const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function updateUser(id: number, data: { login?: string; password?: string; roleId?: number, name?: string, surname?: string, patronymic?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function deleteUser(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
}
