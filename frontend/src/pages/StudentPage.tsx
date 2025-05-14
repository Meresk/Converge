import {useEffect, useState} from "react";

type Room = { id: number; name: string; isProtected: boolean };

export default function StudentPage() {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        fetch(`${API_BASE}/api/rooms/open`)
            .then(r => r.json())
            .then(setRooms);
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <h1>Доступные комнаты</h1>
            <ul>
                {rooms.map(r => (
                    <li key={r.id}>
                        {r.name} {r.isProtected ? '🔒' : ''}
                    </li>
                ))}
            </ul>
        </div>
    );
}