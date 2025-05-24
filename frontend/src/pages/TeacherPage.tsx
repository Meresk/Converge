import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    Divider,
    Grid,
    Drawer,
    IconButton, ToggleButtonGroup, ToggleButton, createTheme, ThemeProvider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {createRoom, joinRoom, fetchOwnRooms, toggleRoomStatus} from '../services/rooms/roomsService.ts';
import type { Room } from '../services/rooms/types.ts';
import { clearToken } from '../services/auth/storage.ts';
import JoinRoomDialog from "../components/JoinRoomDialog.tsx";
import CreateRoomModal from "../components/CreateRoomDialog.tsx";
import RoomCard from "../components/RoomCard.tsx";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";
import { ruRU } from '@mui/x-data-grid/locales';
import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";

const drawerWidth = 250;

export default function TeacherPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const [nameError, setNameError] = useState(false);
    const [duplicateNameError, setDuplicateNameError] = useState(false);

    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [isSelectedRoomProtected, setIsSelectedRoomProtected] = useState(false);
    const [joinName, setJoinName] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [joinError, setJoinError] = useState('');

    const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
    const [allRooms, setAllRooms] = useState<Room[]>([]);

    useEffect(() => {
        loadRooms();
    }, []);

    const handleViewChange = async (
        _: React.MouseEvent<HTMLElement>,
        newView: 'cards' | 'table' | null
    ) => {
        if (newView) {
            setViewMode(newView);
            if (newView === 'table' && allRooms.length === 0) {
                try {
                    const data = await fetchOwnRooms(false);
                    setAllRooms(data);
                } catch (err) {
                    console.error(err);
                }
            }
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
            navigate('/room', { state: { token, selectedRoomId } });
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
            let data = await fetchOwnRooms(true);
            setRooms(data);
            data = await fetchOwnRooms(false);
            setAllRooms(data);
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
            await loadRooms();
        } catch (err: any) {
            console.error(err);
            if (err.message && err.message.includes('Duplicate entry')) {
                setDuplicateNameError(true);
            }
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
        { field: 'name', headerName: 'Название', flex: 1 },
        {
            field: 'startsAt',
            headerName: 'Открыта',
            flex: 1,
            renderCell: (params) => {
                if (!params.value) return '';
                const date = parseISO(params.value);
                return format(date, "d MMMM yyyy, HH:mm", { locale: ru });
            }
        },
        {
            field: 'endAt',
            headerName: 'Закрыта',
            flex: 1,
            renderCell: (params) => {
                if (!params.value) return '';
                const date = parseISO(params.value);
                return format(date, "d MMMM yyyy, HH:mm", { locale: ru });
            }
        },
        {
            field: 'isProtected',
            headerName: 'Защищена?',
            width: 130,
            renderCell: (params) => (params.value ? 'Да' : 'Нет'),
        },
        {
            field: 'toggleStatus',
            headerName: 'Действие',
            width: 130,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                const isClosed = !!params.row.endAt;

                const handleToggle = async () => {
                    const roomId = params.row.id;
                    try {
                        await toggleRoomStatus(roomId);

                            await loadRooms();
                            const updatedRooms = await fetchOwnRooms(false);
                            setAllRooms(updatedRooms);
                    } catch (err) {
                        alert('Не удалось изменить статус комнаты');
                    }
                };

                return (
                    <Button
                        variant="contained"
                        color={isClosed ? "success" : "error"}
                        size="small"
                        onClick={handleToggle}
                    >
                        {isClosed ? "Открыть" : "Закрыть"}
                    </Button>
                );
            }
        }
    ];
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: { main: "#2ecc71" },
            background: { default: '#1e1e1e', paper: '#1e1e1e' }
        },
        components: {
            MuiDataGrid: {
                styleOverrides: {
                    root: { border: 'none', color: '#fff', fontSize: '1.2rem'},
                    columnHeaders: { backgroundColor: '#1f1f1f', color: "#2ecc71" },
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

    const drawerContent = (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" mb={2}>
                Преподаватель
            </Typography>

            <Button
                variant="contained"
                sx={{
                    height: 44,
                    fontWeight: 'bold',
                    backgroundColor: '#2ecc71',
                    boxShadow: '0 2px 8px rgba(46, 204, 113, 0.4)',
                    mb: 2,
                    '&:hover': {
                        backgroundColor: '#27ae60',
                    },
                }}
                onClick={() => setShowModal(true)}
            >
                Создать комнату
            </Button>

            <ToggleButtonGroup
                fullWidth
                value={viewMode}
                exclusive
                onChange={handleViewChange}
                sx={{
                    height: 44,
                    mb: 3,
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #2ecc71',
                    boxShadow: '0 2px 8px rgba(46, 204, 113, 0.4)',
                    borderRadius: '8px',
                    '& .MuiToggleButton-root': {
                        flex: 1,
                        color: '#ffffff', // базовый цвет
                        border: 'none',
                        '&:hover': {
                            backgroundColor: '#2ecc7122',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#2ecc71',
                            color: '#ffffff', // принудительно белый текст
                            '&:hover': {
                                backgroundColor: '#27ae60',
                            },
                        },
                    },
                }}
            >
                <ToggleButton value="cards">Открытые</ToggleButton>
                <ToggleButton value="table">Все</ToggleButton>
            </ToggleButtonGroup>

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
                    overflowY: 'hidden',
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    bgcolor: '#121212',
                    display: 'flex',
                    flexDirection: 'column',
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

                <Typography variant="h4" gutterBottom color="white" sx={{ flexShrink: 0 }}>
                    Список ваших комнат
                </Typography>
                {viewMode === 'table' ? (
                    <Box sx={{ flexGrow: 1, height: 0, width: '100%' }}>
                        <ThemeProvider theme={theme}>
                            <DataGrid
                                rows={allRooms}
                                columns={columns}
                                pageSizeOptions={[5, 10, 20, 50, 100]}
                                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                                initialState={{
                                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                                }}
                                sx={{
                                    bgcolor: '#1e1e1e',
                                    border: '1px solid rgba(46, 204, 113, 0.3)', // мягкая зелёная обводка
                                    color: '#e0e0e0',

                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#2a2a2a',
                                        color: '#2ecc71',
                                        fontWeight: 'bold',
                                        borderBottom: '1px solid rgba(46, 204, 113, 0.3)', // мягкая обводка
                                    },

                                    '& .MuiDataGrid-cell': {
                                        borderBottom: '1px solid #333',
                                        color: '#eee',
                                    },

                                    '& .MuiDataGrid-row.Mui-selected': {
                                        backgroundColor: '#2ecc7122 !important',
                                    },
                                    '& .MuiDataGrid-row.Mui-selected:hover': {
                                        backgroundColor: '#2ecc7133 !important',
                                    },

                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#2ecc7111',
                                    },

                                    '& .MuiDataGrid-cell:focus-within': {
                                        outline: 'none',
                                    },
                                }}
                            />
                            </ThemeProvider>
                    </Box>
                ) : (
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
                )}
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
                duplicateNameError={duplicateNameError}
                setDuplicateNameError={setDuplicateNameError}
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
