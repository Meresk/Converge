import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Table, TableHead, TableBody, TableRow, TableCell,
    IconButton, CircularProgress, Snackbar, Alert, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Box
} from '@mui/material';
import { Delete, Refresh, Edit, Add, Logout } from '@mui/icons-material';
import {
    fetchUsers, deleteUser, updateUser, createUser
} from '../services/users/usersService.ts';
import type { User, CreateUserParams } from '../services/users/types';
import { clearToken } from "../services/auth/storage.ts";

const emerald = '#2ecc71';
const emeraldDark = '#27ae60';

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const initialFormState = { login: '', password: '', roleID: 2 };
    const [formData, setFormData] = useState<CreateUserParams>(initialFormState);

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
        setFormData(initialFormState);
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
                setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
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
        <Container maxWidth="md" sx={{ py: 4, color: '#fff' }}>
            <Typography variant="h4" gutterBottom>
                Панель администратора
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    sx={{ backgroundColor: emerald, '&:hover': { backgroundColor: emeraldDark } }}
                    startIcon={<Add />}
                >
                    Добавить пользователя
                </Button>

                <Button
                    variant="outlined"
                    onClick={loadUsers}
                    startIcon={<Refresh />}
                    sx={{ borderColor: emerald, color: emerald, '&:hover': { borderColor: emeraldDark, color: emeraldDark } }}
                >
                    Обновить
                </Button>

                <Button
                    variant="text"
                    color="error"
                    onClick={handleLogout}
                    startIcon={<Logout />}
                    sx={{ marginLeft: 'auto' }}
                >
                    Выйти
                </Button>
            </Box>

            {loading ? (
                <CircularProgress sx={{ color: emerald, mt: 2 }} />
            ) : (
                <Table sx={{ mt: 2, backgroundColor: '#2c2c2c', borderRadius: 2, overflow: 'hidden' }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1f1f1f' }}>
                            <TableCell sx={{ color: emerald }}>ID</TableCell>
                            <TableCell sx={{ color: emerald }}>Логин</TableCell>
                            <TableCell sx={{ color: emerald }}>Роль</TableCell>
                            <TableCell align="right" sx={{ color: emerald }}>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, idx) => (
                            <TableRow
                                key={user.id}
                                sx={{
                                    backgroundColor: idx % 2 === 0 ? '#2a2a2a' : '#1e1e1e',
                                    '&:last-child td': { borderBottom: 0 }
                                }}
                            >
                                <TableCell sx={{ color: '#fff' }}>{user.id}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{user.login}</TableCell>
                                <TableCell sx={{ color: '#fff' }}>{user.role.name}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEdit(user)} sx={{ color: emerald }} size="small">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(user.id)} sx={{ color: '#e74c3c' }} size="small">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
                    {editingUser ? 'Редактировать пользователя' : 'Создать пользователя'}
                </DialogTitle>
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
                    <Button onClick={handleSave} sx={{ backgroundColor: emerald, color: '#fff', '&:hover': { backgroundColor: emeraldDark } }}>
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
        </Container>
    );
}
