import { useEffect, useState } from 'react';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    createTheme,
    ThemeProvider
} from '@mui/material';
import { ruRU } from '@mui/x-data-grid/locales';
import { Add, Refresh, Logout, Edit, Delete } from '@mui/icons-material';
import {
    DataGrid,
    type GridColDef,
    type GridRenderCellParams,
    type GridPaginationModel,
    type GridSortModel
} from '@mui/x-data-grid';
import {
    fetchUsers,
    deleteUser,
    updateUser,
    createUser
} from '../services/users/usersService';
import type { User, CreateUserParams } from '../services/users/types';
import { clearToken } from '../services/auth/storage';

const emerald = '#2ecc71';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: emerald },
        background: { default: '#121212', paper: '#1e1e1e' }
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: { border: 'none', color: '#fff' },
                columnHeaders: { backgroundColor: '#1f1f1f', color: emerald },
                cell: { color: '#fff' },
                footerContainer: { backgroundColor: '#1f1f1f' },
                row: {
                    '&.Mui-even': { backgroundColor: '#2a2a2a' },
                    '&.Mui-odd': { backgroundColor: '#1e1e1e' }
                }
            }
        }
    }
});

export default function AdminPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const initialFormState: CreateUserParams = { login: '', password: '', roleID: 2 };
    const [formData, setFormData] = useState<CreateUserParams>(initialFormState);

    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);

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

    useEffect(() => { loadUsers(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Удалить пользователя?')) return;
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            setSuccessMessage('Пользователь удалён');
        } catch (e: any) {
            setError(e.message || 'Ошибка при удалении');
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({ login: user.login, password: '', roleID: user.role.id });
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData(initialFormState);
        setDialogOpen(true);
    };

    const handleSave = async () => {
        try {
            if (editingUser) {
                const updated = await updateUser(editingUser.id, formData);
                setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                setSuccessMessage('Пользователь обновлён');
            } else {
                const created = await createUser(formData);
                setUsers(prev => [...prev, created]);
                setSuccessMessage('Пользователь создан');
            }
            setDialogOpen(false);
        } catch (e: any) {
            setError(e.message || 'Ошибка при сохранении');
        }
    };

    const handleLogout = () => {
        clearToken();
        navigate('/');
    };

    const columns: GridColDef[] = [
        {
            field: 'index',
            headerName: '№',
            width: 70,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const rowIds = params.api.getAllRowIds();
                const index = rowIds.indexOf(params.id);
                return index + 1;
            }
        },
        { field: 'login', headerName: 'Логин', flex: 1, sortable: true },
        {
            field: 'role',
            headerName: 'Роль',
            flex: 1,
            sortable: true,
            renderCell: (params: GridRenderCellParams<User>) => {
                const roleName = params.row.role?.name;
                return roleName === 'admin'
                    ? 'Администратор'
                    : roleName === 'teacher'
                        ? 'Преподаватель'
                        : roleName ?? '';
            }
        },
        {
            field: 'actions', headerName: 'Действия', width: 120, sortable: false,
            renderCell: (params: GridRenderCellParams<User>) => (
                <>
                    <IconButton size="small" onClick={() => handleEdit(params.row)} color="primary">
                        <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(params.row.id)} sx={{ color: '#e74c3c' }}>
                        <Delete fontSize="small" />
                    </IconButton>
                </>
            )
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">Панель администратора</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <Button variant="contained" onClick={handleCreate} startIcon={<Add />}>Добавить</Button>
                    <Button variant="outlined" onClick={loadUsers} startIcon={<Refresh />}>Обновить</Button>
                    <Button variant="text" color="error" onClick={handleLogout} startIcon={<Logout />} sx={{ marginLeft: 'auto' }}>Выйти</Button>
                </Box>

                {loading ? (
                    <CircularProgress color="primary" sx={{ mt: 2 }} />
                ) : (
                    <Box sx={{ height: 500, background: 'paper' }}>
                        <DataGrid
                            rows={users}
                            columns={columns}
                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                            pagination
                            paginationModel={paginationModel}
                            onPaginationModelChange={model => setPaginationModel(model)}
                            pageSizeOptions={[5, 10, 20, 50, 100]}
                            sortingMode="client"
                            sortModel={sortModel}
                            onSortModelChange={model => setSortModel(model)}
                            getRowId={row => row.id}
                            sx={{
                                height: 600,
                                width: '100%',
                                fontSize: '1rem', // Увеличение размера шрифта
                                '& .MuiDataGrid-columnHeaders': {
                                    fontSize: '1.1rem', // Размер шрифта заголовков
                                },
                                '& .MuiDataGrid-cell': {
                                    fontSize: '1rem', // Размер шрифта ячеек
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Диалог */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{editingUser ? 'Редактировать' : 'Создать'} пользователя</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth label="Логин" value={formData.login}
                            onChange={e => setFormData({ ...formData, login: e.target.value })}
                            margin="normal"
                        />
                        <TextField
                            fullWidth label="Пароль" type="password" value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            margin="normal"
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="role-select-label">Роль</InputLabel>
                            <Select
                                labelId="role-select-label"
                                value={formData.roleID}
                                label="Роль"
                                onChange={e => setFormData({ ...formData, roleID: Number(e.target.value) })}
                            >
                                <MenuItem value={1}>Администратор</MenuItem>
                                <MenuItem value={2}>Преподаватель</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
                        <Button onClick={handleSave} variant="contained" color="primary">Сохранить</Button>
                    </DialogActions>
                </Dialog>

                {/* Уведомления */}
                <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
                    <Alert severity="error">{error}</Alert>
                </Snackbar>
                <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
                    <Alert severity="success">{successMessage}</Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}