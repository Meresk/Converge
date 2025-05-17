import { useEffect, useState } from 'react';
import type {User} from "../services/users/types.ts";
import {fetchUsers} from "../services/users/usersService.ts";
import {Button} from "@mui/material";
import {clearToken} from "../services/auth/storage.ts";
import {useNavigate} from "react-router-dom";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate('/');
    };

    useEffect(() => {
        fetchUsers()
            .then(setUsers)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div>
            <h1>Пользователи</h1>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Логин</th>
                    <th>Роль</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.login}</td>
                        <td>{u.role.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Button variant="outlined" color="error" onClick={handleLogout}>
                Выйти
            </Button>
        </div>
    );
}
