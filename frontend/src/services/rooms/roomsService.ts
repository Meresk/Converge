import {getToken} from "../auth/storage.ts";
import type {CreateRoomParams, JoinRoomParams, JoinRoomResponse, Room} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchOpenRooms(): Promise<Room[]> {
    const res = await fetch(`${API_BASE}/api/rooms/open`, {
        headers: {'Content-Type': 'application/json'},
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    return res.json();
}

export async function fetchOwnRooms(): Promise<Room[]> {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/rooms/own`, {
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
    const res = await fetch(`${API_BASE}/api/rooms`, {
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
    const res = await fetch(`${API_BASE}/api/rooms/join`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : ``},
        body: JSON.stringify(params),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
    const data: JoinRoomResponse = await res.json();
    return data.token;
}

export async function toggleRoomStatus(id: number) {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/rooms/${id}/toggle-status`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message);
    }
}