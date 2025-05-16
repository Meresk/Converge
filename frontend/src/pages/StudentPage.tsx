import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Tooltip,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { fetchOpenRooms, joinRoom } from '../services/rooms/roomsService.ts';
import type { Room } from '../services/rooms/types.ts';
import JoinRoomDialog from "../components/JoinRoomDialog.tsx";
import RoomCard from "../components/RoomCard.tsx";

export default function StudentPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const navigate = useNavigate();

    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [isSelectedRoomProtected, setIsSelectedRoomProtected] = useState(false);
    const [joinName, setJoinName] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [joinError, setJoinError] = useState('');

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

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Box sx={{ height: '100vh', bgcolor: '#121212', p: 3, position: 'relative' }}>
            {/* Кнопка выхода в правом верхнем углу */}
            <Tooltip title="Выйти">
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        position: 'fixed',
                        top: 16,
                        right: 16,
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                    }}
                    size="small"
                >
                    <ExitToAppIcon />
                </IconButton>
            </Tooltip>

            <Typography variant="h4" gutterBottom color="white" sx={{ mb: 4 }}>
                Список открытых комнат
            </Typography>

            <Grid container columns={12} columnSpacing={3} rowSpacing={3}>
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
