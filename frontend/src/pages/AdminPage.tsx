import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Table, TableHead, TableBody, TableRow, TableCell,
    IconButton, CircularProgress, Snackbar, Alert, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField
} from '@mui/material';
import { Delete, Refresh, Edit, Add } from '@mui/icons-material';
import {
    fetchUsers, deleteUser, updateUser, createUser
} from '../services/users/usersService.ts';
import type { User, CreateUserParams } from '../services/users/types';
import {clearToken} from "../services/auth/storage.ts";

const emerald = '#2ecc71';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<CreateUserParams>({
        login: '',
        password: '',
        roleID: 2,
    });

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (e: any) {
            setError(e.message || 'Ошибка при загрузке пользователей');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить пользователя?')) return;
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setSuccessMessage('Пользователь удалён');
        } catch (e: any) {
            setError(e.message || 'Ошибка при удалении');
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            login: user.login,
            password: '',
            roleID: user.role.id,
        });
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({
            login: '',
            password: '',
            roleID: 2,
        });
        setDialogOpen(true);
    };

    const handleLogout = () => {
        clearToken();
        navigate('/');
    };

    const handleSave = async () => {
        try {
            if (editingUser) {
                const updated = await updateUser(editingUser.id, formData);
                setUsers((prev) =>
                    prev.map((u) => (u.id === updated.id ? updated : u))
                );
                setSuccessMessage('Пользователь обновлён');
            } else {
                const created = await createUser(formData);
                setUsers((prev) => [...prev, created]);
                setSuccessMessage('Пользователь создан');
            }
            setDialogOpen(false);
        } catch (e: any) {
            setError(e.message || 'Ошибка при сохранении');
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <Container sx={{ color: '#fff' }}>
            <Typography variant="h4" gutterBottom>Панель администратора</Typography>

            <Button
                variant="contained"
                onClick={handleCreate}
                sx={{ backgroundColor: emerald, mb: 2, mr: 2, '&:hover': { backgroundColor: '#27ae60' } }}
                startIcon={<Add />}
            >
                Добавить пользователя
            </Button>

            <Button
                variant="outlined"
                onClick={loadUsers}
                startIcon={<Refresh />}
                sx={{ borderColor: emerald, color: emerald, '&:hover': { borderColor: '#27ae60', color: '#27ae60' } }}
            >
                Обновить
            </Button>

            {loading ? (
                <CircularProgress sx={{ color: emerald, mt: 2 }} />
            ) : (
                <Table sx={{ mt: 2, backgroundColor: '#2c2c2c', borderRadius: 2 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: emerald }}>ID</TableCell>
                            <TableCell sx={{ color: emerald }}>Логин</TableCell>
                            <TableCell sx={{ color: emerald }}>Роль</TableCell>
                            <TableCell align="right" sx={{ color: emerald }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell sx={{ color: '#fff' }}>{user.id}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{user.login}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{user.role?.name || '—'}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEdit(user)} sx={{ color: emerald }}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)} sx={{ color: '#e74c3c' }}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}</DialogTitle>
                <DialogContent sx={{ backgroundColor: '#1e1e1e' }}>
                    <TextField
                        fullWidth
                        label="Логин"
                        value={formData.login}
                        onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                    <TextField
                        fullWidth
                        label="Пароль"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ style: { color: '#ccc' } }}
                        InputProps={{ style: { color: '#fff' } }}
                    />
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#1e1e1e' }}>
                    <Button onClick={() => setDialogOpen(false)} color="inherit">Отмена</Button>
                    <Button onClick={handleSave} sx={{ backgroundColor: emerald, color: '#fff', '&:hover': { backgroundColor: '#27ae60' } }}>
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>

            <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
                <Alert severity="success">{successMessage}</Alert>
            </Snackbar>

            <Button variant="outlined" color="error" onClick={handleLogout}>
                Выйти
            </Button>

        </Container>
    );
};

export default AdminPage;
