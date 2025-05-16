import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Divider,
    Grid,
    Drawer,
    IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {fetchOpenRooms, createRoom, joinRoom} from '../services/rooms/roomsService.ts';
import type { Room } from '../services/rooms/types.ts';
import { clearToken } from '../services/auth/storage.ts';
import JoinRoomDialog from "../components/JoinRoomDialog.tsx";
import CreateRoomModal from "../components/CreateRoomDialog.tsx";
import RoomCard from "../components/RoomCard.tsx";

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
        } catch (error) {
            if (error instanceof Error) {
                setJoinError(error.message);
            } else {
                setJoinError('Ошибка подключения');
            }
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
                sx={{
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(33,150,243,0.4)',
                    mb: 2,
                }}
                onClick={() => setShowModal(true)}
            >
                Создать комнату
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Divider sx={{ my: 2, bgcolor: 'grey.700' }} />

            <Button  variant="outlined"
                     color="inherit"
                     sx={{
                         mb: 2,
                         borderColor: '#777',
                         color: '#ccc',
                         '&:hover': {
                             borderColor: '#aaa',
                             backgroundColor: 'rgba(255,255,255,0.05)',
                         },
                     }}
                     onClick={() => navigate('/')}>
                Назад
            </Button>

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
                            <RoomCard
                                name={room.name}
                                isProtected={room.isProtected}
                                onClick={() => handleJoinClick(room.id, room.isProtected)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <CreateRoomModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreate}
                newName={newName}
                setNewName={setNewName}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                nameError={nameError}
                setNameError={setNameError}
            />
            <JoinRoomDialog
                open={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                onJoin={handleJoinRoom}
                joinName={joinName}
                joinPassword={joinPassword}
                isProtected={isSelectedRoomProtected}
                joinError={joinError}
                setJoinName={setJoinName}
                setJoinPassword={setJoinPassword}
                setJoinError={setJoinError}
            />
        </Box>
    );
}
