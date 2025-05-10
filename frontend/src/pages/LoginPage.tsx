// src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string|null>(null);
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ login, password }),
            });
            if (!res.ok) throw new Error(await res.text());
            const { token } = await res.json();
            localStorage.setItem('jwt', token);
            navigate('/teacher');
        } catch (err: any) {
            setError(err.message || 'Ошибка входа');
        }
    };

    return (
        <div>

            <h1 className="text-2xl mb-4">Авторизация преподавателя</h1>
            <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
                {error && <div className="text-red-600">{error}</div>}
                <input
                    type="text" placeholder="Логин"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <input
                    type="password" placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}
