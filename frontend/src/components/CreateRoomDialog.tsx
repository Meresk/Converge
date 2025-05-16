// components/CreateRoomModal.tsx
import { Box, Button, Typography, Modal, Fade, TextField } from '@mui/material';

interface CreateRoomModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
    newName: string;
    setNewName: (value: string) => void;
    newPassword: string;
    setNewPassword: (value: string) => void;
    nameError: boolean;
    setNameError: (value: boolean) => void;
}

export default function CreateRoomModal({
                                            open,
                                            onClose,
                                            onCreate,
                                            newName,
                                            setNewName,
                                            newPassword,
                                            setNewPassword,
                                            nameError,
                                            setNameError,
                                        }: CreateRoomModalProps) {
    return (
        <Modal open={open} onClose={onClose} closeAfterTransition>
            <Fade in={open}>
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
                            onClick={onClose}
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
                            onClick={onCreate}
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
    );
}
