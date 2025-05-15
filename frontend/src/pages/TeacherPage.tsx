import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent,
    Modal,
    TextField,
    Divider,
    Grid,
    Fade,
    Drawer,
    IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {fetchOpenRooms, createRoom, joinRoom} from '../services/rooms/roomsService.ts';
import type { Room } from '../services/rooms/types.ts';
import { clearToken } from '../services/auth/storage.ts';

const drawerWidth = 250;

export default function TeacherPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const [nameError, setNameError] = useState(false);

    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [isSelectedRoomProtected, setIsSelectedRoomProtected] = useState(false);
    const [joinName, setJoinName] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [joinError, setJoinError] = useState('');

    useEffect(() => {
        loadRooms();
    }, []);

    const handleJoinClick = (roomId: number, isProtected: boolean) => {
        setSelectedRoomId(roomId);
        setIsSelectedRoomProtected(isProtected);
        setJoinName('');
        setJoinPassword('');
        setJoinError('');
        setJoinModalOpen(true);
    };

    const handleJoinRoom = async () => {
        const trimmedName = joinName.trim();
        if (!trimmedName) {
            setJoinError('Имя не может быть пустым');
            return;
        }

        try {
            const token = await joinRoom({
                id: selectedRoomId!,
                nickname: trimmedName,
                password: joinPassword,
            });
            console.log(token);
        } catch (err: any) {
            setJoinError(err.message || 'Ошибка подключения');
        }
    };

    const loadRooms = async () => {
        try {
            const data = await fetchOpenRooms();
            setRooms(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreate = async () => {
        const trimmedName = newName.trim();
        if (!trimmedName) {
            setNameError(true);
            return;
        }

        try {
            await createRoom({ name: trimmedName, password: newPassword });
            setShowModal(false);
            setNewName('');
            setNewPassword('');
            setNameError(false);
            loadRooms();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        clearToken();
        navigate('/');
    };

    const drawerContent = (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" mb={2}>
                Преподаватель
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowModal(true)}
                sx={{ mb: 2 }}
            >
                Создать комнату
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2, bgcolor: 'grey.700' }} />

            <Button variant="outlined" color="error" onClick={handleLogout}>
                Выйти
            </Button>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            {/* Боковое меню */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={() => setMobileOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            bgcolor: 'grey.900',
                            color: 'white',
                        },
                    }}
                >
                    {drawerContent}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            bgcolor: 'grey.900',
                            color: 'white',
                        },
                    }}
                    open
                >
                    {drawerContent}
                </Drawer>
            </Box>

            {/* Основной контент */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    overflowY: 'auto',
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: '#121212',
                }}
            >
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={() => setMobileOpen(true)}
                    sx={{ display: { sm: 'none' }, mb: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h4" gutterBottom color="white">
                    Список открытых комнат
                </Typography>
                <Grid container columns={12} columnSpacing={3} rowSpacing={3}>
                    {/* Я НЕНАВИЖУ ЭТУ ОШИБКУ С GRID, ПУСТЬ ЧЕРТ КОТОРЫЙ ЭТО ПРИДУМАЛ ЗАСУНЕТ ЕЁ СЕБЕ В *** */}
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {rooms.map((room, index) => ( // @ts-expect-error
                        <Grid
                            xs={12}
                            sm={6}
                            md={4}
                            key={room.id}
                            sx={{
                                opacity: 0,
                                transform: 'translateY(20px)',
                                animation: 'fadeSlideIn 0.5s forwards',
                                animationDelay: `${index * 0.1}s`,
                                '@keyframes fadeSlideIn': {
                                    to: { opacity: 1, transform: 'translateY(0)' },
                                },
                            }}
                        >
                            <Card
                                onClick={() => handleJoinClick(room.id, room.isProtected)}
                                sx={{
                                    height: '100%',
                                    bgcolor: '#2a2a2a',
                                    color: '#eee',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0 8px 24px rgba(33, 150, 243, 0.6)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6">{room.name}</Typography>
                                    <Typography
                                        variant="body2"
                                        color={room.isProtected ? 'error' : 'success.main'}
                                        sx={{ mt: 1 }}
                                    >
                                        {room.isProtected ? '🔒 С паролем' : '🟢 Открытая комната'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Модальное окно */}
            <Modal open={showModal} onClose={() => setShowModal(false)} closeAfterTransition>
                <Fade in={showModal}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 420 },
                            bgcolor: '#1e1e1e',
                            color: 'white',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                            p: 4,
                            outline: 'none',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Typography variant="h6" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🎓 Создание новой комнаты
                        </Typography>

                        <TextField
                            fullWidth
                            label="Название*"
                            variant="outlined"
                            value={newName}
                            onChange={(e) => {
                                setNewName(e.target.value);
                                if (nameError && e.target.value.trim()) {
                                    setNameError(false);
                                }
                            }}
                            margin="normal"
                            error={nameError}
                            helperText={nameError ? 'Название не может быть пустым' : ''}
                            InputLabelProps={{
                                sx: { color: nameError ? 'error.main' : '#bbb' },
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: nameError ? 'error.main' : '#555',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: nameError ? 'error.main' : '#888',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: nameError ? 'error.main' : 'primary.main',
                                    },
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Пароль (необязательно)"
                            variant="outlined"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            margin="normal"
                            InputLabelProps={{
                                sx: { color: '#bbb' },
                            }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#555',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#888',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => setShowModal(false)}
                                sx={{
                                    borderColor: '#777',
                                    color: '#ccc',
                                    '&:hover': {
                                        borderColor: '#aaa',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                    },
                                }}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCreate}
                                color="primary"
                                sx={{
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 8px rgba(33,150,243,0.4)',
                                }}
                            >
                                Создать
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Modal open={joinModalOpen} onClose={() => setJoinModalOpen(false)} closeAfterTransition>
                <Fade in={joinModalOpen}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 420 },
                            bgcolor: '#1e1e1e',
                            color: 'white',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                            p: 4,
                            outline: 'none',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Typography variant="h6" mb={3}>
                            🔗 Подключение к комнате
                        </Typography>

                        <TextField
                            fullWidth
                            label="Ваше имя*"
                            value={joinName}
                            onChange={(e) => {
                                setJoinName(e.target.value);
                                if (joinError) setJoinError('');
                            }}
                            margin="normal"
                            error={!!joinError}
                            helperText={joinError || ''}
                            InputLabelProps={{ sx: { color: '#bbb' } }}
                            InputProps={{
                                sx: {
                                    color: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                },
                            }}
                        />

                        {isSelectedRoomProtected && (
                            <TextField
                                fullWidth
                                label="Пароль"
                                value={joinPassword}
                                onChange={(e) => setJoinPassword(e.target.value)}
                                margin="normal"
                                type="password"
                                InputLabelProps={{ sx: { color: '#bbb' } }}
                                InputProps={{
                                    sx: {
                                        color: 'white',
                                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888' },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' },
                                    },
                                }}
                            />
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => setJoinModalOpen(false)}
                                sx={{
                                    borderColor: '#777',
                                    color: '#ccc',
                                    '&:hover': {
                                        borderColor: '#aaa',
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                    },
                                }}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleJoinRoom}
                                color="primary"
                                sx={{
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 8px rgba(33,150,243,0.4)',
                                }}
                            >
                                Присоединиться
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </Box>
    );
}
