import { getToken } from "../auth/storage.ts";
import type {RoomFile} from "./types.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Получить файлы комнаты
export async function fetchRoomFiles(roomId: number): Promise<RoomFile[]> {
    const url = new URL(`${API_BASE}/files`);
    url.searchParams.append("room_id", roomId.toString());

    const res = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Ошибка получения файлов комнаты (${res.status})`);
    }

    return res.json();
}

// Загрузить файл в комнату
export async function uploadRoomFile(roomId: number, file: File): Promise<RoomFile> {
    const token = getToken();
    const url = new URL(`${API_BASE}/files`);
    url.searchParams.append("room_id", roomId.toString());

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
            // Не ставим Content-Type, fetch поставит multipart/form-data сам
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Ошибка загрузки файла (${res.status})`);
    }

    return await res.json() as Promise<RoomFile>;
}

// Скачать файл по id (можно использовать напрямую в href или через fetch + blob)
export function getRoomFileDownloadUrl(fileId: number): string {
    return `${API_BASE}/files/${fileId}`;
}

// Удалить файл по id
export async function deleteRoomFile(fileId: number): Promise<void> {
    const token = getToken();

    const res = await fetch(`${API_BASE}/files/${fileId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Ошибка удаления файла (${res.status})`);
    }
}
