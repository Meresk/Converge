import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {fetchOpenRooms, createRoom, type Room} from '../services/rooms/roomsService.ts';
import {clearToken} from "../services/auth/storage.ts";

export default function TeacherPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        try {
            const data = await fetchOpenRooms();
            setRooms(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async () => {
        try {
            await createRoom({ name: newName, password: newPassword });
            setShowModal(false);
            setNewName('');
            setNewPassword('');
            loadRooms();
        } catch (err) {
            console.error(err);
        }
    }

    const handleLogout = async () => {
        clearToken();
        navigate('/');
    }

    return (
        <div className="flex h-screen">
            <button onClick={handleLogout}>Выход</button>
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 text-white p-4">
                <h2 className="text-xl mb-4">Преподаватель</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded mb-2"
                >
                    Создать комнату
                </button>
                <button
                    onClick={() => navigate('/rooms')}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
                >
                    Мои комнаты
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl mb-4">Список комнат</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map(room => (
                        <div key={room.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                            <h3 className="text-lg font-semibold">{room.name}</h3>
                            {room.isProtected && <span className="text-red-500">🔒 С паролем</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h2 className="text-xl mb-4">Новая комната</h2>
                        <input
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Название"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                        />
                        <input
                            className="w-full border p-2 rounded mb-4"
                            placeholder="Пароль (необязательно)"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="mr-2 py-2 px-4 rounded border"
                            >Отмена</button>
                            <button
                                onClick={handleCreate}
                                className="py-2 px-4 bg-blue-600 text-white rounded"
                            >Создать</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
