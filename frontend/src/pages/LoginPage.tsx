import {useState} from "react";
import {useNavigate} from "react-router-dom";
import type {LoginParams} from "../services/auth/types.ts";
import {saveToken} from "../services/auth/storage.ts";
import {loginRequest} from "../services/auth/authService.ts";

export default function LoginPage() {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await loginRequest({ login, password } as LoginParams);
            saveToken(data.token);
            navigate('/teacher');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unknown error');
            }
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={login}
                    onChange={e => setLogin(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <div style={{color: 'red'}}>{error}</div>}
                <button type="submit">Войти</button>
            </form>
        </div>
    )
}
