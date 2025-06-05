import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Grid,
    IconButton,
    Tooltip,
    Container,
    TextField,
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SearchIcon from '@mui/icons-material/Search';
import { fetchOpenRooms, joinRoom } from '../services/rooms/roomsService.ts';
import type { Room } from '../services/rooms/types.ts';
import JoinRoomDialog from "../components/dialogs/JoinRoomDialog.tsx";
import RoomCard from "../components/RoomCard.tsx";
import { customProfanityWords } from "../types/customProfanityWords.ts";
import CloseIcon from '@mui/icons-material/Close';

export default function StudentPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [isSelectedRoomProtected, setIsSelectedRoomProtected] = useState(false);
    const [joinName, setJoinName] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [joinNameError, setJoinNameError] = useState('');
    const [joinPasswordError, setJoinPasswordError] = useState('');
    const [showSearch, setShowSearch] = useState(false);

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
        setJoinNameError('');
        setJoinPasswordError('');
        setJoinModalOpen(true);
    };

    const handleJoinRoom = async () => {
        setJoinNameError('');
        setJoinPasswordError('');

        const trimmedName = joinName.trim();
        if (!trimmedName) {
            setJoinNameError('Имя не может быть пустым');
            return;
        }

        const trimmedLowerName = trimmedName.toLowerCase();
        if (customProfanityWords.some(word => trimmedLowerName.includes(word))) {
            setJoinNameError('Пожалуйста, введите корректное имя без нецензурных слов');
            return;
        }

        try {
            const token = await joinRoom({
                id: selectedRoomId!,
                nickname: trimmedName,
                password: joinPassword,
            });
            navigate('/room', { state: { token, selectedRoomId } });
        } catch (error) {
            if (error instanceof Error) {
                const message = error.message;
                if (message.includes('уже существует') || message.includes('Пользователь с таким именем')) {
                    setJoinNameError('Пользователь с таким именем уже в комнате');
                } else if (message.includes('Неверный пароль')) {
                    setJoinPasswordError('Неверный пароль');
                } else {
                    setJoinNameError(message);
                }
            } else {
                setJoinNameError('Ошибка подключения');
            }
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const filteredRooms = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return rooms.filter((room) =>
            room.name.toLowerCase().includes(query) ||
            `${room.ownerSurname} ${room.ownerName} ${room.ownerPatronymic}`.toLowerCase().includes(query)
        );
    }, [rooms, searchQuery]);

    return (
        <Box
            sx={{
                minHeight: 'calc(100vh - 32px - 64px)',
                bgcolor: '#121212',
                pt: 4,
                pb: 8,
                position: 'relative',
                overflowX: 'hidden',
            }}
        >
            <Tooltip title="Выйти">
                <IconButton
                    onClick={handleLogout}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        zIndex: 10,
                    }}
                >
                    <ExitToAppIcon />
                </IconButton>
            </Tooltip>

            <Box
                sx={{
                    position: 'fixed',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    alignItems: 'center',
                    zIndex: 10,
                }}
            >
                <Box
                    sx={{
                        transition: 'width 0.4s ease, opacity 0.4s ease',
                        overflow: 'hidden',
                        width: showSearch ? 250 : 0,
                        opacity: showSearch ? 1 : 0,
                        mr: showSearch ? 1 : 0,
                    }}
                >
                    <TextField
                        size="small"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        InputProps={{
                            sx: {
                                bgcolor: '#1e1e1e',
                                borderRadius: 2,
                                color: 'white',
                                height: 40,
                            },
                        }}
                        sx={{
                            width: '100%',
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#444' },
                                '&:hover fieldset': { borderColor: '#2ecc71' },
                                '&.Mui-focused fieldset': { borderColor: '#2ecc71' },
                            },
                            '& input': { color: 'white' },
                        }}
                    />
                </Box>

                <IconButton
                    onClick={() => setShowSearch((prev) => !prev)}
                    sx={{
                        color: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                        transition: 'transform 0.3s ease',
                    }}
                >
                    {showSearch ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
            </Box>




            <Container maxWidth="xl">

                <Typography
                    variant="h4"
                    align="center"
                    color="white"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                    }}
                >
                    Список комнат
                </Typography>


                <Grid container spacing={4} justifyContent="center">
                    {filteredRooms.map((room, index) => (
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        <Grid
                            item
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
                                ownerFullName={`${room.ownerSurname} ${room.ownerName} ${room.ownerPatronymic}`}
                                onClick={() => handleJoinClick(room.id, room.isProtected)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <JoinRoomDialog
                open={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                onJoin={handleJoinRoom}
                joinName={joinName}
                joinPassword={joinPassword}
                isProtected={isSelectedRoomProtected}
                joinNameError={joinNameError}
                joinPasswordError={joinPasswordError}
                setJoinName={setJoinName}
                setJoinPassword={setJoinPassword}
                setJoinNameError={setJoinNameError}
                setJoinPasswordError={setJoinPasswordError}
            />
        </Box>
    );
}
