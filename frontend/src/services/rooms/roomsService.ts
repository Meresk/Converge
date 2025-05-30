import {getToken} from "../auth/storage.ts";
import type {CreateRoomParams, JoinRoomParams, JoinRoomResponse, Room} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchOpenRooms(): Promise<Room[]> {
    const res = await fetch(`${API_BASE}/rooms/open`, {
        headers: {'Content-Type': 'application/json'},
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function fetchOwnRooms(onlyOpen: boolean): Promise<Room[]> {
    const token = getToken();
    const url = new URL(`${API_BASE}/rooms/own`);
    if (onlyOpen) {
        url.searchParams.append('onlyOpen', 'true');
    }

    const res = await fetch(url.toString(), {
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function createRoom(params: CreateRoomParams): Promise<Room> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/rooms`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : ``},
        body: JSON.stringify(params),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Create room failed (${res.status})`);
    }
    return res.json();
}

export async function joinRoom(params: JoinRoomParams): Promise<string> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/rooms/join`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : ``},
        body: JSON.stringify(params),
    })
    if (!res.ok) {
        const { message } = await res.json();
        const errorMessages: Record<string, string> = {
            'user with this nickname already in room': 'Пользователь с таким именем уже в комнате',
            'wrong room password': 'Неверный пароль',
        };
        const localizedMessage = errorMessages[message] || message || 'Не удалось подключиться к комнате';
        throw new Error(localizedMessage);
    }
    const data: JoinRoomResponse = await res.json();
    return data.token;
}

export async function toggleRoomStatus(id: number) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/rooms/${id}/toggle-status`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
}

export async function updateRoom(id: number, data: { name?: string; password?: string}): Promise<Room> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function deleteRoom(id: number): Promise<void> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/rooms/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
}
